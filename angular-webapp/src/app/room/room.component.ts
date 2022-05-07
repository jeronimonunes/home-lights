import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { HardwareConnectionService } from '../hardware-connection.service';
import { LoadingComponent } from '../loading/loading.component';
import { UpdateLightAction } from '../model/action';
import { Light } from '../model/lights';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {

  faLightbulb = faLightbulb;

  private lightSubscription?: Subscription;
  private spinner?: MatDialogRef<any>;

  @Input()
  @HostBinding('style.grid-area')
  name!: string;

  @Input()
  light!: Light;

  state = false;
  pwm = 255;

  @HostBinding('style.background-color')
  get backgroundColor() { return this.state ? 'yellow' : 'white' };

  @HostBinding('style.color')
  get color() { return this.state ? 'black' : 'gray'; }

  constructor(
    private matDialog: MatDialog,
    private connection: HardwareConnectionService
  ) { }

  ngOnInit() {
    this.lightSubscription = this.connection.lights$.subscribe(lights => {
      this.spinner?.close();
      this.state = lights.state.get(this.light);
      this.pwm = lights.pwm[this.light];
    })
  }

  ngOnDestroy() {
    this.lightSubscription?.unsubscribe();
  }


  @HostListener('click')
  click() {
    this.spinner?.close();
    this.spinner = this.matDialog.open(LoadingComponent);
    this.connection.dispatch(new UpdateLightAction(this.light, !this.state, this.pwm))
  }

}
