import { ComponentFixture, TestBed } from '@angular/core/testing';

import {OrganizationViewComponent} from '../organization-view/organization-view.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('OrganizationViewComponent', () => {
  let component: OrganizationViewComponent;
  let fixture: ComponentFixture<OrganizationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationViewComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
