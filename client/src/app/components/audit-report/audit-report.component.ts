import {Component, OnInit, ViewChild} from '@angular/core';
import {TableManagementComponent} from "../TableManagement.component";
import {AuditReportService} from "../../services/audits/audit-report.service";
import {FormBuilder} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute} from "@angular/router";

//audit information
//inv information
@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss']
})
export class AuditReportComponent extends TableManagementComponent implements OnInit {

  id: any;
  body: any;
  subscription: any;

  // Audit data
  metaData: any
  parsedMetaData: [];
  data: any;
  items = [];
  errorMessage = '';
  formg: FormBuilder;

  selectedItems: number[];

  // Member variable is automatically initialized after view init is completed
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  metaDataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  displayedMetaColumns: string[] = [];
  displayedColumnsStatic: string[] = []; // to add a static column among all the dynamic ones

  constructor(
    private auditReportService: AuditReportService,
    protected fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    super(fb);
    this.formg = fb;
    this.dataSource = new MatTableDataSource<any>();
    this.metaDataSource = new MatTableDataSource<any>();
    this.selectedItems = [];
    this.parsedMetaData = [];
  }

  ngOnInit(): void {
    this.params = this.params.append('page', String(this.pageIndex))
      .append('page_size', String(this.pageSize))
      .append('organization', String(localStorage.getItem('organization_id')))
      .append('status', 'Active');
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;
      // TODO: Display Meta Data about the Audit
      this.setAuditInfo();
      // TODO: Display Audit's Items Data
      this.setAuditData();
    });
  }

  // TODO: Fix appropriate backend calls
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


  setAuditInfo(): void {
    this.auditReportService.getAuditData(this.id).subscribe(
      (metaData: any) => {
        this.metaData = metaData;
        this.cleanMetaData();
        console.log(metaData);

        // Getting the field name of the item object returned and populating the column of the table
        for (const key in this.metaData) {
          if (this.metaData.hasOwnProperty(key)) {
            this.displayedMetaColumns.push(key);
          }
        }
        this.updateMetaData();
      },
      (err: any) => {
        this.errorMessage = err;
      }
    );
  }

  // TODO: parse date to more readable
  cleanMetaData(): void {
    delete this.metaData.inventory_items;
    this.metaData.assigned_sk = this.metaData.assigned_sk[0].first_name + ' ' + this.metaData.assigned_sk[0].last_name;

    let initiated_date = new Date();
    initiated_date.setTime(Date.parse(this.metaData.initiated_on))
    // this.metaData.initiated_on = initiated_date;
    console.log(initiated_date);

  }

  //  TODO
  setAuditData(): void{
    this.auditReportService.getAuditData(this.id).subscribe(
      (data: any) => {
        this.data = data.inventory_items;
        for (const key in this.data[0]) {
          if (this.data[0].hasOwnProperty(key)){
            this.displayedColumns.push(key);
          }
        }
        this.displayedColumnsStatic = ['Select'].concat(this.displayedColumns); // adding select at the beginning of columns
        this.updatePage();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    )
  }

  updatePage(): void {
    this.updatePaginator();
  }

  updateMetaData(): void {
    this.metaDataSource = new MatTableDataSource([this.metaData]);
  }

  // updates data in table
  updatePaginator(): void {
    const count = 'count';
    this.length = this.data[count];
    if (this.pageIndex > 0) {
  //     Angular paginator starts at 0, Django pagination starts at 1
      this.pageIndex = this.pageIndex - 1;
    }
    this.items = this.data;
    this.errorMessage = '';

    console.log(this.items);

    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.items);
  }

  // If an Inventory item checkbox is selected then add the id to the list
  onChange(value: number): void {
    if (this.selectedItems.includes(value)) {
      this.selectedItems.splice(
        this.selectedItems.indexOf(value),
        1
      );
    } else {
      this.selectedItems.push(value);
    }
  }
}
