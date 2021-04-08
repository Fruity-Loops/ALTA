import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TableManagementComponent } from '../TableManagement.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ManageAuditsLangFactory } from './manage-audits.language';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-manage-audits',
  templateUrl: './manage-audits.component.html',
  styleUrls: ['./manage-audits.component.scss'],
})
export class ManageAuditsComponent
  extends TableManagementComponent
  implements OnInit {
  body: any;
  subscription: any;

  // MatPaginator Output
  // pageEvent: PageEvent;

  // Items data
  data: any;
  audits = [];
  errorMessage = '';
  formg: FormBuilder;

  selectedAudit: number;

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<any>(
    this.allowMultiSelect,
    this.initialSelection
  );
  title: string;
  searchPlaceholder: string;

  panelOpenState = false;
  displayedColumnsBin: string[] = ['Bin'];
  displayedColumnsPart: string[] = ['Part'];
  displayedColumnsItem: string[] = ['Item'];
  displayedColumnsRandomItem: string[] = ['Random Item'];
  displayedColumnsCategoryItem: string[] = ['Item By Category'];
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
    this.selectedAudit = -1;
    const lang = new ManageAuditsLangFactory();
    [this.title, this.searchPlaceholder] = [
      lang.lang.title,
      lang.lang.searchPlaceholder,
    ];
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
    this.params = this.params.append('page', String(this.pageIndex));
    this.params = this.params.append('page_size', String(this.pageSize));
    this.params = this.params.append(
      'organization',
      String(localStorage.getItem('organization_id'))
    );
    this.organization = {
      organization: localStorage.getItem('organization_id'),
    };
    this.params = this.params.append('status', 'Active');
    this.searchAudit();
    this.getRecommendations();
    this.getInsights();
  }

  searchAudit(): void {
    this.auditService.getProperAudits(this.params).subscribe(
      (data: any) => {
        this.data = data;
        // Getting the field name of the item object returned and populating the column of the table
        for (const key in data[0]) {
          if (this.data[0].hasOwnProperty(key)) {
            this.displayedColumns.push(key);
          }
        }

        this.displayedColumnsStatic = ['Select'].concat(this.displayedColumns); // adding select at the beginning of columns
        this.updatePaginator();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

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

  // updates data in table
  updatePaginator(): void {
    const count = 'count';
    this.length = this.data[count];
    if (this.pageIndex > 0) {
      // Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    this.audits = this.data;
    this.errorMessage = '';
    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.audits);
  }

  onRowSelection(row: any): void {
    this.selection.toggle(row);
    if (this.selectedAudit === row.audit_id) {
      this.selectedAudit = -1;
    } else {
      this.selectedAudit = row.audit_id;
    }
  }

  cancelAudit(): void {
    if (confirm('Are you sure you want to cancel this audit?')) {
      this.auditService.deleteAudit(this.selectedAudit).subscribe(
        (_) => {
          this.reloadPage();
        },
        (err) => {
          this.errorMessage = err;
        }
      );
    }
  }

  async reloadPage(): Promise<void> {
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    this.router.navigateByUrl('audits');
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
}
