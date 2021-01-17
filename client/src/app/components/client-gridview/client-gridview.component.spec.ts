import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ClientGridviewComponent} from './client-gridview.component';
import {HttpClientModule} from '@angular/common/http';
import {ManageMembersService} from 'src/app/services/manage-members.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('ClientGridViewComponent', () => {
  let component: ClientGridviewComponent;
  let fixture: ComponentFixture<ClientGridviewComponent>;
  // @ts-ignore
  let service: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientGridviewComponent],
      providers: [ManageMembersService],
      imports: [HttpClientModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(ClientGridviewComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    fixture.detectChanges();
  });

  it('should create Client grid view component', () => {
    expect(component).toBeTruthy();
  });
});
