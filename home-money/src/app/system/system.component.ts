import {Component, HostBinding} from '@angular/core';
import {fadeStateTrigger} from "../shared/animations/fade.animation";

@Component({
  selector: 'sdh-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
  animations: [fadeStateTrigger]
})

export class SystemComponent {
  @HostBinding('@fade') a = true;
}
