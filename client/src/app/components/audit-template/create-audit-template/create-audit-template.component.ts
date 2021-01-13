import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuditTemplateService} from '../../../services/audit-template.service';
import timeZones from 'src/app/components/audit-template/create-audit-template/timezone.json';

interface Template {
  location: any;
  plant: any;
  zones: any;
  aisles: any;
  bins: any;
  part_number: any;
  serial_number: any;
}

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
  styleUrls: ['./create-audit-template.component.scss']
})

export class CreateAuditTemplateComponent implements OnInit {

  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService,
  ) {
  }

  errorMessage: string;
  errorMessageCheckboxDay: string;
  errorMessageCheckboxMonth: string;
  templateButtonLabel = 'CREATE';
  startDate = new Date();
  startDateDisabled = false;
  dateplaceHolder = 'DISABLED';
  startDateDay: number;
  startDateMonth: number;
  startDateYear: number;
  startTime = '00:00:00';
  allDaysChecked = false;
  allMonthsChecked = false;
  panelOpenState = false;
  isRecurrenceChosen = false;
  repeatEvery = '1';
  timeZone = timeZones;
  timeZoneUTC = timeZones[15].utc[0];
  selectedTimeZone = timeZones[15];

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
      {name: 'Sun', checked: true},
      {name: 'Mon', checked: false},
      {name: 'Tue', checked: false},
      {name: 'Wed', checked: false},
      {name: 'Thu', checked: false},
      {name: 'Fri', checked: false},
      {name: 'Sat', checked: false}
    ]
  };

  recurrenceMonth: MonthsCheckBox = {
    name: 'All',
    checked: false,
    subCheckBox: [
      {name: 'Jan', checked: true},
      {name: 'Feb', checked: false},
      {name: 'Mar', checked: false},
      {name: 'Apr', checked: false},
      {name: 'May', checked: false},
      {name: 'Jun', checked: false},
      {name: 'Jul', checked: false},
      {name: 'Aug', checked: false},
      {name: 'Sep', checked: false},
      {name: 'Oct', checked: false},
      {name: 'Nov', checked: false},
      {name: 'Dec', checked: false}
    ]
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
    };

    if (this.title !== '') {
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
    } else {
      this.errorMessage = 'Please give a title to your template.';
    }

  }

  timeZoneChange(event): void {
    this.timeZoneUTC = event.value.utc[0];
  }

  extractDate(dateObject): void {
    const objValue = JSON.stringify(dateObject.value);

    if (objValue.substring(9, 10) === '0') {
      this.startDateDay = parseInt(objValue.substring(10, 11), 10);
    } else {
      this.startDateDay = parseInt(objValue.substring(9, 11), 10);
    }
    if (objValue.substring(6, 7) === '0') {
      this.startDateMonth = parseInt(objValue.substring(7, 8), 10);
    } else {
      this.startDateMonth = parseInt(objValue.substring(6, 8), 10);
    }
    this.startDateYear = parseInt(objValue.substring(1, 5), 10);
  }

  recurrenceExpand(): void {
    this.isRecurrenceChosen = true;
    this.startDateDisabled = true;
    this.panelOpenState = true;
    this.startDate = null;
  }

  recurrenceCollapsed(): void {
    this.isRecurrenceChosen = false;
    this.startDateDisabled = false;
    this.panelOpenState = false;
    this.startDate = new Date();
    this.repeatEvery = '1';
    this.allDaysChecked = false;
    this.allMonthsChecked = false;
    this.recurrenceDay.subCheckBox.forEach(t => t.checked = false);
    this.recurrenceMonth.subCheckBox.forEach(t => t.checked = false);
    this.errorMessageCheckboxDay = ' ';
    this.errorMessageCheckboxMonth = ' ';
  }

  debug(): void {
    console.log('=== Debug for scheduling ===');
    if (!this.isRecurrenceChosen) {
      console.log('~ Start Date ~');
      console.log('the Date object is: ' + this.startDate);
      console.log('the year is: ' + this.startDate.getFullYear());
      console.log('the month is: ' + this.startDate.getMonth());
      console.log('the day is: ' + this.startDate.getDate());
    } else {
      console.log('~ Recurrence - is recurrence chosen ~');
      console.log('Chosen? ' + this.isRecurrenceChosen);
      console.log('~ Recurrence - repeat every ~');
      console.log('Repeat every: ' + this.repeatEvery);
      // Checking if at least one checkbox is checked from the sub checkbox
      let checkedDay = false;
      for (const checkbox of this.recurrenceDay.subCheckBox) {
        if (checkbox.checked) {
          checkedDay = true;
        }
      }
      if (!this.allDaysChecked && !checkedDay) {
        this.errorMessageCheckboxDay = 'PLEASE CHECK AT LEAST ONE DAY';
      } else if (this.isRecurrenceChosen) {
        console.log('~ Recurrence - repeat on ~');
        console.log('All: ' + this.allDaysChecked);
        for (const checkbox of this.recurrenceDay.subCheckBox) {
          console.log(checkbox.name + ' ' + checkbox.checked + '\n');
        }
      }
      // Checking if at least one checkbox is checked from the sub checkbox
      let checkedMonth = false;
      for (const checkbox of this.recurrenceMonth.subCheckBox) {
        if (checkbox.checked) {
          checkedMonth = true;
        }
      }
      if (!this.allMonthsChecked && !checkedMonth) {
        this.errorMessageCheckboxMonth = 'PLEASE CHECK AT LEAST ONE MONTH';
      } else if (this.isRecurrenceChosen) {
        console.log('~ Recurrence - For the month of ~');
        console.log('All: ' + this.allMonthsChecked);
        for (const checkbox of this.recurrenceMonth.subCheckBox) {
          console.log(checkbox.name + ' ' + checkbox.checked + '\n');
        }
      }
    }
    console.log('~ Start Time ~');
    console.log('the hour is: ' + parseInt(this.startTime.split(':')[0], 10));
    console.log('the minute is: ' + parseInt(this.startTime.split(':')[1], 10));
    console.log('~ Timezone UTC ~');
    console.log('The tzinfo is: ' + this.timeZoneUTC);
  }

  updateAllCheckbox(type: string): void {
    if (type === 'dayCheckbox') {
      this.allDaysChecked = this.recurrenceDay.subCheckBox != null && this.recurrenceDay.subCheckBox.every(t => t.checked);
      this.errorMessageCheckboxDay = ' ';
    } else if (type === 'monthCheckbox') {
      this.allMonthsChecked = this.recurrenceMonth.subCheckBox != null && this.recurrenceMonth.subCheckBox.every(t => t.checked);
      this.errorMessageCheckboxMonth = ' ';
    }
  }

  someCheckbox(type: string): boolean {
    if (type === 'dayCheckbox') {
      if (this.recurrenceDay.subCheckBox == null) {
        return false;
      }
      return this.recurrenceDay.subCheckBox.filter(t => t.checked).length > 0 && !this.allDaysChecked;
    } else if (type === 'monthCheckbox') {
      if (this.recurrenceMonth.subCheckBox == null) {
        return false;
      }
      return this.recurrenceMonth.subCheckBox.filter(t => t.checked).length > 0 && !this.allMonthsChecked;
    }
  }

  setAllCheckbox(checked: boolean, type: string): void {
    if (type === 'dayCheckbox') {
      this.allDaysChecked = checked;
      if (this.recurrenceDay.subCheckBox == null) {
        return;
      }
      this.recurrenceDay.subCheckBox.forEach(t => t.checked = checked);
    } else if (type === 'monthCheckbox') {
      this.allMonthsChecked = checked;
      if (this.recurrenceMonth.subCheckBox == null) {
        return;
      }
      this.recurrenceMonth.subCheckBox.forEach(t => t.checked = checked);
    }

  }
}
