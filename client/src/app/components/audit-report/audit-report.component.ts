import {Component, OnInit, ViewChild} from '@angular/core';
import {TableManagementComponent} from '../TableManagement.component';
import {AuditReportService} from '../../services/audits/audit-report.service';
import {ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import {FormBuilder} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss']
})
export class AuditReportComponent extends TableManagementComponent implements OnInit{

  id: any;
  body: any;
  subscription: any;

  // Audit data
  metaData: any;
  parsedMetaData: [];
  data: any;
  items = [];
  errorMessage = '';
  formg: FormBuilder;

  selectedItems: number[];
  allExpandState = false;

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  metaDataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [];
  displayedMetaColumns: string[] = [];

  resultsDisplayedColumns: string[] = [];
  resultsDataSource: MatTableDataSource<any>;
  hideResult = true;
  ongoing = false;
  pending = false;

  constructor(
    private auditReportService: AuditReportService,
    private auditService: ManageAuditsService,
    private userService: ManageMembersService,
    protected fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private router: Router
  ) {
    super(fb);
    this.formg = fb;
    this.dataSource = new MatTableDataSource<any>();
    this.metaDataSource = new MatTableDataSource<any>();
    this.resultsDataSource = new MatTableDataSource<any>();
    this.selectedItems = [];
    this.parsedMetaData = [];
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;

      this.setAuditInfo();
      this.setAuditData();
      this.setResultsData();
    });
  }

  handleStatusFlag(status: any): void {
    if (status === 'Active') {
      this.ongoing = true;
    } else if (status === 'Pending') {
      this.pending = true;
    }
  }

  setDisplayedMetaColumns(metaData: any): void {
    for (const key in metaData) {
      if (metaData.hasOwnProperty(key)) {
        this.displayedMetaColumns.push(key);
      }
    }
  }

  setMetaData(metaData: any, initiatedBy: any): void {
    metaData.initiated_by = initiatedBy;
    this.cleanMetaData();
    // Getting the field name of the item object returned and populating the column of the table
    this.setDisplayedMetaColumns(this.metaData);

    this.displayedMetaColumns = this.displayedMetaColumns.
                                     filter((title: any) => title !== 'organization' &&
                                                            title !== 'template_id');
     this.updateMetaData();
  }

  setAuditInfo(): void {
    this.auditReportService.getAuditData(this.id).subscribe(
      (metaData: any) => {
        this.metaData = metaData;
        this.handleStatusFlag(metaData.status);

        this.userService.getEmployee(metaData.initiated_by).subscribe((user: any) => {
          this.setMetaData(this.metaData, String(user.first_name + ' ' + user.last_name));
        },
          // if SA initiated audit
          (err: any) => {
            this.setMetaData(this.metaData, 'System Administrator');
          }
        );
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  cleanMetaData(): void {
    delete this.metaData.inventory_items;

    // set all assigned employees
    const holdValue = this.metaData.assigned_sk;
    this.metaData.assigned_sk = [];

    holdValue.forEach((user: any) => {
      this.metaData.assigned_sk.push(user.first_name + ' ' +  user.last_name + '\n');
    });

    // format date and time
    this.metaData.initiated_on = this.datePipe.transform(this.metaData.initiated_on, 'EEEE, MMMM d, y - H:mm');
    this.metaData.last_modified_on = this.datePipe.transform(this.metaData.last_modified_on, 'EEEE, MMMM d, y - H:mm');
  }

  setAuditData(): void{
    this.auditReportService.getAuditData(this.id).subscribe(
      (data: any) => {
        this.data = data.inventory_items;
        for (const key in this.data[0]) {
          if (this.data[0].hasOwnProperty(key)){
            this.displayedColumns.push(key);
          }
        }

        this.displayedColumns = this.displayedColumns.filter((title: any) => title !== 'organization');
        this.updatePage();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  setResultsData(): void {
    this.auditService.getCompleteAudit(this.id).subscribe(
      (data: any) => {
        if (data.length) {
          this.hideResult = false;
          this.resultsDisplayedColumns = Object.keys(data[0]).filter((title: any) =>
                                            title === 'Batch_Number' ||
                                            title === 'Location' ||
                                            title === 'Bin' ||
                                            title === 'Part_Number' ||
                                            title === 'flagged' ||
                                            title === 'first_verified_on' ||
                                            title === 'last_verified_on');

          // display item_id first
          this.resultsDisplayedColumns = ['item_id'].concat(this.resultsDisplayedColumns);

          // display quantity and status last
          this.resultsDisplayedColumns = this.resultsDisplayedColumns.concat(['Quantity', 'status']);

          this.resultsDataSource = new MatTableDataSource(this.getCleanData(data));
        }
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  getCleanData(data: any): any {
    data.forEach((record: any) => {
      record.first_verified_on = this.datePipe.transform(record.first_verified_on, 'EEEE, MMMM d, y - H:mm');
      record.last_verified_on = this.datePipe.transform(record.last_verified_on, 'EEEE, MMMM d, y - H:mm');
    });
    return data;
  }

  updatePage(): void {
    this.updatePaginator();
  }

  updateMetaData(): void {
    this.metaDataSource = new MatTableDataSource([this.metaData]);
  }

  // updates data in table
  updatePaginator(): void {
    const count = 'count';
    this.length = this.data[count];
    if (this.pageIndex > 0) {
      // Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    this.items = this.data;
    this.errorMessage = '';

    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
  }

  // If an Inventory item checkbox is selected then add the id to the list
  onChange(value: number): void {
    if (this.selectedItems.includes(value)) {
      this.selectedItems.splice(
        this.selectedItems.indexOf(value),
        1
      );
    } else {
      this.selectedItems.push(value);
    }
  }

  cancelAudit(): void {
    if (confirm('Are you sure you want to cancel this audit?')) {
      this.auditService.deleteAudit(this.id).subscribe(
        (_) => {
          this.reloadPage();
        },
        (err) => {
          this.errorMessage = err;
        });
    }
  }

  downloadAudit(): void{
    this.auditReportService.getAuditFile({audit_id: this.id}).subscribe(
      (data) => {
        saveAs(data, 'audit_' + this.id.toString() + '_report.csv');
      },
      (err: any) => {
        alert('error');
        this.errorMessage = err;
      }
    );
  }

  async reloadPage(): Promise<void> {
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    await this.router.navigateByUrl('audits');
  }
}
