import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-modify-client-role',
  templateUrl: './modify-client-role.component.html',
  styleUrls: ['./modify-client-role.component.css']
})
export class ModifyClientRoleComponent implements OnInit {

  users:User[] = [];
  display: boolean;
  querrysett;

  constructor(private dashboardService: DashboardService) {
    this.display = false;
  }

  ngOnInit(): void {
  }

  obtainClients(): void
  {
    this.dashboardService.getAllClients()
    .subscribe((user) =>
      {
        this.users = JSON.parse(user);
      });
  }
}
