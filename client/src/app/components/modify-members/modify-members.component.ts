import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientGridviewComponent } from 'src/app/components/client-gridview/client-gridview.component';
import { ManageMembersService } from 'src/app/services/manage-members.service';

@Component({
  selector: 'app-modify-members',
  templateUrl: 'modify-members.component.html', // ../client-gridview/client-gridview
  styleUrls: ['../client-gridview/client-gridview.component.css', './modify-members.component.css']
})
export class ModifyMembersComponent extends ClientGridviewComponent implements OnInit {
  querrysett;
  view = 'Modify Members';
  @ViewChild(ClientGridviewComponent) appChild: ClientGridviewComponent;

  constructor(private manageMembersService: ManageMembersService) {
    super();
  }

  ngOnInit(): void {
  }

  obtainClients(): void {
    this.manageMembersService.getAllClients()
      .subscribe((user) => {
        this.appChild.users = JSON.parse(user);
      });
  }
}
