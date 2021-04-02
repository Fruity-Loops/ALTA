import {Language} from '../../../services/Language';

export interface TemplateLabels {
  title: string;
  location: string;
  plant: string;
  zones: string;
  aisles: string;
  bins: string;
  part_number: string;
  serial_number: string;
  description: string;
}

export interface TemplateScheduling {
  scheduling: string;
  start_date: string;
  start_time: string;
  recurrence: string;
  repeat_every: string;
  on: string;
  for_month: string;
  timezone: string;
}

export interface AuditRepetition {
  first_week: string;
  second_week: string;
  third_week: string;
  last_week: string;
  week: string;
}

export interface TemplateActionButtons {
  save: string;
  edit: string;
  cancel: string;
}

export interface AuditTemplateViewLanguage {
  templateLabels: TemplateLabels;
  scheduling: TemplateScheduling;
  auditRepetition: AuditRepetition;
  actionButtons: TemplateActionButtons;
}

class AuditTemplateViewEnglish implements AuditTemplateViewLanguage {
  templateLabels: TemplateLabels;
  scheduling: TemplateScheduling;
  auditRepetition: AuditRepetition;
  actionButtons: TemplateActionButtons;

  constructor() {
    this.templateLabels = {title: 'Template Title', location: 'Location', plant: 'Plant', zones: 'Zones', aisles: 'Aisles', bins: 'Bins',
      part_number: 'Part Number', serial_number: 'Serial Number', description: 'Description'};
    this.scheduling = {scheduling: 'Scheduling', start_date: 'Start Date', start_time: 'Start Time', recurrence: 'Recurrence',
      repeat_every: 'Repeat Every', on: 'On', for_month: 'For the month of', timezone: 'Time Zone'};
    this.auditRepetition = {first_week: '1st week of the month', second_week: '2nd week of the month', third_week: '3rd week of the month',
      last_week: 'Last week of the month', week: 'week'};
    this.actionButtons = {save: 'SAVE', edit: 'EDIT', cancel: 'CANCEL'};
  }
}

export class AuditTemplateViewLangFactory {
  lang: AuditTemplateViewLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new AuditTemplateViewEnglish();
    } else {
      this.lang = new AuditTemplateViewEnglish();
    }
  }
}
