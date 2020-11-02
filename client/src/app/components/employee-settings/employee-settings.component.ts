import { Component, Input, OnInit } from '@angular/core';
import { ManageMembersService } from '../../services/manage-members.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss'],
})
export class EmployeeSettingsComponent implements OnInit {
  @Input() employee: User;
  @Input() employeeCopy: User;
  edit = false;
  defaultPassword = '';
  password: string = this.defaultPassword;
  @Input() role: string;
  @Input() isActive: string;
  id: string;
  isLoggedInUser = false;
  body: any;

  activeStates = [{ state: 'active' }, { state: 'disabled' }];
  roles = [
    { name: 'System Admin', abbrev: 'SA' },
    { name: 'Inventory Manager', abbrev: 'IM' },
    { name: 'Stock Keeper', abbrev: 'SK' },
  ];

  constructor(
    private manageMembersService: ManageMembersService,
    private activatedRoute: ActivatedRoute
  ) {
    // If the ID changes in the route param then reload the component
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.getEmployee();

    // Verifying that the logged in user is accessing his informations
    if (this.id === localStorage.getItem('user_id')) {
      this.isLoggedInUser = true;
    }
  }

  getEmployee(): void {
    this.manageMembersService.getEmployee(this.id).subscribe((employee) => {
      this.employee = {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        is_active: employee.is_active,
        email: employee.email,
      };

      this.setSelectors();
      this.employeeCopy = this.employee;
    });
  }

  setSelectors(): void {
    this.isActive = this.employee.is_active ? 'active' : 'disabled';
    this.roles.forEach((role) => {
      if (role.abbrev === this.employee.role) {
        this.role = role.name;
      }
    });
  }

  editMode(turnOn: boolean): void {
    this.edit = turnOn;
    if (!turnOn) {
      this.employee = this.employeeCopy;
      this.setSelectors();
    }
  }

  submit(): void {
    //update user info
    this.employee.is_active = this.isActive === 'active';

    this.roles.forEach((role) => {
      if (role.name === this.role) {
        this.employee.role = role.abbrev;
      }
    });

    this.manageMembersService
      .updateClientInfo(this.employee, this.id)
      .subscribe((response) => {
        location.reload();
      });

    // update user password
    if (this.password.length > 0) {
      this.body = {
        password: this.password,
      };
      this.manageMembersService.updatePassword(this.body, this.id).subscribe(
        (response) => {
          location.reload();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
