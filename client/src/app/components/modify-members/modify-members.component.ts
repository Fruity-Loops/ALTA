import { Component, OnInit } from '@angular/core';
import { ClientGridviewComponent } from 'src/app/components/client-gridview/client-gridview.component';
import { ManageMembersService } from 'src/app/services/manage-members.service';

@Component({
  selector: 'app-modify-members',
  templateUrl: '../client-gridview/client-gridview.component.html',
  styleUrls: ['../client-gridview/client-gridview.component.css', './modify-members.component.css']
})
export class ModifyMembersComponent extends ClientGridviewComponent implements OnInit {
  querrysett;
  view = 'Modify Members';

  constructor(private manageMembersService: ManageMembersService) {
    super();
    this.display = false;
    this.obtainClients();
  }

  ngOnInit(): void {
  }

  obtainClients(): void {
    this.manageMembersService.getAllClients()
      .subscribe((user) => {
        this.users = JSON.parse(user);
      });
  }
}
