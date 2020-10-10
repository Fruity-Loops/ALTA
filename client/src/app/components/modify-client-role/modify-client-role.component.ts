import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service'

@Component({
  selector: 'app-modify-client-role',
  templateUrl: './modify-client-role.component.html',
  styleUrls: ['./modify-client-role.component.css']
})
export class ModifyClientRoleComponent implements OnInit {

  display: boolean;
  querrysett 

  constructor(private DashboardService:DashboardService) {
    this.display = false;
  }

  ngOnInit(): void {
  }

  obtainClients()
  {
    this.DashboardService.getAllClients().subscribe(val => this.querrysett = val);
  }

}
