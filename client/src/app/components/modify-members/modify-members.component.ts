import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ManageMembersService } from 'src/app/services/manage-members.service';

@Component({
  selector: 'app-modify-members',
  templateUrl: './modify-members.component.html',
  styleUrls: ['./modify-members.component.css']
})
export class ModifyMembersComponent implements OnInit {
  users: User[] = [];
  display: boolean;
  querrysett;

  constructor(private manageMembersService: ManageMembersService) {
    this.display = false;
  }
  view = 'Modify Members';

  ngOnInit(): void {
  }

  obtainClients(): void {
    this.manageMembersService.getAllClients()
      .subscribe((user) => {
        this.users = JSON.parse(user);
      });
  }
}
