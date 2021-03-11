import {OnInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
// TODO: Get service for bins to populate table data.

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  audits: Array<any>;
  displayedColumns: string[] = ['dateInitiated', 'ID', 'description', 'location', 'bin', 'initiatedBy', 'accuracy', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private bins: any) { // TODO: Replace any with classname of bin service
    this.audits = new Array<any>();
    this.dataSource = new MatTableDataSource<any>(this.audits);
    this.bins.getAllClients().subscribe((audit: any) => {
      this.retrieveData(audit);
    });
  }

  retrieveData(audit: any): void {
    audit.forEach((element: any) => {
      this.audits.push(element);
    });
    console.log(this.audits);
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
    // @ts-ignore
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
  }

}
