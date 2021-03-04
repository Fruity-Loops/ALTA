import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private dashService: DashboardService) {}
  displayedColumns: string[] = ['Bin'];
  displayedColumns_2: string[] = ['Part'];
  displayedColumns_3: string[] = ['Item'];
  dataSource: any = [];
  dataSource_2: any = [];
  dataSource_3: any = [];

  view = 'Dashboard';
  response: any;
  params = new HttpParams();

  ngOnInit(): void {
    this.params = this.params.append(
      'organization',
      String(localStorage.getItem('organization_id'))
    );
    this.getRecommendations();
  }

  getRecommendations(): void {
    console.log(this.params);
    this.dashService.getRecommendations(this.params).subscribe((data) => {
      console.log(data);
      // this.response = data['bins_recommendation'][0].Bin;
      this.response = data['bins_recommendation'];
      this.dataSource = data['bins_recommendation'];
      this.dataSource_2 = data['parts_recommendation'];
      this.dataSource_3 = data['items_recommendation'];
      // console.log(Object.values(data));
    });
  }
}
