import {Component, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';

import {ManageInventoryItemsService} from 'src/app/services/manage-inventory-items.service';

import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';

import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-manage-inventory-items',
  templateUrl: './manage-inventory-items.component.html',
  styleUrls: ['./manage-inventory-items.component.scss'],
})
export class ManageInventoryItemsComponent implements OnInit {

  // MatPaginator Inputs
  length = 0;
  pageSize = 0;
  pageIndex = 0;
  previousPageIndex = 0;


  // MatPaginator Output
  pageEvent: PageEvent;

  // Items data
  data;
  items = [];
  errorMessage = '';

  constructor(private itemsService: ManageInventoryItemsService) {
  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemsService.getPageItems('').subscribe(
      (data) => {
        this.data = data;
        // Getting the field name of the item object returned and populating the column of the table
        for (const key in data['results'][0]) {
          if (key != null) {
            this.displayedColumns.push(key);
          }
        }
        this.updatePaginator()
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  paginatorAction(event): void {
    let page = '';
    if (event['pageIndex'] > event['previousPageIndex']) {
      page = this.data['next'];
    } else if (event['pageIndex'] < event['previousPageIndex']) {
      page = this.data['previous'];
    }

    this.itemsService.getPageItems(page).subscribe(
      (data) => {
        this.data = data;
        this.updatePaginator()
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
}
