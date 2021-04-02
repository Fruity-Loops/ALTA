import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ManageInventoryItemsService} from 'src/app/services/inventory-items/manage-inventory-items.service';
import {AuditLocalStorage, ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {AuthService, UserLocalStorage} from '../../services/authentication/auth.service';
import {TableManagementComponent} from '../TableManagement.component';

@Component({
  selector: 'app-manage-inventory-items',
  templateUrl: './manage-inventory-items.component.html',
  styleUrls: ['./manage-inventory-items.component.scss'],
})
export class ManageInventoryItemsComponent extends TableManagementComponent implements OnInit {
  body: any;
  subscription: any;

  // MatPaginator Output
  // TODO: dead code?
  // pageEvent: PageEvent;

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



  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  constructor(
    private itemsService: ManageInventoryItemsService,
    private auditService: ManageAuditsService,
    private authService: AuthService,
    private router: Router,
    protected fb: FormBuilder
  ) {
    super(fb);
    this.dataSource = new MatTableDataSource<any>();
    this.inventoryItemToAudit = [];
  }

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

  ngOnInit(): void {
    this.params = this.params.append('page', String(this.pageIndex))
      .append('page_size', String(this.pageSize))
      .append('organization', String(localStorage.getItem('organization_id')));
    this.getItems();
    this.init();
    this.inventoryItemToAudit = [];
  }

  init(): void {

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
    if (this.pageIndex > 0){
      // Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    // this.pageSize = this.data[results].length;
    this.items = this.data[results];
    this.errorMessage = '';

    // TODO: define proper types
    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
  }

  // If an Inventory item checkbox is selected then add the id to the list
  onChange(value: number): void {
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

}
