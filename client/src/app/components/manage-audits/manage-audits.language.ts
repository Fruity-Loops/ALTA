import {LangFactory} from '../../services/Language';

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

export class ManageAuditsLangFactory extends LangFactory {
  lang: ManageAuditsLanguage;

  constructor() {
    super();
    this.lang = this.getComponentLang() as ManageAuditsLanguage;
  }

  getEnglish(): ManageAuditsLanguage {
    return new ManageAuditsEnglish();
  }

}
