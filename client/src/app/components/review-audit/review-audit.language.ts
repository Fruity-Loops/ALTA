import {ComponentLang, LangFactory} from '../../services/Language';

export interface ReviewAuditActionButtons {
  expand: string;
  collapse: string;
  back: string;
  discard: string;
  confirm: string;
  cancel: string;
}

export interface ReviewAuditTableHeaders {
  stock_keeper: string;
  bins: string;
  num_parts: string;
  init_by: string;
  init_on: string;
}

interface ReviewAuditLanguage extends ComponentLang {
  title: string;
  actionButtons: ReviewAuditActionButtons;
  tableHeaders: ReviewAuditTableHeaders;
}

class ReviewAuditEnglish implements ReviewAuditLanguage {
  title: string;
  actionButtons: ReviewAuditActionButtons;
  tableHeaders: ReviewAuditTableHeaders;
  constructor() {
    this.title = 'Review Audit';
    this.actionButtons = {
      expand: 'Expand All', collapse: 'Collapse All', back: 'Go Back', discard: 'Discard', confirm: 'Confirm', cancel: 'Cancel'
    };
    this.tableHeaders = {
      stock_keeper: 'Stock Keeper', bins: 'Bins', num_parts: 'Number of Parts', init_by: 'Initiated By', init_on: 'Initiated On'
    };
  }
}

export class ReviewAuditLangFactory extends LangFactory {
  lang: ReviewAuditLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as ReviewAuditLanguage;
  }

  getEnglish(): ReviewAuditLanguage {
    return new ReviewAuditEnglish();
  }
}

