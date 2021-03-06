import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ChartComponent} from 'ng-apexcharts';
import {ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {HttpParams} from '@angular/common/http';
import {DashboardLangFactory} from './dashboard.language';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  dataSource: MatTableDataSource<any>;
  audits: Array<any>;
  displayedColumns: string[] = ['initiated_on', 'audit_id', 'location', 'bin', 'initiated_by', 'accuracy', 'status'];
  chartOptions: any;
  private params = new HttpParams();
  private xData = [];
  private yData = [];

  title = 'Dashboard';
  auditsTable = {title: 'Most Recent Audits', dateInitiated: 'Date Initiated', id: 'ID', location: 'Location', bin: 'Bin',
    initiated_by: 'Initiated By', accuracy: 'Accuracy', status: 'Status'};
  accuracyTitle = 'Audit Accuracy over Time';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild('chart') chart: ChartComponent | undefined;


  constructor(private auditService: ManageAuditsService) {
    this.audits = new Array<any>();
    this.dataSource = new MatTableDataSource<any>(this.audits);
    this.params = this.params.append('organization', String(localStorage.getItem('organization_id')));
    this.auditService.getProperAudits(this.params).subscribe((audit: any) => {
      this.retrieveData(audit);
    });
    this.chartSetup();

    const lang = new DashboardLangFactory();
    [this.title, this.auditsTable, this.accuracyTitle] = [lang.lang.title, lang.lang.auditsTable, lang.lang.accuracyTitle];
  }

  retrieveData(audit: any): void {
    audit.forEach((element: any) => {
      const getDate = element.initiated_on.replace(/\//g, ' '); // Remove forward slash from initiated date.
      const splitDate = getDate.split(' ', 3); // Split the initiated date by space.
      const dateObj = splitDate[1] + '/' + splitDate [0] + '/' + splitDate[2]; // change order to MM/DD/YYYY
      const date: Date = new Date(dateObj); // Created date object using the changed ordered date.
      const thirtyDaysAgo: Date = new Date(); // Get today's date
      thirtyDaysAgo.setDate(new Date().getDate() - 30); // today's date minus 30 days.

      if (thirtyDaysAgo <= date) {
        this.audits.push(element);
        // @ts-ignore
        this.xData.push(dateObj);
        // @ts-ignore
        this.yData.push(element.accuracy);
      }
    });
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
          data: this.yData
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
        text: this.accuracyTitle,
        align: 'left'
      },
      labels: this.xData,
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        opposite: false
      },
    };
  }
}
