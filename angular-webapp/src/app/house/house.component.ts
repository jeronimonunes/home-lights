import { Component } from '@angular/core';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent {

  faLightbulb = faLightbulb;

  rooms = [
    "lavanderia",
    "cozinha",
    "joicce",
    "copa",
    "sala",
    "jeronimo",
    "celsli",
    "varanda"
  ]

  trackByIdx = (i: number) => i;

}
