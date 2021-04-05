import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Template} from '../Template';
import timeZones from '../audit-template-view/create-audit-template/timezone.json';
import {ManageInventoryItemsService} from 'src/app/services/inventory-items/manage-inventory-items.service';
import {HttpParams} from '@angular/common/http';
import {
  AuditRepetition,
  AuditTemplateViewLangFactory,
  TemplateActionButtons,
  TemplateLabels,
  TemplateScheduling
} from './audit-template-view.language';

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

enum AutoFields {
  LOCATION = 'Location',
  PLANT = 'Plant',
  ZONE = 'Zone',
  AISLE = 'Aisle',
  BIN = 'Bin',
  PART_NUMBER = 'Part_Number',
  SERIAL_NUMBER = 'Serial_Number'
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
    Location: [],
    Plant: [],
    Zone: [],
    Aisle: [],
    Bin: [],
    Part_Number: [],
    Serial_Number: [],
    start_date: '',
    repeat_every: '',
    on_day: [],
    for_month: [],
    time_zone_utc: ''
  };
  templateValues: Template | undefined;
  templateLabels: TemplateLabels;
  scheduling: TemplateScheduling;
  repetition: AuditRepetition;
  actionButtons: TemplateActionButtons;
  title = '';
  description = '';

  params = new HttpParams();
  AutoFields = AutoFields;
  autocompleteFormGroup: FormGroup | undefined;
  filterFieldResults: string[] | undefined;

  constructor(
    private itemsService: ManageInventoryItemsService
  ) {
    const lang = new AuditTemplateViewLangFactory();
    [this.templateLabels, this.scheduling, this.repetition, this.actionButtons] = [lang.lang.templateLabels, lang.lang.scheduling,
      lang.lang.auditRepetition, lang.lang.actionButtons];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initAutocomplete();
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

  updateCheckboxDay(): void {
    this.allDaysChecked =
      this.recurrenceDay.subCheckBox != null &&
      this.recurrenceDay.subCheckBox.every((t) => t.checked);
    this.errorMessageCheckboxDay = ' ';
  }

  updateCheckboxMonth(): void {
    this.allMonthsChecked =
      this.recurrenceMonth.subCheckBox != null &&
      this.recurrenceMonth.subCheckBox.every((t) => t.checked);
    this.errorMessageCheckboxMonth = ' ';
  }

  // @ts-ignore
  someCheckboxDay(): boolean {
    if (this.recurrenceDay.subCheckBox == null) {
      return false;
    }
    return (
      this.recurrenceDay.subCheckBox.filter((t) => t.checked).length > 0 &&
      !this.allDaysChecked
    );
  }

  // @ts-ignore
  someCheckboxMonth(): boolean {
    if (this.recurrenceMonth.subCheckBox == null) {
      return false;
    }
    return (
      this.recurrenceMonth.subCheckBox.filter((t) => t.checked).length > 0 &&
      !this.allMonthsChecked
    );
  }

  setAllCheckboxDay(checked: boolean): void {
    this.allDaysChecked = checked;
    if (this.recurrenceDay.subCheckBox == null) {
      return;
    }
    this.recurrenceDay.subCheckBox.forEach((t) => (t.checked = checked));
  }

  setAllCheckboxMonth(checked: boolean): void {
    this.allMonthsChecked = checked;
    if (this.recurrenceMonth.subCheckBox == null) {
      return;
    }
    this.recurrenceMonth.subCheckBox.forEach((t) => (t.checked = checked));
  }

  abstract submitQuery(body: any): void;


  initAutocomplete(): void {
    const formGroup: any = {};
    Object.values(this.AutoFields).forEach(field => {
      formGroup[field] = new FormControl();
      formGroup[field].valueChanges.subscribe(
        async (val: any) => {
          if (val !== '') {
            this.filter(val, field);
          }
        }
      );
    });
    this.autocompleteFormGroup = new FormGroup(formGroup);
  }

  filter(value: string, field: string): void {
    this.filterFieldResults = [];
    const val = value.toLowerCase();
    this.params = new HttpParams();
    this.params = this.params.set('page', '1');
    this.params = this.params.set('page_size', '6');
    this.params = this.params.set('organization', String(localStorage.getItem('organization_id')));
    this.params = this.params.set(field, value);
    this.itemsService.getPageItems(this.params).subscribe(
      (data) => {
        const results = data.results.map((fields: any) => fields[field]);
        const filtered: string[] = results.filter(
          (element: string) =>
            element.toLowerCase().includes(val)
        );
        setTimeout(() => {
          this.filterFieldResults = [...new Set(filtered)].sort(); // Sorted Without Duplicates
        }, 100);
      }
    );
  }

  onAutoFieldFocusIn(event: any, field: string): void {
    this.filter(event.target?.value, field);
  }
}
