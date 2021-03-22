import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TableManagementComponent } from '../TableManagement.component';

@Component({
  selector: 'app-manage-audits',
  templateUrl: './manage-audits.component.html',
  styleUrls: ['./manage-audits.component.scss'],
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

  selectedAudits: number[];

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  constructor(
    private auditService: ManageAuditsService,
    protected fb: FormBuilder
  ) {
    super(fb);
    this.formg = fb;
    this.dataSource = new MatTableDataSource<any>();
    this.selectedAudits = [];
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
    this.params = this.params.append('organization', String(localStorage.getItem('organization_id')));
    this.params = this.params.append('status', 'Active');
    this.searchAudit();
    this.selectedAudits = [];
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
    this.items = this.data;
    this.errorMessage = '';

    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
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
}
