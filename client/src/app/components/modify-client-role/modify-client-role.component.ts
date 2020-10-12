import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-modify-client-role',
  templateUrl: './modify-client-role.component.html',
  styleUrls: ['./modify-client-role.component.css']
})
export class ModifyClientRoleComponent implements OnInit {

  display: boolean;
  querrysett;
  users: Array<CustomUser>;

  constructor(private dashboardService: DashboardService) {
    this.display = false;
    this.users = new Array<CustomUser>(0);
  }

  ngOnInit(): void {
  }

  obtainClients(): void
  {
    this.dashboardService.getAllClients().subscribe(val =>
      {
        this.querrysett = JSON.parse(JSON.parse(val));
        if (this.users.length !== 0)
        {
          this.users = new Array<CustomUser>(0);
        }
        for (const value of this.querrysett)
        {
          this.users.push(new CustomUser(value.fields));
        }
      });
  }

}

class CustomUser
{
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;

  constructor(fields)
  {
    this.userName = fields.user_name;
    this.firstName = fields.first_name;
    this.lastName = fields.last_name;
    this.role = fields.role;
    this.email = fields.email;
  }
}
