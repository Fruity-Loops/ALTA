import {Language} from '../../services/Language';

export interface AuditsTable {
  title: string;
  dateInitiated: string;
  id: string;
  location: string;
  bin: string;
  initiated_by: string;
  accuracy: string;
  status: string;
}

export interface DashboardLanguage {
  title: string;
  auditsTable: AuditsTable;
  accuracyTitle: string;
}

class DashboardEnglish implements DashboardLanguage{
  title: string;
  auditsTable: AuditsTable;
  accuracyTitle: string;

  constructor() {
    this.title = 'Dashboard';
    this.auditsTable = {title: 'Most Recent Audits', dateInitiated: 'Date Initiated', id: 'ID', location: 'Location', bin: 'Bin',
      initiated_by: 'Initiated By', accuracy: 'Accuracy', status: 'Status'};
    this.accuracyTitle = 'Audit Accuracy over Time';
  }
}

export class DashboardLangFactory {
  lang: DashboardLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new DashboardEnglish();
    } else {
      this.lang = new DashboardEnglish();
    }
  }
}
