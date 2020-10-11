import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service'

@Component({
  selector: 'app-modify-client-role',
  templateUrl: './modify-client-role.component.html',
  styleUrls: ['./modify-client-role.component.css']
})
export class ModifyClientRoleComponent implements OnInit {

  display: boolean
  querrysett
  users: Array<CustomUser>

  constructor(private DashboardService:DashboardService) {
    this.display = false;
    this.users = new Array<CustomUser>();
  }

  ngOnInit(): void {
  }

  obtainClients()
  {
    this.DashboardService.getAllClients().subscribe(val =>
      {
        this.querrysett = JSON.parse(val);
        for (let i = 0; i < this.querrysett.length; i++)
        {
          this.users.push(new CustomUser(this.querrysett[i].fields));
        }
      });
  }

}

class CustomUser
{
  last_login: string
  user_name: string
  first_name: string
  last_name: string
  role: string
  is_active: string
  email: string

  constructor(fields)
  {
    this.last_login = fields.last_login;
    this.user_name = fields.user_name;
    this.first_name = fields.first_name;
    this.last_name = fields.last_name;
    this.role = fields.role;
    this.is_active = fields.is_active;
    this.email = fields.email;
  }
}