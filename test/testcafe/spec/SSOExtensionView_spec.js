import { RequestLogger, RequestMock, ClientFunction } from 'testcafe';
import BasePageObject from '../framework/page-objects/BasePageObject';
import identifyWithAppleSSOExtension from '../../../playground/mocks/idp/idx/data/identify-with-apple-sso-extension';

const logger = RequestLogger(/introspect|verify/, { logRequestBody: true, stringifyRequestBody: true });

const mock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(identifyWithAppleSSOExtension)
  .onRequestTo('http://localhost:3000/idp/idx/authenticators/sso_extension/transactions/123/verify')
  .respond('<html><body>Success</body></html>')

fixture(`Apple SSO Extension View`)
  .requestHooks(logger, mock)

const getPageUrl = ClientFunction(() => window.location.href);
// test(`should have the correct content`, async t => {
//   const ssoExtensionPage = new BasePageObject(t);
//   await ssoExtensionPage.navigateToPage();
//   await t.expect(logger.count(
//     record => record.response.statusCode === 200 &&
//     record.request.url.match(/introspect/)
//   )).eql(1);
//   await t.expect(logger.count(
//     record => record.response.statusCode === 200 &&
//     record.request.method === 'post' &&
//     record.request.url.match(/authenticators\/sso_extension\/transactions\/123\/verify/)
//   )).eql(1);
//   const pageUrl = getPageUrl();
//   await t.expect(pageUrl).contains('stateToken=abc123');
// });

test(`should have the correct content`, async t => {
  const ssoExtensionPage = new BasePageObject(t);
  await ssoExtensionPage.navigateToPage();
  await t.expect(logger.count(
    record => record.response.statusCode === 200 &&
    record.request.url.match(/introspect/)
  )).eql(1);
  // t.debug(); 
  console.log(logger.requests.filter(request => request.method === 'post' && request.url.match(/authenticators\/sso_extension\/transactions\/123\/verify/)));
  // t.debug();
  await t.expect(logger.count(
    record => record.response.statusCode === 200 &&
    record.request.method === 'post' &&
    record.request.url.match(/authenticators\/sso_extension\/transactions\/123\/verify/) &&
    record.request.body === 'challenge'
  )).eql(1);
  await t.expect(getPageUrl()).contains('/idp/idx/authenticators/sso_extension/transactions/123/verify');
});
