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
import { SelectionModel } from '@angular/cdk/collections';
import { ManageAuditsLangFactory } from './manage-audits.language';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

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

  innerDisplayedColumns: string[] = [];
  expandedElement: any | null;

  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<any>(
    this.allowMultiSelect,
    this.initialSelection
  );
  title: string;
  searchPlaceholder: string;

  panelOpenState = false;
  displayedColumnsBin: string[] = ['Location', 'Zone', 'Aisle', 'Bin', 'Count'];
  displayedColumnsPart: string[] = ['Batch_Number', 'Part', 'Serial_Number', 'Count'];
  displayedColumnsItem: string[] = ['Batch_Number', 'Part_Number', 'Serial_Number', 'Count'];
  displayedColumnsCategoryItem: string[] = ['Batch_Number', 'Part_Number', 'Serial_Number'];
  dataSourceBin: any = [];
  dataSourcePart: any = [];
  dataSourceItem: any = [];
  dataSourceRandomItem: any = [];
  dataSourceCategoryItem: any = [];

  last_week_audit_count: any;
  last_month_audit_count: any;
  last_year_audit_count: any;
  average_audit_accuracy: any;
  average_time_audit_seconds: any;
  average_time_audit_min: any;
  average_time_audit_hour: any;
  average_time_audit_day: any;

  organization: any;

  constructor(
    private auditService: ManageAuditsService,
    protected fb: FormBuilder,
    private router: Router,
    private dashService: DashboardService
  ) {
    super(fb);
    this.formg = fb;
    this.dataSource = new MatTableDataSource<any>();
    const lang = new ManageAuditsLangFactory();
    this.innerDataSource = new MatTableDataSource<any>();
    this.selectedAudits = [];
    this.chartSetup();
    [this.title, this.searchPlaceholder] = [lang.lang.title, lang.lang.searchPlaceholder];
  }

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
    this.organization = {
      organization: localStorage.getItem('organization_id'),
    };
    this.searchAudit();
    this.getRecommendations();
    this.getInsights();
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

  filterAuditData(fullData: any): any[] {
    const filteredData: any[] = [];

    fullData.forEach((obj: any) => {
      filteredData.push({
        Bin: obj.Bin,
        Location: obj.Location,
        status: obj.status,
        Quantity: obj.Quantity
      });
    });

    return filteredData;
  }

  filterBinToSKData(fullData: any): any[] {
    const filteredData: any[] = [];

    fullData.forEach((obj: any) => {
      filteredData.push({
        location: obj.customuser.location,
        Bin: obj.Bin,
        Assigned_Employee: obj.customuser.first_name + ' ' + obj.customuser.last_name,
        Bin_Accuracy: obj.accuracy + '%'
      });
    });
    return filteredData;
  }

  toggleExpand(auditId: any, auditStatus: any): void {
    if (this.expandedElement === auditId) {
      this.expandedElement = null;
      this.innerDisplayedColumns = [];
      this.innerDataSource = new MatTableDataSource();
    } else {
      if (auditStatus === 'Complete' || auditStatus === 'Active') {
        // clear previously set data
        this.innerDataSource = new MatTableDataSource();

        this.displayWarningMessage(auditStatus);
        
        this.auditService.getCompleteAudit(auditId).subscribe(
          (data: any) => {

            this.auditService.getAssignedBins(auditId).subscribe(
              (assigned_users: any) => {

                this.setInnerTable(this.filterAuditData(data), this.filterBinToSKData(assigned_users));
              });
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

  displayWarningMessage(auditStatus: any): void {
    if (auditStatus === 'Active') {
      this.ongoingAudit = true;
    } else {
      this.ongoingAudit = false;
    }
  }

  getCorrespondingData(data: any, record: any): any {
    if (data.map((obj: any) => obj.location).includes(undefined)) {
      return data.find((obj: any) =>
        obj.Location === record.Location &&
        obj.Bin === record.Bin
      );
    }
    return data.find((obj: any) =>
      obj.location === record.Location &&
      obj.Bin === record.Bin
    );
  }

  setInnerTable(data: any, assigned_users: any): void {
    let holdInterpretedData: any[] = [];

    data.forEach((record: any) => {

      let holdCurrentSK = '';
      let holdCurrentBinAccuracy = '';

      // find and set sk and bin accuracy to bin with location
      let getDataGivenBin = this.getCorrespondingData(assigned_users, record);

      if (getDataGivenBin !== undefined) {
        holdCurrentSK = getDataGivenBin.Assigned_Employee;
        holdCurrentBinAccuracy = getDataGivenBin.Bin_Accuracy;
      }

      let checkExistingLocationAndBin = this.getCorrespondingData(holdInterpretedData, record);

      // bin with location already exists in table
      if (checkExistingLocationAndBin !== undefined) {

        this.adjustQuantity(record, checkExistingLocationAndBin);

      } else {
        holdInterpretedData.push(
          Object.assign(this.addNewBinWithLocation(record),
          {
            Assigned_Employee: holdCurrentSK,
            Bin_Accuracy: holdCurrentBinAccuracy
          }
        ));
      }
    });

    this.innerDisplayedColumns =
                  ['Location',
                   'Bin',
                   'Assigned_Employee',
                   'Bin_Accuracy',
                   'Number_of_Audited_Items',
                   'Number_of_Provided_Items',
                   'Number_of_Missing_Items',
                   'Number_of_New_Items'];

    if (holdInterpretedData.length)
      this.removeZeroValueColumns(holdInterpretedData);

    this.innerDataSource = new MatTableDataSource(holdInterpretedData);
  }

  addNewBinWithLocation(record: any): any {
    return {
      Location: record.Location,
      Bin: record.Bin,
      Number_of_Audited_Items: record.Quantity ? record.Quantity : 1,
      Number_of_Provided_Items: record.status == 'Provided' ? record.Quantity : 0,
      Number_of_Missing_Items: record.status == 'Missing' ? 1 : 0,
      Number_of_New_Items: record.status == 'New' ? record.Quantity : 0
    };
  }

  adjustQuantity(record: any, checkExistingLocationAndBin: any): any {
    if (record.Quantity) {
      checkExistingLocationAndBin['Number_of_'+record.status+'_Items'] =
        checkExistingLocationAndBin['Number_of_'+record.status+'_Items'] + record.Quantity;

      checkExistingLocationAndBin.Number_of_Audited_Items =
        checkExistingLocationAndBin.Number_of_Audited_Items + record.Quantity;
      return;
    }

    checkExistingLocationAndBin['Number_of_'+record.status+'_Items']++;
    checkExistingLocationAndBin.Number_of_Audited_Items++;
  }

  removeZeroValueColumns(holdInterpretedData: any): void {
    const holdStatusValues = {
      'Number_of_Provided_Items': holdInterpretedData.map((val: any) => val.Number_of_Provided_Items),
      'Number_of_Missing_Items': holdInterpretedData.map((val: any) => val.Number_of_Missing_Items),
      'Number_of_New_Items': holdInterpretedData.map((val:any) => val.Number_of_New_Items)
    };

    // removes provided, missing, or new column if results display 0 items
    Object.entries(holdStatusValues).forEach(([key, value]) => {
      if (!value.find((val: any) => val !== 0)) {
        this.innerDisplayedColumns = this.innerDisplayedColumns.filter(obj => obj !== key);
      }
    });
  }

  // updates data in table
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


  navToReport(obj: any, col: any): void {
    this.router.navigate(['audits/audit-report/' + obj.audit_id]);
  }

  getRecommendations(): void {
    this.dashService.getRecommendations(this.organization).subscribe(
      (data) => {
        this.dataSourceBin = data['bins_recommendation'];
        this.dataSourcePart = data['parts_recommendation'];
        this.dataSourceItem = data['items_recommendation'];
        this.dataSourceRandomItem = data['random_items'];
        this.dataSourceCategoryItem = data['item_based_on_category'];
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  getInsights(): void {
    this.auditService.getInsights(this.organization).subscribe(
      (data) => {
        this.last_week_audit_count = data['last_week_audit_count'];
        this.last_month_audit_count = data['last_month_audit_count'];
        this.last_year_audit_count = data['last_year_audit_count'];
        this.average_audit_accuracy = data['average_accuracy'];
        this.average_time_audit_seconds = data['average_audit_time']['seconds'];
        this.average_time_audit_min = data['average_audit_time']['minutes'];
        this.average_time_audit_hour = data['average_audit_time']['hours'];
        this.average_time_audit_day = data['average_audit_time']['days'];
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  createTempalte(data: any): void {
    this.router.navigate(['template/create-template'], { state: { data }});
  }

}
