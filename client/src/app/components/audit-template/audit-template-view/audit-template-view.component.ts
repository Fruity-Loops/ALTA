import {Component, OnInit} from '@angular/core';
import {Template} from '../Template';
import timeZones from '../audit-template-view/create-audit-template/timezone.json';

interface DaysCheckBox {
  name: string;
  checked: boolean;
  subCheckBox?: DaysCheckBox[];
}

interface MonthsCheckBox {
  name: string;
  checked: boolean;
  subCheckBox?: MonthsCheckBox[];
}

@Component({
  template: ''
})
export abstract class AuditTemplateViewComponent implements OnInit {

  errorMessage: string | undefined;
  errorMessageCheckboxDay: string | undefined;
  errorMessageCheckboxMonth: string | undefined;
  startDate = new Date();
  startTime = '00:00:00';
  allDaysChecked = false;
  allMonthsChecked = false;
  panelOpenState = false;
  isRecurrenceChosen = false;
  repeatEvery = '1';
  timeZone = timeZones;
  timeZoneUTC = timeZones[15].utc[0];
  selectedTimeZone = timeZones[15];
  dayArray = [];
  monthArray = [];
  recurrenceDay: DaysCheckBox = {
    name: 'All',
    checked: false,
    subCheckBox: [
      { name: 'Sun', checked: true },
      { name: 'Mon', checked: false },
      { name: 'Tue', checked: false },
      { name: 'Wed', checked: false },
      { name: 'Thu', checked: false },
      { name: 'Fri', checked: false },
      { name: 'Sat', checked: false },
    ],
  };
  recurrenceMonth: MonthsCheckBox = {
    name: 'All',
    checked: false,
    subCheckBox: [
      { name: 'Jan', checked: true },
      { name: 'Feb', checked: false },
      { name: 'Mar', checked: false },
      { name: 'Apr', checked: false },
      { name: 'May', checked: false },
      { name: 'Jun', checked: false },
      { name: 'Jul', checked: false },
      { name: 'Aug', checked: false },
      { name: 'Sep', checked: false },
      { name: 'Oct', checked: false },
      { name: 'Nov', checked: false },
      { name: 'Dec', checked: false },
    ],
  };

  template: Template = {
    location: [],
    plant: [],
    zones: [],
    aisles: [],
    bins: [],
    part_number: [],
    serial_number: [],
    start_date: '',
    repeat_every: '',
    on_day: [],
    for_month: [],
    time_zone_utc: ''
  };
  templateValues: Template | undefined;
  title = '';
  description = '';


  protected constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  abstract initializeForm(): void;

  addItem(term: string | number, value: string): void {

    // although not obvious, the includes statement here is also necessary for the proper functionality of the remove function
    // @ts-ignore
    if (value !== '' && !this.template[term].includes(value)) {
      // @ts-ignore
      this.template[term].push(value);
      // @ts-ignore
      this.templateValues[term] = '';
    }
  }

  remove(term: string | number, value: any): void {
    // @ts-ignore
    const index = this.template[term].indexOf(value);

    if (index >= 0) {
      // @ts-ignore
      this.template[term].splice(index, 1);
    }
  }

  submit(): void {
    const body = {
      title: this.title,
      description: this.description,
      ...this.template
    };

    if (this.title !== '') {
      this.submitQuery(body);
    } else {
      this.errorMessage = 'Please give a title to your template.';
    }
  }

  timeZoneChange(event: { value: { utc: string[]; }; }): void {
    this.timeZoneUTC = event.value.utc[0];
  }

  recurrenceExpand(): void {
    this.repeatEvery = '1';
    this.isRecurrenceChosen = true;
    this.panelOpenState = true;
  }

  recurrenceCollapsed(): void {
    this.isRecurrenceChosen = false;
    this.panelOpenState = false;
    this.allDaysChecked = false;
    this.allMonthsChecked = false;
    this.repeatEvery = '1';
    this.recurrenceDay.subCheckBox?.forEach((t) => (t.checked = false));
    this.recurrenceMonth.subCheckBox?.forEach((t) => (t.checked = false));
    // @ts-ignore
    this.recurrenceDay.subCheckBox[0].checked = true;
    // @ts-ignore
    this.recurrenceMonth.subCheckBox[0].checked = true;
    this.errorMessageCheckboxDay = ' ';
    this.errorMessageCheckboxMonth = ' ';
  }

  updateAllCheckbox(type: string): void {
    if (type === 'dayCheckbox') {
      this.allDaysChecked =
        this.recurrenceDay.subCheckBox != null &&
        this.recurrenceDay.subCheckBox.every((t) => t.checked);
      this.errorMessageCheckboxDay = ' ';
    } else if (type === 'monthCheckbox') {
      this.allMonthsChecked =
        this.recurrenceMonth.subCheckBox != null &&
        this.recurrenceMonth.subCheckBox.every((t) => t.checked);
      this.errorMessageCheckboxMonth = ' ';
    }
  }

  // @ts-ignore
  someCheckbox(type: string): boolean {
    if (type === 'dayCheckbox') {
      if (this.recurrenceDay.subCheckBox == null) {
        return false;
      }
      return (
        this.recurrenceDay.subCheckBox.filter((t) => t.checked).length > 0 &&
        !this.allDaysChecked
      );
    } else if (type === 'monthCheckbox') {
      if (this.recurrenceMonth.subCheckBox == null) {
        return false;
      }
      return (
        this.recurrenceMonth.subCheckBox.filter((t) => t.checked).length > 0 &&
        !this.allMonthsChecked
      );
    }
  }

  setAllCheckbox(checked: boolean, type: string): void {
    if (type === 'dayCheckbox') {
      this.allDaysChecked = checked;
      if (this.recurrenceDay.subCheckBox == null) {
        return;
      }
      this.recurrenceDay.subCheckBox.forEach((t) => (t.checked = checked));
    } else if (type === 'monthCheckbox') {
      this.allMonthsChecked = checked;
      if (this.recurrenceMonth.subCheckBox == null) {
        return;
      }
      this.recurrenceMonth.subCheckBox.forEach((t) => (t.checked = checked));
    }
  }

  abstract submitQuery(body: any): void;

}
