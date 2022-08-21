import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, first, Observable, of, tap } from 'rxjs';
import { Error_Code_Message } from '../models/db-result.model';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = 'http://localhost:3000/auth/'

  private isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  private userID!: Pick<User, "id">; // used in login function

  private httopOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  }
  
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
  ) { }

    public signup(user: Omit<User, "id">): Observable<User> {
      return this.http.post<User>(this.url + 'signup', user, this.httopOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      )
    }

    public login(email: Pick<User, "email">, 
                 password: Pick<User, "password">): 
    Observable<{ token: string; ID: Pick<User, "id">} | Error_Code_Message>{
      return this.http.post(
        this.url + 'login',
        { email, password },
        this.httopOptions
      ).pipe(
        first<any,any>(), 
        tap((tokenObject: { token: string; ID: Pick<User, "id">}) => {
          this.userID = tokenObject.ID;
          localStorage.setItem("token",tokenObject.token);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["home"])
        }),
        catchError( this.errorHandlerService
          .handleLoginError<Error_Code_Message>("login") 
        )
      )
    }

}
