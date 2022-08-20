import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  private _isAuthenticated = false;
  
  constructor(
  ) { }

  public get isAuthenticated(): boolean { return this._isAuthenticated; }

  ngOnInit(): void {
  }

}
