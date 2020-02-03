import { loc } from 'okta';
import BaseView from '../internals/BaseView';
import BaseForm from '../internals/BaseForm';
import Util from '../../../util/Util';

const Body = BaseForm.extend({
  noButtonBar: true,

  className: 'ion-form sso-extension-challenge',

  title: loc('signin', 'login'),

  initialize () {
    BaseForm.prototype.initialize.apply(this, arguments);
    this.add('<div class="spinner"></div>');
    const currentFormName = this.options.currentViewState.name;
    const formData = this.options.appState.get('introspectSuccess').remediation.value
      .filter(v => v.name === currentFormName)[0].value;
    const params = formData.map((elem) => {
      return `${elem.name}=${elem.value}`;
    }).join('&');
    Util.redirectWithForm(`${this.options.currentViewState.href}?${params}`);
  }
});

export default BaseView.extend({
  Body,
});
