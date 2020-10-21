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

  constructor(private organizationsService: ManageOrganizationsService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllOrganizations()
    this.selectedOrganization = { org_id: -1, org_name: "", status: "" };
  }

  getAllOrganizations(): void {
    this.organizationsService.getAllOrganizations().subscribe(
      (data) => {
         this.organizations= data;
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  organizationClicked(organization): void {
    // console.log(organization.org_id)
    this.organizationsService.getOneOrganization(organization.org_id).subscribe(
      (data)=> {
        this.selectedOrganization = data
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  updateOrganization(): void {
    this.organizationsService.updateOrganization(this.selectedOrganization).subscribe(
      (data)=>{
         this.selectedOrganization = data
         this.getAllOrganizations()
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  createOrganization(): void {
    this.organizationsService.createOrganization(this.selectedOrganization).subscribe(
      (data) => {
        this.organizations.push(data)
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  deleteOrganization():void{
    this.organizationsService.deleteOrganization(this.selectedOrganization.org_id).subscribe(
      (data)=>{
        this.getAllOrganizations()
      },
      (err)=>{
        console.log(err)
      }
    )
  }
}
