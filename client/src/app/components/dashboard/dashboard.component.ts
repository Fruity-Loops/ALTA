import {OnInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ChartComponent} from 'ng-apexcharts';
import {ManageMembersService} from 'src/app/services/users/manage-members.service'; // TODO: Replace with service for bin

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  audits: Array<any>;
  displayedColumns: string[] = ['dateInitiated', 'ID', 'description', 'location', 'bin', 'initiatedBy', 'accuracy', 'status'];
  chartOptions: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild('chart') chart: ChartComponent | undefined;

  constructor(private bins: ManageMembersService) { // TODO: Change classname of service
    this.audits = new Array<any>();
    this.dataSource = new MatTableDataSource<any>(this.audits);
    this.bins.getAllClients().subscribe((audit) => {
      this.retrieveData(audit);
    });
    this.chartSetup();
  }

  ngOnInit(): void {
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

  chartSetup(): void {
    this.chartOptions = {
      accuracyOverTime: [
        {
          name: 'Accuracy (%)',
          data: [81, 81, 81, 81, 83, 84, 84, 85, 75, 78, 82, 85, 86, 86, 86, 85, 84, 86, 88, 95]
        }
      ],
      chart: {
        toolbar: {
          show: false,
        },
        type: 'area',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      title: {
        text: 'Audit Accuracy over Time',
        align: 'left'
      },
      labels: ['13 Nov 2021', '14 Nov 2021', '15 Nov 2021', '16 Nov 2021', '17 Nov 2021', '20 Nov 2021', '21 Nov 2021',
        '22 Nov 2021', '23 Nov 2021', '24 Nov 2021', '27 Nov 2021', '28 Nov 2021', '29 Nov 2021', '30 Nov 2021',
        '01 Dec 2021', '04 Dec 2021', '05 Dec 2021', '06 Dec 2021', '07 Dec 2021', '08 Dec 2021'],
      // If by time then use Datetime Object and change type as well. e.g.: 2018-09-19T00:00:00.000Z and type: 'dd/MM/yy HH:mm'
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        opposite: false
      },
    };
  }
}
