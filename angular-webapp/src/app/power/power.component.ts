import { Component } from '@angular/core';
import { HardwareConnectionService } from '../hardware-connection.service';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})
export class PowerComponent {

  sensor$ = this.connection.sensors$;

  constructor(
    private connection: HardwareConnectionService
  ) { }

}
