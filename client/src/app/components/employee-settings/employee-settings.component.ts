import { Component, OnInit } from '@angular/core';
import {ManageMembersService} from "../../services/manage-members.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.css']
})
export class EmployeeSettingsComponent implements OnInit {

  employee: User;

  constructor(private manageMembersService: ManageMembersService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("ID");

    this.manageMembersService.getEmployee(id).subscribe(employee => {
      let the_id = employee.id;
      let first_name = employee.first_name;
      let last_name = employee.last_name;
      let role = employee.role;
      let is_active = employee.is_active;
      this.employee = {"id":the_id, "first_name":first_name, "last_name":last_name, "role":role, "is_active": is_active};
    })

  }

}
