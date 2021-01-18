import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditTemplateService } from '../../../services/audit-template.service';
import { Template } from '../Template';
import timeZones from 'src/app/components/audit-template/create-audit-template/timezone.json';

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
  selector: 'app-create-audit-template',
  templateUrl: './create-audit-template.component.html',
  styleUrls: ['./create-audit-template.component.scss'],
})
export class CreateAuditTemplateComponent implements OnInit {
  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService
  ) {}

  errorMessage: string;
  errorMessageCheckboxDay: string;
  errorMessageCheckboxMonth: string;
  disabled = false;
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

  title = '';
  description = '';
  template: Template = {
    location: [],
    plant: [],
    zones: [],
    aisles: [],
    bins: [],
    part_number: [],
    serial_number: [],
  };
  templateValues: Template;
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

  // We initialize the form and set validators to each one in case user forget to specify a field
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.templateValues = {
      location: '',
      plant: '',
      zones: '',
      aisles: '',
      bins: '',
      part_number: '',
      serial_number: '',
    };
  }

  addItem(term, value): void {
    // although not obvious, the includes statement here is also necessary for the proper functionality of the remove function
    if (value !== '' && !this.template[term].includes(value)) {
      this.template[term].push(value);
      this.templateValues[term] = '';
    }
  }

  remove(term, value): void {
    const index = this.template[term].indexOf(value);

    if (index >= 0) {
      this.template[term].splice(index, 1);
    }
  }

  submit(): void {
    this.dayArray = [];
    this.monthArray = [];
    // Constructing date as Django DateTimeField YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] <-- optional timezone, therefore: YYYY-MM-DD HH:MM
    const date =
      this.startDate.getFullYear() +
      '-' +
      (this.startDate.getMonth() + 1) +
      '-' +
      this.startDate.getDate() +
      'T' +
      parseInt(this.startTime.split(':')[0], 10) +
      ':' +
      parseInt(this.startTime.split(':')[1], 10);
    let checkedDay = false;
    let checkedMonth = false;

    if (!this.isRecurrenceChosen) {
      this.repeatEvery = null;
    } else {
      // Checking if at least one checkbox is checked from the sub checkbox as well as populating dayArray
      for (const checkbox of this.recurrenceDay.subCheckBox) {
        this.dayArray.push(checkbox.checked);
        if (checkbox.checked) {
          checkedDay = true;
        }
      }
      // Checking if at least one checkbox is checked from the sub checkbox as well as populating monthArray
      for (const checkbox of this.recurrenceMonth.subCheckBox) {
        this.monthArray.push(checkbox.checked);
        if (checkbox.checked) {
          checkedMonth = true;
        }
      }
    }

    const body = {
      title: this.title,
      location: this.template.location,
      plant: this.template.plant,
      zones: this.template.zones,
      aisles: this.template.aisles,
      bins: this.template.bins,
      part_number: this.template.part_number,
      serial_number: this.template.serial_number,
      description: this.description,
      startDateObj: date,
      repeatEvery: this.repeatEvery,
      onDay: this.dayArray,
      forMonth: this.monthArray,
      timeZoneUTC: this.timeZoneUTC,
    };
    console.log(body);

    if (this.title === '') {
      this.errorMessage = 'Please give a title to your template.';
    } else if (this.panelOpenState && !checkedDay) {
      this.errorMessageCheckboxDay = 'Please choose at least one day';
    } else if (this.panelOpenState && !checkedMonth) {
      this.errorMessageCheckboxMonth = 'Please choose at least one month';
    } else {
      this.auditTemplateService.createTemplate(body).subscribe(
        () => {
          setTimeout(() => {
            // Redirect user back to list of templates
            this.router.navigate(['template']);
          }, 1000); // Waiting 1 second before redirecting the user
          this.initializeForm();
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
  }

  timeZoneChange(event): void {
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
    this.recurrenceDay.subCheckBox.forEach((t) => (t.checked = false));
    this.recurrenceMonth.subCheckBox.forEach((t) => (t.checked = false));
    this.recurrenceDay.subCheckBox[0].checked = true;
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
