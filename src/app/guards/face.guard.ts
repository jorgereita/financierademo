import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FaceGuard implements CanActivate {

    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            
        if (localStorage.getItem("idTokenFace") == null) {
            localStorage.removeItem("token");
            localStorage.removeItem("expired");
            localStorage.removeItem("roleId");
            localStorage.removeItem("idTokenFace");
            this.router.navigate(["/auth"]);
            return false
        }
        var calcTkn = (parseInt(localStorage.getItem("idTokenFace")) / 4).toString();
        if (calcTkn == localStorage.getItem("expired")) {

            return true;

        } else {
            var calcTkn = (parseInt(localStorage.getItem("idTokenFace")) / 2).toString();
            if (calcTkn == localStorage.getItem("expired")) {
                this.router.navigate(["/home"]);
                return false;
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("expired");
                localStorage.removeItem("roleId");
                localStorage.removeItem("idTokenFace");
                this.router.navigate(["/auth"]);
                return false;
            }

        }
    }
}
