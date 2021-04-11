import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {env} from 'src/environments/environment';


@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent implements OnDestroy, AfterViewInit {

  openRegistraion: boolean = env.open_registration;

  ngAfterViewInit(): void {
    // @ts-ignore
    document.querySelector('body').classList.add('greeting');
  }

  ngOnDestroy(): void {
    // @ts-ignore
    document.querySelector('body').classList.remove('greeting');
  }
}
