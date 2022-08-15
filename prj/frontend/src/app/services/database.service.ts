import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable } from 'rxjs';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  private url = 'http://localhost:3000/auth/signup'
  private httopOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  }
  
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

    public signup(user: Omit<User, "id">): Observable<User> {
      console.log(this.url)
      return this.http.post<User>(this.url, user, this.httopOptions).pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      )
    }

}
