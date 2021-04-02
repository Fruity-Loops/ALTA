import {Language} from '../../services/Language';

interface ManageAuditsLanguage {
  title: string;
  searchPlaceholder: string;
}

class ManageAuditsEnglish implements ManageAuditsLanguage{
  title: string;
  searchPlaceholder: string;

  constructor() {
    this.title = 'List of Audits';
    this.searchPlaceholder = 'Search...';
  }
}

export class ManageAuditsLangFactory {
  lang: ManageAuditsLanguage;

  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new ManageAuditsEnglish();
    } else {
      this.lang = new ManageAuditsEnglish();
    }
  }

}
