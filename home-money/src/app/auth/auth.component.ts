import {Component, HostBinding, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {fadeStateTrigger} from "../shared/animations/fade.animation";

@Component({
  selector: 'sdh-auth',
  templateUrl: './auth.component.html',
  animations: [fadeStateTrigger]
})

export class AuthComponent implements OnInit {
  @HostBinding('@fade') a = true;

  constructor(private routes: Router) {   // Injectable routes

  }

  ngOnInit() {
    this.routes.navigate(['/login']);
  }

}
