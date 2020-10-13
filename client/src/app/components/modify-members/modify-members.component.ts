import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-modify-members',
  templateUrl: './modify-members.component.html',
  styleUrls: ['./modify-members.component.css']
})
export class ModifyMembersComponent implements OnInit {
  users: User[] = [];
  display: boolean;
  querrysett;

  constructor(private dashboardService: DashboardService) {
    this.display = false;
  }
  view = 'Modify Members';

  ngOnInit(): void {
  }

  obtainClients(): void {
    this.dashboardService.getAllClients()
      .subscribe((user) => {
        this.users = JSON.parse(user);
      });
  }
}
