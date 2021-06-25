import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem("token") === null || localStorage.getItem("expired") === null) {
      localStorage.removeItem("token");
      localStorage.removeItem("expired");
      return true;
    }
    else {
      let fecha: number = new Date().getTime();
      let expired = localStorage.getItem("expired");

      if (Number(expired) - 1000 * 60 * 5 < fecha) {
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        return true;
      }

      this.router.navigate(["/home"]);
      return false;
    }

  }
}
