import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-manage-audits',
  templateUrl: './manage-audits.component.html',
  styleUrls: ['./manage-audits.component.scss'],
})
export class ManageAuditsComponent implements OnInit {
  // MatPaginator Inputs
  length: number;
  pageSize: number;
  pageIndex: number;
  previousPageIndex: number;
  timeForm: FormGroup;
  searchForm: FormGroup;
  body: any;
  subscription: any;
  organization: string;

  // MatPaginator Output
  // pageEvent: PageEvent;

  // Items data
  data: any;
  items = [];
  errorMessage = '';

  // Http URL params
  params = new HttpParams();

  selectedAudits: number[];

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  filterTerm: string;
  selected: string;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  constructor(
    private auditService: ManageAuditsService,
    private fb: FormBuilder
  ) {
    this.length = 0;
    this.pageSize = 25;
    this.pageIndex = 1;
    this.previousPageIndex = 0;
    this.organization = '';
    this.filterTerm = '';
    this.selected = 'All';
    this.timeForm = this.fb.group({
      time: ['', Validators.required],
    });
    this.searchForm = this.fb.group({
      search: [''],
      inventory_items: [''],
      assigned_sk: [''],
      initiated_by: [''],
      initiated_on: [''],
      last_modified_on: [''],
      template_id: [''],
      accuracy: [''],
    });
    this.dataSource = new MatTableDataSource<any>();
    this.selectedAudits = [];
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

  paginatorAction(event: object): void {
    // page index starts at 1

    const pageIndex = 'pageIndex';
    const pageSize = 'pageSize';
    // @ts-ignore
    this.pageIndex = 1 + event[pageIndex];
    // @ts-ignore
    this.pageSize = event[pageSize];

    this.params = this.params.set('page', String(this.pageIndex));
    this.params = this.params.set('page_size', String(this.pageSize));

    this.updatePage();
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
    if (this.pageIndex > 0){
      // Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    this.items = this.data;
    this.errorMessage = '';

    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
  }

  searchItem(): void {

    this.pageIndex = 1;
    this.params = this.params.set('page', String(this.pageIndex));

    for (const value in this.searchForm.value) {
      if (this.searchForm.value[value] === '') {
        this.params = this.params.delete(value);
      } else {
        this.params = this.params.set(value, this.searchForm.value[value]);
      }
    }
    this.updatePage();
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
