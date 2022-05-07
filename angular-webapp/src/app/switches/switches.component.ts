import { Component } from '@angular/core';
import { HardwareConnectionService } from '../hardware-connection.service';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss']
})
export class SwitchesComponent {

  switches$ = this.connection.switches$;

  constructor(
    private connection: HardwareConnectionService
  ) { }

}
