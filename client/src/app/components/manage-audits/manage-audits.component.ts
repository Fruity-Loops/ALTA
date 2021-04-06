import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormBuilder} from '@angular/forms';
import {ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {TableManagementComponent} from '../TableManagement.component';
import {Router} from '@angular/router';
import {ChartComponent} from 'ng-apexcharts';

@Component({
  selector: 'app-manage-audits',
  templateUrl: './manage-audits.component.html',
  styleUrls: ['./manage-audits.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class ManageAuditsComponent extends TableManagementComponent implements OnInit {

  constructor(
    private auditService: ManageAuditsService,
    protected fb: FormBuilder,
    private router: Router
  ) {
    super(fb);
    this.formg = fb;
    this.dataSource = new MatTableDataSource<any>();
    this.innerDataSource = new MatTableDataSource<any>();
    this.selectedAudits = [];
    this.chartSetup();
  }

  body: any;
  subscription: any;

  // MatPaginator Output
  // pageEvent: PageEvent;

  // Items data
  data: any;
  items = [];
  errorMessage = '';
  formg: FormBuilder;

  chartOptions: any;
  private xData = [];
  private yData = [];
  min1mDate = '';
  min6mDate = '';
  min1yDate = '';
  min1ydDate = '';
  maxDate = '';

  selectedAudits: number[];
  ongoingAudit = false;

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('chart', {static: false}) chart: ChartComponent | undefined;
  public activeOptionButton = 'all';
  public updateOptionsData = {
    '1m': {
      xaxis: {
        min: 0,
        max: 0
      }
    },
    '6m': {
      xaxis: {
        min: 0,
        max: 0
      }
    },
    '1y': {
      xaxis: {
        min: 0,
        max: 0
      }
    },
    '1yd': {
      xaxis: {
        min: 0,
        max: 0
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };

  dataSource: MatTableDataSource<any>;
  innerDataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones
  innerDisplayedColumns: string[] = [];
  expandedElement: any | null;

  getSearchForm(): any {
    return {
      search: [''],
      inventory_items: [''],
      assigned_sk: [''],
      initiated_by: [''],
      initiated_on: [''],
      last_modified_on: [''],
      template_id: [''],
      accuracy: [''],
    };
  }

  ngOnInit(): void {
    this.params = this.params.append('page', String(this.pageIndex))
      .append('page_size', String(this.pageSize))
      .append('organization', String(localStorage.getItem('organization_id')));
      // .append('status', 'Complete');
    this.searchAudit();
    this.selectedAudits = [];
  }

  searchAudit(): void {
    this.auditService.getProperAudits(this.params).subscribe(
      (data: any) => {
        this.data = data;
        data.forEach((element: any) => {
          const getDate = element.initiated_on.replace(/\//g, ' '); // Remove forward slash from initiated date.
          const splitDate = getDate.split(' ', 3); // Split the initiated date by space.
          const dateObj = splitDate[1] + '/' + splitDate [0] + '/' + splitDate[2]; // change order to MM/DD/YYYY
          // @ts-ignore
          this.xData.push(dateObj);
          // @ts-ignore
          this.yData.push(element.accuracy);
        });
        // Getting the field name of the item object returned and populating the column of the table
        for (const key in data[0]) {
          if (this.data[0].hasOwnProperty(key)) {
            this.displayedColumns.push(key);
          }
        }
        this.displayedColumnsStatic = ['Select'].concat(this.displayedColumns); // adding select at the beginning of columns
        this.displayedColumns = this.displayedColumns.concat('Overview');
        this.updatePaginator();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  toggleExpand(auditId: any, auditStatus: any): void {
    if (this.expandedElement === auditId) {
      this.expandedElement = null;
    } else {
      if (auditStatus === 'Complete' || auditStatus === 'Active') {
        this.auditService.getCompleteAudit(auditId).subscribe(
          (data: any) => {

            // used to display warning message
            if (auditStatus === 'Active') {
              this.ongoingAudit = true;
            } else {
              this.ongoingAudit = false;
            }

            this.innerDisplayedColumns = ['Location', 'Bin', 'Assigned_Employee', 'Bin_Accuracy', 'Number_of_Items', 'Number_of_Found_Items'];
            let holdInterpretedData: any[] = [];
            data.forEach((record: any) => {

              let checkExistingLocationAndBin = holdInterpretedData.find(element =>
                                                  element.Location === record.Location &&
                                                  element.Bin === record.Bin)

              if (checkExistingLocationAndBin !== undefined) {

                if (record.status === 'Provided') {
                  checkExistingLocationAndBin.Number_of_Items++;
                  checkExistingLocationAndBin.Number_of_Found_Items++;
                } else if (record.status === 'Missing') {
                  checkExistingLocationAndBin.Number_of_Items++;
                } else if (record.status === 'New') {
                  checkExistingLocationAndBin.Number_of_Found_Items++;
                }

              } else {
                if (record.status === 'Provided') {
                  holdInterpretedData.push({
                    Location: record.Location,
                    Bin: record.Bin,
                    Number_of_Items: 1,
                    Number_of_Found_Items: 1
                  });
                } else if (record.status === 'Missing') {
                  holdInterpretedData.push({
                    Location: record.Location,
                    Bin: record.Bin,
                    Number_of_Items: 1,
                    Number_of_Found_Items: 0
                  });
                } else if (record.status === 'New') {
                  holdInterpretedData.push({
                    Location: record.Location,
                    Bin: record.Bin,
                    Number_of_Items: 0,
                    Number_of_Found_Items: 1
                  });
                }
              }
            });

            holdInterpretedData.forEach(val => {
              if (val.Number_of_Items == val.Number_of_Found_Items) {
                val.Status = 'Provided';
              } else if (val.Number_of_Items > val.Number_of_Found_Items) {
                val.Status = 'Missing';
              } else {
                val.Status = 'New';
              }
            });

            this.auditService.getAssignedBins(auditId).subscribe(
              (assigned_users: any) => {
                holdInterpretedData.forEach((locationWithBin: any) => {
                  let getDataGivenBin = assigned_users.find((obj: any) =>
                    obj.Bin === locationWithBin.Bin &&
                    obj.customuser.location === locationWithBin.Location);

                  if (getDataGivenBin !== undefined) {
                    locationWithBin.Assigned_Employee = getDataGivenBin.customuser.first_name + ' ' +
                                                        getDataGivenBin.customuser.last_name;
                    locationWithBin.Bin_Accuracy = getDataGivenBin.accuracy + '%';
                  }
                });
            });

            this.innerDataSource = new MatTableDataSource(holdInterpretedData);
          },
          (err: any) => {
            this.errorMessage = err;
          }
        );
      } else {
        this.auditService.getAuditData(auditId).subscribe(
          (data: any) => {
              this.innerDisplayedColumns = Object.keys(data.inventory_items[0]).filter(title => title !== 'organization');
              this.innerDataSource = new MatTableDataSource(data.inventory_items);
            },
            (err: any) => {
              this.errorMessage = err;
            }
        );
      }

      // toggle expand/hide arrow button
      this.expandedElement = auditId;
    }
  }

  // updates data in table  <- is this needed?
  updatePage(): void {
    this.auditService.getProperAudits(this.params).subscribe(
      (data: any) => {
        this.data = data;
        this.updatePaginator();
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );

  }

  updatePaginator(): void {
    const count = 'count';
    this.length = this.data[count];
    if (this.pageIndex > 0) {
      // Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    this.items = this.data;
    this.errorMessage = '';

    this.items.forEach((audit: any) => {
      audit.isSelected = false;

    }  );

    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
    // console.log(this.items)
  }

  chartSetup(): void {
    this.chartOptions = {
      accuracyOverTime: [
        {
          name: 'Accuracy (%)',
          data: this.yData
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          export: {
            csv: {
              headerCategory: 'Date',
              headerValue: 'Accuracy (%)',
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      title: {
        text: 'Audit Accuracy over Time',
        align: 'left'
      },
      labels: this.xData,
      xaxis: {
        type: 'datetime',
        tickAmount: 6
      },
      yaxis: {
        opposite: false
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    };

    this.maxDate = this.createDate(0, 0, 0, false); // Today's date
    this.updateOptionsData['1m'].xaxis.max = new Date(this.maxDate).getTime();
    this.updateOptionsData['6m'].xaxis.max = new Date(this.maxDate).getTime();
    this.updateOptionsData['1y'].xaxis.max = new Date(this.maxDate).getTime();
    this.updateOptionsData['1yd'].xaxis.max = new Date(this.maxDate).getTime();

    // 1 month ago
    this.min1mDate = this.createDate(0, -1, 0, false); // Today's date - 1 month
    this.updateOptionsData['1m'].xaxis.min = new Date(this.min1mDate).getTime();

    // 6 months ago
    this.min6mDate = this.createDate(0, -6, 0, false); // Today's date - 6 months
    this.updateOptionsData['6m'].xaxis.min = new Date(this.min6mDate).getTime();

    // 1 year ago
    this.min1yDate = this.createDate(0, 0, -1, false); // Today's date - 1 year
    this.updateOptionsData['1y'].xaxis.min = new Date(this.min1yDate).getTime();

    // 1 jan of this year or previous year. (1ydScenario)
    this.min1ydDate = this.createDate(0, 0, 0, true);
    this.updateOptionsData['1yd'].xaxis.min = new Date(this.min1ydDate).getTime();

  }

  // Create date using today's date and can subtract/add days, month and years.
  createDate(days: any, months: any, years: any, oneYDScenario: any): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = date.getMonth();
    const yyyy = date.getFullYear();
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (oneYDScenario) {
      if (dd === '01' && mm === 0) {
        return '01 Jan ' + (yyyy - 1);
      } else {
        return '01 Jan ' + yyyy;
      }
    } else {
      return dd + ' ' + month[mm] + ' ' + yyyy;
    }
  }

  updateOptions(option: any): void {
    this.activeOptionButton = option;
    // @ts-ignore
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }

  // If an Inventory item checkbox is selected then add the id to the list
  onChange(value: number): void {
    if (this.selectedAudits.includes(value)) {
      this.selectedAudits.splice(
        this.selectedAudits.indexOf(value),
        1
      );
    } else {
      this.selectedAudits.push(value);
    }
  }

  navToReport(obj: any, col: any): void {
    this.router.navigate(['audits/audit-report/' + obj.audit_id]);
  }

}
