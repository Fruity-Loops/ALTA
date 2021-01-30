import { Component } from '@angular/core';
import { AuditTemplateService } from '../../../../services/audit-template.service';
import { ActivatedRoute } from '@angular/router';
import {AuditTemplateViewComponent} from '../audit-template-view.component';
import { Template } from '../../Template';
import timeZones from '../create-audit-template/timezone.json';

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
  selector: 'app-edit-audit-template',
  templateUrl: '../audit-template-view.component.html',
  styleUrls: ['../audit-template-view.component.scss']
})
export class EditAuditTemplateComponent extends AuditTemplateViewComponent {

  id: any;
  disabled: boolean | undefined;

  constructor(
    private auditTemplateService: AuditTemplateService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

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

  initializeForm(): void {
    this.disabled = false;
    this.templateValues = {
      location: '',
      plant: '',
      zones: '',
      aisles: '',
      bins: '',
      part_number: '',
      serial_number: '',
      start_date: '',
      repeat_every: '',
      on_day: '',
      for_month: '',
      time_zone_utc: '',
    };
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;
      this.auditTemplateService.getATemplate(this.id).subscribe((temp) => {
        this.setComponentParameters(this.formTemplate(temp));
        this.title = temp.title;
        this.description = temp.description;
        this.id = temp.template_id;
      });
    });
  }

  formTemplate(temp: { [s: string]: unknown; } | ArrayLike<unknown>): any {
    const createdTemplate: any = {};
    Object.entries(temp).forEach(([key, value]) => {
      console.log(key);
      if (typeof value === 'string'
        // checks to make sure that it is only adding keys from the template interface
        // @ts-ignore
        && this.templateValues.hasOwnProperty(key)
        && (key !== 'start_date' && key !== 'repeat_every' && key !== 'on_day'
          && key !== 'for_month' && key !== 'time_zone_utc')) {
        createdTemplate[key] = JSON.parse(value.replace(/'/g, '"')); // replace to fix crash on single quote
      }
    });
    return createdTemplate;
  }

  setComponentParameters(body: false | Template): void {
    if (body) {
      this.disabled = true;
      this.template = body;
    } else {
      this.disabled = false;
    }
  }

  beginEdit(): void {
    this.disabled = false;
  }

  submitQuery(body: Template): void {
    // @ts-ignore
    body.template_id = this.id;
    this.auditTemplateService.updateTemplate(this.id, body).subscribe(
      () => {
        setTimeout(() => {
          // Redirect user back to list of templates
          window.location.reload();
        }, 1000); // Waiting 1 second before redirecting the user
        this.setComponentParameters(false);
        this.errorMessage = '';

      },
      (err) => {
        // if backend returns an error
        if (err.error) {
          this.errorMessage = err.error;
        }
      }
    );
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
}
