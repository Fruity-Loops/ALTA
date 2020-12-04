import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ManageInventoryItemsService } from 'src/app/services/manage-inventory-items.service';
import { AuthService } from 'src/app/services/auth.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-inventory-items',
  templateUrl: './manage-inventory-items.component.html',
  styleUrls: ['./manage-inventory-items.component.scss'],
})
export class ManageInventoryItemsComponent implements OnInit {
  // MatPaginator Inputs
  length = 0;
  pageSize = 25;
  pageIndex = 1;
  previousPageIndex = 0;
  timeForm: FormGroup;
  body: any;
  subscription: any;
  organization: any;

  // MatPaginator Output
  pageEvent: PageEvent;

  // Items data
  data;
  items = [];
  errorMessage = '';

  constructor(
    private itemsService: ManageInventoryItemsService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getItems();

    this.timeForm = this.fb.group({
      time: ['', Validators.required],
    });

    this.subscription = this.authService.sharedUser.subscribe((data) => {
      this.organization = data.org;
    });
  }

  getItems(): void {
    this.itemsService.getPageItems(this.pageIndex, this.pageSize).subscribe(
      (data) => {
        this.data = data;
        // Getting the field name of the item object returned and populating the column of the table
        for (const key in data['results'][0]) {
          if (key != null) {
            this.displayedColumns.push(key);
          }
        }
        this.displayedColumns.pop(); // deleting the last column which refers to the organization
        this.updatePaginator();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  paginatorAction(event): void {
    // page index starts at 1
    this.pageIndex = 1 + event['pageIndex'];
    this.pageSize = event['pageSize'];

    this.itemsService.getPageItems(this.pageIndex, this.pageSize).subscribe(
      (data) => {
        this.data = data;
        this.updatePaginator();
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  // updates data in table
  updatePaginator(): void {
    this.length = this.data['count'];
    this.pageSize = this.data['results'].length;
    this.items = this.data['results'];
    this.errorMessage = '';
    this.dataSource = new MatTableDataSource(this.items);
  }
  refreshTime(): void {
    this.body = {
      new_job_timing: this.timeForm.value.time,
      org_id: localStorage.getItem('organization_id'),
    };

    this.itemsService.updateRefreshItemsTime(this.body).subscribe(
      (data) => {
        this.timeForm.reset();
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }
}
