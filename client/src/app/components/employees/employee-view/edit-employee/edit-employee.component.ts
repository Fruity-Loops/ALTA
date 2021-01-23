import { Component, Input, OnInit } from '@angular/core';
import { ManageMembersService } from '../../../../services/manage-members.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../models/user.model';
import roles from 'src/app/fixtures/roles.json';
import { EmployeeView } from '../employee-view';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
})
export class EditEmployeeComponent extends EmployeeView implements OnInit {
  @Input() employee: User;
  @Input() employeeCopy: User;
  edit = false;
  defaultPassword = '';
  password: string = this.defaultPassword;
  @Input() role: string;
  @Input() isActive: string;
  @Input() location: string;
  id: string;
  isLoggedInUser: BehaviorSubject<boolean>;
  isSystemAdmin = false;
  body: any;

  activeStates = [{ state: 'active' }, { state: 'disabled' }];
  roles = roles;

  constructor(
    private manageMembersService: ManageMembersService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
    // If the ID changes in the route param then reload the component
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID ? routeParams.ID : localStorage.getItem('id');
      this.ngOnInit();
    });
  }

  getTitle(): string {
    // need to initialize here because the super constructor needs to be the first thing that gets called
    this.isLoggedInUser = new BehaviorSubject(false);
    const generateString = () => (this.isLoggedInUser.getValue() ? "Profile" : "Employee") +  " Settings";

    // put a subscription in case of changes for whether the user is logged in or not
    this.isLoggedInUser.subscribe(_ => {
      this.title = generateString();
    });
    return generateString();
  }

  ngOnInit(): void {
    this.getEmployee();

    // Verifying that the logged in user is accessing his informations
    if (this.id === localStorage.getItem('id')) {
      this.isLoggedInUser.next(true);
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
        location: employee.location,
      };
      this.setSelectors();
    });
  }

  setSelectors(): void {
    this.isActive = this.employee.is_active ? 'active' : 'disabled';
    this.location = this.employee.location === undefined ? '' : this.employee.location;
    if (this.employee.role === 'SA') {
      this.isSystemAdmin = true;
    } else {
      this.roles = this.roles.filter(({ abbrev}) => abbrev !== 'SA');
    }

    this.roles.forEach((role) => {
      if (role.abbrev === this.employee.role) {
        this.role = role.name;
      }
    });
  }

  editMode(turnOn: boolean): void {
    this.edit = turnOn;
    if (!turnOn) {
      this.submit();
    }
  }

  // Will be used to reload (refresh) the page when the cancel button is clicked
  reloadPage(): void {
    window.location.reload();
  }

  submit(): void {
    // update user info
    this.employee.is_active = this.isActive === 'active';

    this.roles.forEach((role) => {
      if (role.name === this.role) {
        this.employee.role = role.abbrev;
      }
    });

    this.employee.location = this.location;

    // Create a deep copy of the employee object in order to delete the uneditable
    // fields (id, email) from the copied object and send only the editable fileds to the server.
    const patchedEmployee = JSON.parse(JSON.stringify(this.employee));

    delete patchedEmployee.id;
    delete patchedEmployee.email;

    this.manageMembersService
      .updateClientInfo(patchedEmployee, this.id)
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
