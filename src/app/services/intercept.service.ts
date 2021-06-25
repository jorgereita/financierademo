import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //SI ES UNA PETICION PARA LOGIN
    if (req.headers.get("No-Auth") == "True") {
      return next.handle(req.clone());
    }

    let token = localStorage.getItem("token");
    let expired = localStorage.getItem("expired");

    if (token != null && expired != null) {

      let fecha: number = new Date().getTime();

      if (fecha > Number(expired)) {
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/login"]);
        return;
      }

      const clonedreq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      });

      return next.handle(clonedreq).pipe(tap(event => {
        // if (event instanceof HttpResponse) {

        //   console.log(" all looks good");
        //   // http response status code
        //   console.log(event.status);
        // }
      }, error => {
        console.log(error.status);
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/login"]);
      }));

    }
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("expired");
      this.router.navigate(["/login"]);
    }

  }

}
