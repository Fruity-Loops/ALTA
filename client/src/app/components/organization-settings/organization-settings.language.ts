import {LangFactory, Language} from '../../services/Language';

interface InventoryExtractRepetitionOptions {
  minutes: string;
  hours: string;
  days: string;
  weeks: string;
}

interface InventoryExtractionsLabels {
  ftp_location: string;
  repeat_every: string;
  upload_extract: string;
  current_file: string;
  drop_file: string;
  repeat_options: InventoryExtractRepetitionOptions;
}

interface InventoryExtractions {
  title: string;
  fieldLabels: InventoryExtractionsLabels;
}

export interface OrgSettingsCategories {
  inventory_extractions: InventoryExtractions;
}

interface OrganizationSettingsLanguage {
  title: string;
  categories: OrgSettingsCategories;
}

class OrganizationSettingsEnglish implements OrganizationSettingsLanguage {
  title: string;
  categories: OrgSettingsCategories;
  constructor() {
    this.title = 'Organization Settings';
    this.categories = {
      inventory_extractions: {
        title: 'Inventory Extractions',
        fieldLabels: {ftp_location: 'FTP Location', repeat_every: 'Repeat Every', upload_extract: 'Upload Inventory Extract',
          current_file: 'Current File', drop_file: 'Drop .csv here', repeat_options: {minutes: 'Minutes', hours: 'Hours',
            days: 'Days', weeks: 'Weeks'}}
      }
    };
  }
}

export class OrganizationSettingsLangFactory extends LangFactory {
  lang: OrganizationSettingsLanguage;

  constructor(language: Language) {
    super(language);
    this.lang = this.getComponentLang() as OrganizationSettingsLanguage;
  }

  getEnglish(): OrganizationSettingsEnglish {
    return new OrganizationSettingsEnglish();
  }
}
