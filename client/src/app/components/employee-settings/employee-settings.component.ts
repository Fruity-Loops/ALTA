import { Component, OnInit } from '@angular/core';
import {ManageMembersService} from "../../services/manage-members.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss']
})
export class EmployeeSettingsComponent implements OnInit {

  employee: User;

  constructor(private manageMembersService: ManageMembersService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("ID");

    this.manageMembersService.getEmployee(id).subscribe(employee => {
      this.employee = {
        "id": employee.id,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "role": employee.role,
        "is_active": employee.is_active,
      };
    })

  }

}
