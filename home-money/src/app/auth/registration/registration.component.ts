import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/models/user.model';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'sdh-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
    form: FormGroup;
  constructor(
    private usersService: UsersService,
    private router: Router,
    private title: Title
  ) {
    title.setTitle('Регистрация');
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required]),
      'agree': new FormControl(false, [Validators.requiredTrue]) // checkbox valid in position true
    });
  }

  onSubmit() {
    const {email, password, name} = this.form.value;
    const user = new User(email, password, name);

    this.usersService.createNewUser(user).subscribe(() => {
      this.router.navigate(['/login'], {
        queryParams: {
          nowCanLogin: true
        }
      });
    });
  }

  forbiddenEmails(control: FormControl): Promise<any> { // возвращаем промис т к работаем  с асинхронными данными
    debugger;
    return new Promise((resolve, reject) => {
      this.usersService.getUserByEmail(control.value).subscribe((user: User) => { // control.value i.e. the current value of input
        if (user) {
          resolve({forbiddenEmail: true}); // по этому ключу будем делать различные валидации
        } else {
          resolve(null);
        }
      });

    });

  }


}
