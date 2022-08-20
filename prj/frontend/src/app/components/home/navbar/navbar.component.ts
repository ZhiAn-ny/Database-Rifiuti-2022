import { Component, OnInit } from '@angular/core';
import { AppBarThemeColor, AppBarPositionMode } from '@progress/kendo-angular-navigation';
import { enum_AppBarColor, enum_AppBarPositionMode } from 'src/app/models/navbar.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public themeColor: AppBarThemeColor =  enum_AppBarColor.INHERIT;
  public positionMode: AppBarPositionMode =  enum_AppBarPositionMode.STATIC;
  
  public title = 'ASGR';

  constructor() { }

  ngOnInit(): void {
  }

}
