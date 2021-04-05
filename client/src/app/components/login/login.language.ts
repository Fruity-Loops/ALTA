import {LangFactory} from '../../services/Language';

export interface LoginLanguage {
  email: string;
  password: string;
  loginBtnLabel: string;
}

class LoginEnglish implements LoginLanguage{
  email: string;
  password: string;
  loginBtnLabel: string;
  constructor() {
    this.email = 'E-mail address';
    this.password = 'Password';
    this.loginBtnLabel = 'Login';
  }
}

export class LoginLangFactory extends LangFactory {
  lang: LoginLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as LoginLanguage;
  }

  getEnglish(): LoginLanguage {
    return new LoginEnglish();
  }
}
