import { Component } from '@angular/core';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { interval, Subscription } from 'rxjs';
import { HardwareConnectionService } from './hardware-connection.service';
import { PingAction } from './model/action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  faLightbulb = faLightbulb;

  private pingSubscription?: Subscription;

  connected$ = this.connection.connected$;

  constructor(
    private connection: HardwareConnectionService
  ) { }

  ngOnInit() {
    this.pingSubscription = interval(1000)
      .subscribe(() => this.connection.dispatch(PingAction.INSTANCE));
  }

  ngOnDestroy() {
    this.pingSubscription?.unsubscribe();
  }
}
