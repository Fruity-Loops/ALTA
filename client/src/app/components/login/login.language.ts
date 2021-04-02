import {Language} from '../../services/Language';

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

export class LoginLangFactory {
  lang: LoginLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new LoginEnglish();
    } else {
      this.lang = new LoginEnglish();
    }
  }
}
