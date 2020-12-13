import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ManageInventoryItemsService } from 'src/app/services/manage-inventory-items.service';
import { AuthService } from 'src/app/services/auth.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {HttpParams} from "@angular/common/http";
import {tryResolvePackage} from "tslint/lib/utils";

import { Router } from '@angular/router';

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
  searchForm: FormGroup;
  body: any;
  subscription: any;
  organization: any;

  // MatPaginator Output
  pageEvent: PageEvent;

  // Items data
  data;
  items = [];
  errorMessage = '';

  //Http params
  params = new HttpParams();

  inventoryItemToAudit = [];

  constructor(
    private itemsService: ManageInventoryItemsService,
    private auditService: ManageAuditsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.params = this.params.append('page', String(this.pageIndex));
    this.params = this.params.append('page_size', String(this.pageSize));
    this.getItems();
    this.init();
    this.inventoryItemToAudit = [];
  }

  init(): void {
    this.timeForm = this.fb.group({
      time: ['', Validators.required],
    });
    this.searchForm = this.fb.group({
      _id: [''],
      Location: [''],
      Plant: [''],
      Zone: [''],
      Aisle: [''],
      Part_Number: [''],
      Serial_Number: [''],
      Condition: [''],
      Category: [''],
      Owner: [''],
      Criticality: [''],
      Average_Cost: [''],
      Quantity: [''],
      Unit_of_Measure: [''],
      organization: [''],
    });
  }

  getItems(): void {
    this.itemsService.getPageItems(this.params).subscribe(
      (data) => {
        this.data = data;
        // Getting the field name of the item object returned and populating the column of the table
        const results = 'results';
        for (const key in data[results][0]) {
          if (key != null) {
            this.displayedColumns.push(key);
          }
        }

        this.displayedColumns.pop(); // deleting the last column which refers to the organization
        this.displayedColumnsStatic = ['Select'].concat(this.displayedColumns); // adding select at the beginning of columns
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
    const pageIndex = 'pageIndex';
    const pageSize = 'pageSize';
    this.pageIndex = 1 + event[pageIndex];
    this.pageSize = event[pageSize];

    this.params = this.params.set('page', String(this.pageIndex));
    this.params = this.params.set('page_size', String(this.pageSize));

    this.updatePage();
  }

  updatePage(): void {
    this.itemsService.getPageItems(this.params).subscribe(
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
    const count = 'count';
    const results = 'results';
    this.length = this.data[count];
    this.pageSize = this.data[results].length;
    this.items = this.data[results];
    this.errorMessage = '';
    this.dataSource = new MatTableDataSource(this.items);
  }

  refreshTime(): void {
    this.body = {
      new_job_timing: this.timeForm.value.time,
      organization: localStorage.getItem('organization_id'),
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

  searchItem()  {
    for(let value in this.searchForm.value){
      if(this.searchForm.value[value] == ""){
        this.params = this.params.delete(value);
      } else {
        this.params = this.params.set(value, this.searchForm.value[value]);
      }
    }
    this.updatePage();
  // If an Inventory item checkbox is selected then add the id to the list
  onChange(value: any): void {
    if (this.inventoryItemToAudit.includes(value)) {
      this.inventoryItemToAudit.splice(
        this.inventoryItemToAudit.indexOf(value),
        1
      );
    } else {
      this.inventoryItemToAudit.push(value);
    }
  }

  submitAudit(): void {
    let bodyAudit: any;
    bodyAudit = {
      inventory_items: this.inventoryItemToAudit,
      organization: localStorage.getItem('organization_id'),
    };
    this.auditService.createAudit(bodyAudit).subscribe(
      (data) => {
        this.inventoryItemToAudit = [];
        setTimeout(() => {
          // Redirect user to component dashboard
          this.router.navigate(['dashboard']);
        }, 1000); // Waiting 1 second before redirecting the user
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  searchItem() : void{

  }
}
