import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HouseComponent } from './house/house.component';
import { PowerComponent } from './power/power.component';
import { RoomComponent } from './room/room.component';
import { SwitchesComponent } from './switches/switches.component';
import { LoadingComponent } from './loading/loading.component';



@NgModule({
  declarations: [
    AppComponent,
    HouseComponent,
    RoomComponent,
    PowerComponent,
    SwitchesComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FontAwesomeModule,
    MatToolbarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
