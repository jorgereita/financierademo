import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CoordinatorGuardService {

  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem("token") === null || localStorage.getItem("expired") === null) {
      localStorage.removeItem("token");
      localStorage.removeItem("expired");
      this.router.navigate(["/auth"]);
      return false;
    }
    else {
      let fecha: number = new Date().getTime();
      let expired = localStorage.getItem("expired");

      if (Number(expired) - 1000 * 60 * 5 < fecha) {
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/auth"]);
        return false;
      }
      if(localStorage.getItem("roleId")){

        return true;
      }else{
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/auth"]);
        return false;
      }
      
    }

  }
}
