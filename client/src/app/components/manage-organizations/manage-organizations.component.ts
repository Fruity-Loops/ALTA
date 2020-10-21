import { Component, OnInit } from '@angular/core';
import { ManageOrganizationsService } from 'src/app/services/manage-organizations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent implements OnInit {
  organizations = []
  selectedOrganization

  constructor(private manageOrganizationsService: ManageOrganizationsService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllOrganizations()
  }

  getAllOrganizations(): void {
    this.manageOrganizationsService.getAllOrganizations().subscribe(
      (data) => {
         this.organizations= data;
      },
      (err)=>{
        console.log(err)
      }
    )
  }

}
