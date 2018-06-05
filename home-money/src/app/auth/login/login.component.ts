import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Meta, Title} from "@angular/platform-browser";

import {User} from '../../shared/models/user.model';
import {Message} from '../../shared/models/message.models';
import {UsersService} from '../../shared/services/users.service';
import {AuthService} from '../../shared/services/auth.service';
import {fadeStateTrigger} from "../../shared/animations/fade.animation";


@Component({
  selector: 'sdh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {
  message: Message;
  form: FormGroup;

  constructor(private userService: UsersService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private meta: Meta
  ) {
    title.setTitle('Вход в систему');  // Важный момент обращаемся без this т к это параметр только в конструктор
    // meta.getTags([  // добавление метатегов, не работает
    //   {name: 'keywords', content: 'логин,вход,система'},
    //   {name: 'description', content: 'Страница для входа в систему'}
    // ]);
  }

  ngOnInit() {
    this.message = new Message('', 'danger'); // Важно определять в этом месте до того как мы подписываемся на this.route.queryParams т к message будет не определено соответственно не видно

    this.route.queryParams.subscribe((params: Params) => {
      if (params['nowCanLogin']) {
        this.showMessage({
          text: 'Теперь вы можете войти в систему',
          type: 'success'
        });
      } else if (params['accessDenied']){
        this.showMessage({
          text: 'Для работы с системой вам необходимо войти',
          type: 'warning'
        });
      }
    });

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
      // email and password typeof string because when the file is minified variables can be reduced that we do not need
    });
  }

  private showMessage(message: Message) {
    this.message = message;
    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  onSubmit() {
    const formData = this.form.value;
    this.userService.getUserByEmail(formData.email)
      .subscribe((user: User) => {
        debugger;
        if (user) {
          if (user.password === formData.password) {
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            this.router.navigate(['/system', 'bill']);
          } else {
            this.showMessage({
              text: 'Пароль не верный',
              type: 'danger'
            });
          }
        } else {
          this.showMessage({
            text: 'Такого пользователя не существует',
            type: 'danger'
          });
        }
      });
  }

}
