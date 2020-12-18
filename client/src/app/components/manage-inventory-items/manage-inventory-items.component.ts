import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { ManageInventoryItemsService } from 'src/app/services/manage-inventory-items.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatCheckboxModule } from '@angular/material/checkbox';

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

  // MatPaginator Output
  pageEvent: PageEvent;

  // Items data
  data;
  items = [];
  errorMessage = '';

  inventory_item_to_audit = [];

  constructor(private itemsService: ManageInventoryItemsService) {}

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumns_static: string[] = []; //to add a static column among all the dynamic ones
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getItems();
    this.inventory_item_to_audit = [];
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
        // adding column to select items to start an audit
        this.displayedColumns_static = this.displayedColumns.concat(['Select']);
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

  // If an Inventory item checkbox is selected then add the id to the list
  onChange(value: any) {
    if (this.inventory_item_to_audit.includes(value)) {
      this.inventory_item_to_audit.splice(
        this.inventory_item_to_audit.indexOf(value),
        1
      );
    } else {
      this.inventory_item_to_audit.push(value);
    }
    console.log(this.inventory_item_to_audit);
  }
}
