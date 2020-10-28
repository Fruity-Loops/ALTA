import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.css'],
})
export class ManageMembersComponent implements OnInit {
  constructor() {}

  view = 'Manage Members';

  ngOnInit(): void {}
}
