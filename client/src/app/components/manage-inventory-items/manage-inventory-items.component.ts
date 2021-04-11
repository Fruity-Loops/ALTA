import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { AuditLocalStorage, ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthService, UserLocalStorage } from '../../services/authentication/auth.service';
import { TableManagementComponent } from '../TableManagement.component';
import { SelectionModel } from '@angular/cdk/collections';
import {ManageInventoryItemsLangFactory} from './manage-inventory-items.language';

@Component({
  selector: 'app-manage-inventory-items',
  templateUrl: './manage-inventory-items.component.html',
  styleUrls: ['./manage-inventory-items.component.scss'],
})
export class ManageInventoryItemsComponent extends TableManagementComponent implements OnInit {
  body: any;
  subscription: any;

  // Items data
  data: any;
  items = [];
  errorMessage = '';

  inventoryItemToAudit: number[];

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;


  title = 'Inventory Items';
  searchPlaceholder = 'Search...';
  startAuditBtn = 'Start Audit';

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);

  constructor(
    private itemsService: ManageInventoryItemsService,
    private auditService: ManageAuditsService,
    private authService: AuthService,
    public router: Router,
    protected fb: FormBuilder
  ) {
    super(fb);
    this.dataSource = new MatTableDataSource<any>();
    this.inventoryItemToAudit = [];

    const lang = new ManageInventoryItemsLangFactory();
    [this.title, this.searchPlaceholder, this.startAuditBtn] = [lang.lang.title, lang.lang.searchPlaceholder, lang.lang.startAuditBtn];
  }

  ngOnInit(): void {
    this.params = this.params.append('page', String(this.pageIndex))
      .append('page_size', String(this.pageSize))
      .append('organization', String(localStorage.getItem('organization_id')));
    this.getItems();
    this.inventoryItemToAudit = [];
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
    if (this.pageIndex > 0) {
      // Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    this.items = this.data[results];
    this.errorMessage = '';

    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
  }

  submitAudit(): void {
    let bodyAudit: object;
    bodyAudit = {
      initiated_by: Number(localStorage.getItem('id')),
      inventory_items: this.inventoryItemToAudit,
      organization: Number(this.authService.getLocalStorage(UserLocalStorage.OrgId)),
    };
    this.auditService.createAudit(bodyAudit).subscribe(
      (data) => {
        this.auditService.updateLocalStorage(AuditLocalStorage.AuditId, data.audit_id);
        this.inventoryItemToAudit = [];
        setTimeout(() => {
          // Redirect user to component assign-stock-keepers
          this.router.navigate(['audits/assign-sk']);
        }, 1000); // Waiting 1 second before redirecting the user
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  // If an Inventory item checkbox is selected then add the id to the list
  onRowSelection(row: any): void {
    this.selection.toggle(row);
    const itemID = row.Item_Id;
    if (this.inventoryItemToAudit.includes(itemID)) {
      this.inventoryItemToAudit.splice(
        this.inventoryItemToAudit.indexOf(itemID),
        1
      );
    } else {
      this.inventoryItemToAudit.push(itemID);
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.inventoryItemToAudit = [];
    if (this.isAllSelected()) {
      this.selection.clear();
    }
    else {
      this.dataSource.data.forEach(row => {
        this.inventoryItemToAudit.push(row.Item_Id);
        this.selection.select(row);
      });
    }
  }

}
