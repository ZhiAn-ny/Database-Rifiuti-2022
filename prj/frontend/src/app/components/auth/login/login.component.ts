import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Error_Code_Message } from 'src/app/models/db-result.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public hasError = false;
  public errorMessage = 'Email o password errate.';
  public form: FormGroup = new FormGroup({
    email: new FormControl(''),
    pwd: new FormControl(''), // [Validators.required, Validators.minLength(7)]
  });

  private formChanges: Subscription;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
  ) { 
    this.formChanges = this.form.valueChanges.subscribe(ch => {
      this.hasError = false;
    })

  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.formChanges.unsubscribe();
    this.subscription.unsubscribe();
  }

  public async login() {
    this.subscription = this.authService.login(
      this.form.value.email, this.form.value.pwd
    ).subscribe(res => {
      if (res instanceof Error_Code_Message) {
        this.showErrorMessage(res);
      }
    })


  }

  private showErrorMessage(err: Error_Code_Message) {
        this.errorMessage = err.msg;
        this.hasError = true;
  }


}
