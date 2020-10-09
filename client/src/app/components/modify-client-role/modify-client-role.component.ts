import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modify-client-role',
  templateUrl: './modify-client-role.component.html',
  styleUrls: ['./modify-client-role.component.css']
})
export class ModifyClientRoleComponent implements OnInit {

  display: boolean;

  constructor() {
    this.display = false;
  }

  ngOnInit(): void {
  }


}
