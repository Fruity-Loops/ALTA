import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientGridviewComponent } from 'src/app/components/client-gridview/client-gridview.component';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modify-members',
  templateUrl: 'modify-members.component.html',
  styleUrls: ['../client-gridview/client-gridview.component.css', './modify-members.component.css']
})
export class ModifyMembersComponent implements OnInit {
  querrysett;
  view = 'Modify Members';
  checkoutForm;
  @ViewChild(ClientGridviewComponent) appChild: ClientGridviewComponent;

  constructor(
    private manageMembersService: ManageMembersService,
    private formBuilder: FormBuilder,
    private http: HttpClient) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
    });
  }

  ngOnInit(): void {
  }

  onSubmit(name): void {
    this.manageMembersService.sendNameToObtainClients(name).subscribe((response) => {
          this.appChild.updateClients(response);
        });
    this.checkoutForm.reset();
  }
}
