import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditTemplateService } from '../../../../services/audits/audit-template.service';
import { Template } from '../../Template';
import { AuditTemplateViewComponent } from '../audit-template-view.component';
import {ManageInventoryItemsService} from 'src/app/services/inventory-items/manage-inventory-items.service';

@Component({
  selector: 'app-create-audit-template',
  templateUrl: '../audit-template-view.component.html',
  styleUrls: ['../audit-template-view.component.scss']
})
export class CreateAuditTemplateComponent extends AuditTemplateViewComponent  {

  disabled = false;
  routeParams: any;
  recommendation = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private auditTemplateService: AuditTemplateService,
    itemsService: ManageInventoryItemsService
  ) {
    super(itemsService);
    this.getRouteParams();
  }

  getRouteParams(): void {
    this.routeParams = this.router.getCurrentNavigation()?.extras.state?.data;
    if (this.routeParams != null) {
      this.recommendation = true;
      for (const recommendedItems of this.routeParams) {
        Object.keys(recommendedItems).forEach(recommendedLabel => {
          // @ts-ignore
          if ((recommendedLabel in this.template) && !(this.template[recommendedLabel].includes(recommendedItems[recommendedLabel]))) {
            // @ts-ignore
            this.template[recommendedLabel].push(recommendedItems[recommendedLabel]);
          }
        });
      }
    }

  }

  initializeForm(): void {
    this.templateValues = {
      Location: '',
      Plant: '',
      Zone: '',
      Aisle: '',
      Bin: '',
      Part_Number: '',
      Serial_Number: '',
      recommendation: false,
      start_date: '',
      repeat_every: this.repeatEvery,
      on_day: this.dayArray,
      for_month: this.monthArray,
      time_zone_utc: this.timeZoneUTC,
    };
  }

  checkLeadingZero(toCheck: string): string {
    return (toCheck.length === 1) ? ('0' + toCheck) : toCheck;
  }

  submitQuery(body: Template): void {
    this.dayArray = [];
    this.monthArray = [];
    const year = this.startDate.getFullYear();
    const month = this.checkLeadingZero((this.startDate.getMonth() + 1).toString());
    const day = this.checkLeadingZero(this.startDate.getDate().toString());
    const hour = this.checkLeadingZero(this.startTime.split(':')[0].toString());
    const minute = this.checkLeadingZero(this.startTime.split(':')[1].toString());

    // Constructing date and time in ISO 8601 format e.g. 2021-01-18T15:37:42
    const date = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00';

    let checkedDay = false;
    let checkedMonth = false;

    if (!this.isRecurrenceChosen) {
      // @ts-ignore
      this.repeatEvery = null;
    } else {
      checkedDay = this.didCheckDay(checkedDay);
      checkedMonth = this.didCheckMonth(checkedMonth);
    }

    body.start_date = date;
    body.repeat_every = this.repeatEvery;
    body.on_day = this.dayArray;
    body.for_month = this.monthArray;
    body.time_zone_utc = this.timeZoneUTC;
    body.recommendation = this.recommendation;

    this.submitTemplate(checkedDay, checkedMonth, body);
  }

  private didCheckMonth(checkedMonth: boolean): boolean {
    // Checking if at least one checkbox is checked from the sub checkbox as well as populating monthArray
    // @ts-ignore
    for (const checkbox of this.recurrenceMonth.subCheckBox) {
      // @ts-ignore
      this.monthArray.push(checkbox.checked);
      if (checkbox.checked) {
        checkedMonth = true;
      }
    }
    return checkedMonth;
  }

  private didCheckDay(checkedDay: boolean): boolean {
    // Checking if at least one checkbox is checked from the sub checkbox as well as populating dayArray
    // @ts-ignore
    for (const checkbox of this.recurrenceDay.subCheckBox) {
      // @ts-ignore
      this.dayArray.push(checkbox.checked);
      if (checkbox.checked) {
        checkedDay = true;
      }
    }
    return checkedDay;
  }

  private submitTemplate(checkedDay: boolean, checkedMonth: boolean, body: Template): void {
    if (this.panelOpenState && !checkedDay) {
      this.errorMessageCheckboxDay = 'Please choose at least one day';
    } else if (this.panelOpenState && !checkedMonth) {
      this.errorMessageCheckboxMonth = 'Please choose at least one month';
    } else {
      this.auditTemplateService.createTemplate(body).subscribe(
        () => {
          setTimeout(() => {
            // Redirect user back to list of templates
            this.router.navigate(['template']).then();
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
}
