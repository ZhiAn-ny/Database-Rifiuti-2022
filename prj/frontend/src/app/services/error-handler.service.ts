import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Error_Code_Message } from '../models/db-result.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  public handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  public handleLoginError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<Error_Code_Message> => {
      switch (error.status) {
        case 401:
          return of(new Error_Code_Message(
            error.status, 'Email o password non corrette.'
          ));
        case 404: 
        return of(new Error_Code_Message(
          error.status, 'Email non trovata.'
        ));
        default:
          return of(new Error_Code_Message(error.status, error.message));
      }
    }
  }

}
