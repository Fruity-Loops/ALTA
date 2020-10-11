import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modify-members',
  templateUrl: './modify-members.component.html',
  styleUrls: ['./modify-members.component.css']
})
export class ModifyMembersComponent implements OnInit {
  constructor() { }

  view = 'Modify Members';

  ngOnInit(): void {
  }
}
