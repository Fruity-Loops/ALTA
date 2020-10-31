import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientGridviewComponent } from 'src/app/components/client-gridview/client-gridview.component';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-modify-members',
  templateUrl: 'modify-members.component.html',
  styleUrls: ['../client-gridview/client-gridview.component.css', './modify-members.component.scss']
})
export class ModifyMembersComponent implements OnInit {
  querrysett;
  view = 'Modify Members';
  checkoutForm;
  nameFormControl = new FormControl('', [
    Validators.required
  ]);

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
    this.manageMembersService.getSpecificClients(name).subscribe((response) => {
          this.appChild.populateTable(response);
        });
    this.checkoutForm.reset();
  }
}
