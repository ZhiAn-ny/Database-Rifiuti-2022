import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  public onClick() {
    let user: User = {
      name: 'Sherlock',
      email: 'sh@deduction.en',
      password: 'm43oi9a0dygFSDef234Gd'
    }

    console.log(user)

    this.authService.signup(user).subscribe( msg => {
      console.log(msg)
    });
  }

}
