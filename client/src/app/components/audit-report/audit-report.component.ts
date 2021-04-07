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

@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss']
})
export class AuditReportComponent extends TableManagementComponent implements OnInit {

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

  comment_value = '';
  comments: string[];



  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  metaDataSource: MatTableDataSource<any>;


  displayedColumns: string[] = [];
  displayedMetaColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  resultsDisplayedColumns: string[] = [];
  resultsDataSource: MatTableDataSource<any>;
  hideResult = true;

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
    this.comments = [];
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;
      // TODO: Display Meta Data about the Audit
      this.setAuditInfo();
      // TODO: Display Audit's Items Data
      this.setAuditData();

      this.setResultsData();
      this.setCommentData();
    });
    // this.comments = [
    //   "hello",
    //   "hi",
    //   "This is a very long comment to see how the wrapping works",
    // ];
  }

  // TODO: Fix appropriate backend calls
  getSearchForm(): any {
    return {
      search: [''],
      _id_from: [''],
      _id_to: [''],
      Location: [''],
      Zone: [''],
      Aisle: [''],
      Bin: [''],
      Part_Number: [''],
      Serial_Number: [''],
      Condition: [''],
      Category: [''],
      Owner: [''],
      Average_Cost_from: [''],
      Average_Cost_to: [''],
      Quantity_from: [''],
      Quantity_to: [''],
      Unit_of_Measure: [''],
    };
  }

  setAuditInfo(): void {
    this.auditReportService.getAuditData(this.id).subscribe(
      (metaData: any) => {
        this.userService.getEmployee(metaData.initiated_by).subscribe((user: any) => {
          this.metaData = metaData;
          this.metaData.initiated_by = String(user.first_name + ' ' + user.last_name);
          this.cleanMetaData();

          // Getting the field name of the item object returned and populating the column of the table
          for (const key in this.metaData) {
            if (this.metaData.hasOwnProperty(key)) {
              this.displayedMetaColumns.push(key);
            }
          }
          this.displayedMetaColumns = this.displayedMetaColumns
                                        .filter((title: any) => title !== 'organization' &&
                                                                title !== 'template_id');
          this.updateMetaData();
        },
          // if SA initiated audit
          (err: any) => {
            this.metaData = metaData;
            this.metaData.initiated_by = 'System Administrator';
            this.cleanMetaData();

            // Getting the field name of the item object returned and populating the column of the table
            for (const key in this.metaData) {
              if (this.metaData.hasOwnProperty(key)) {
                this.displayedMetaColumns.push(key);
              }
            }
            this.displayedMetaColumns = this.displayedMetaColumns
                                          .filter((title: any) => title !== 'organization' &&
                                                                  title !== 'template_id');
            this.updateMetaData();
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

        this.displayedColumnsStatic = ['Select'].concat(this.displayedColumns); // adding select at the beginning of columns
        this.updatePage();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (data.comments){
          this.comments = data.comments;
        }

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

          const cleanData = data;
          cleanData.forEach((record: any) => {
            record.first_verified_on = this.datePipe.transform(record.first_verified_on, 'EEEE, MMMM d, y - H:mm');
            record.last_verified_on = this.datePipe.transform(record.last_verified_on, 'EEEE, MMMM d, y - H:mm');
          });
          this.resultsDataSource = new MatTableDataSource(cleanData);
        }
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  setCommentData(): void {
    this.comments = [];
    this.auditReportService.getComments(this.userService.getOrgId(), this.id).subscribe(
      (data: any) => {
        console.log(data);
        for (let i = 0; i < data.length; i++){
          this.comments.push(data[i].content);
        }
      }
    );
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
  //     Angular paginator starts at 0, Django pagination starts at 1
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

  comment(): void {
    const comment = {
      org_id: String(localStorage.getItem('organization_id')),
      ref_audit: this.id,
      content: String(this.comment_value),
      author: String(localStorage.getItem('username'))
    };
    console.log(this.id);

    this.auditReportService.postComment(comment).subscribe(
      (data) => {
        this.comment_value = '';
        this.setCommentData();
      },
      (err) => {
        console.log('Comment posting failed');
      }
    );

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

  async reloadPage(): Promise<void> {
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    await this.router.navigateByUrl('audits');
  }
}
