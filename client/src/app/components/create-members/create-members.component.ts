import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-members',
  templateUrl: './create-members.component.html',
  styleUrls: ['./create-members.component.scss']
})
export class CreateMembersComponent implements OnInit {
  constructor() { }

  view = 'Create Members';

  ngOnInit(): void {
  }
}
