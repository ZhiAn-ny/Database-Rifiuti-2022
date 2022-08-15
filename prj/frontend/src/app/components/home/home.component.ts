import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private DBService: DatabaseService,
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

    this.DBService.signup(user).subscribe( msg => {
      console.log(msg)
    });
  }

}
