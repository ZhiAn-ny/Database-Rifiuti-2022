import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public showPwd = true; // currently not used
  public form: FormGroup = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl(''),
  });


  constructor() { }

  ngOnInit(): void {
  }

  public login() {
    console.log(this.form);

    if (this.form.valid) {

      console.log('valid')

      return;
    }

    console.log('invalid')

  }


}
