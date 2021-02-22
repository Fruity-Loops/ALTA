import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ManageInventoryItemsService} from 'src/app/services/inventory-items/manage-inventory-items.service';
import {AuditLocalStorage, ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService, UserLocalStorage} from '../../services/authentication/auth.service';

@Component({
  selector: 'app-manage-inventory-items',
  templateUrl: './manage-inventory-items.component.html',
  styleUrls: ['./manage-inventory-items.component.scss'],
})
export class ManageInventoryItemsComponent implements OnInit {
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
  // TODO: dead code?
  // pageEvent: PageEvent;

  // Items data
  data: any;
  items = [];
  errorMessage = '';

  // Http URL params
  params = new HttpParams();

  inventoryItemToAudit: number[];

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
    private itemsService: ManageInventoryItemsService,
    private auditService: ManageAuditsService,
    private authService: AuthService,
    private router: Router,
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
    });
    this.dataSource = new MatTableDataSource<any>();
    this.inventoryItemToAudit = [];
  }

  ngOnInit(): void {
    this.params = this.params.append('page', String(this.pageIndex));
    this.params = this.params.append('page_size', String(this.pageSize));
    this.params = this.params.append('organization', String(localStorage.getItem('organization_id')));
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
        console.log(data);
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

  paginatorAction(event: object): void {
    // page index starts at 1

    // TODO: set keys as keyof 'event'
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

  refreshTime(): void {
    this.body = {
      new_job_timing: this.timeForm.value.time,
      organization: this.authService.getLocalStorage(UserLocalStorage.OrgId),
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
