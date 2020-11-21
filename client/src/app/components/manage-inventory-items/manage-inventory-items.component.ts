import { Component, OnInit } from '@angular/core';
import { ManageInventoryItemsService } from 'src/app/services/manage-inventory-items.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-manage-inventory-items',
  templateUrl: './manage-inventory-items.component.html',
  styleUrls: ['./manage-inventory-items.component.scss'],
})
export class ManageInventoryItemsComponent implements OnInit {
  items = [];
  errorMessage = '';

  constructor(private itemsService: ManageInventoryItemsService) {}

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems(): void {
    this.itemsService.getAllItems().subscribe(
      (data) => {
        // Getting the field name of the item object returned and populating the column of the table
        for (const key in data[0]) {
          if (key != null) {
            this.displayedColumns.push(key);
          }
        }
        this.items = data;
        this.errorMessage = '';
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Rows per page:';
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }
}
