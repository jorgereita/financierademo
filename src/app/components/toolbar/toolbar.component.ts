import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  nombreProyecto = environment.nombreProyecto;
  @Input() estado: boolean;


  seg: number = 0;
  onAuth=false;
  roleId=localStorage.getItem("roleId");
  constructor(private router: Router, private authService: AuthService) {
    let intervalId;
    
    intervalId = setInterval(() => {
      let token = localStorage.getItem("token");
      let expired = localStorage.getItem("expired");

      if (token === null || expired === null) {
        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.onAuth=false
        this.router.navigate(["/auth"]);
        clearInterval(intervalId);
        return;
      }

    
      let expiredClose: number = Number(expired) - (1000 * 60 * 5);
      let fecha: number = new Date().getTime();

     

      if (fecha > expiredClose) {

        localStorage.removeItem("token");
        localStorage.removeItem("expired");
        this.router.navigate(["/auth"]);
        clearInterval(intervalId);
      }

    }, 1000);

    
  }

  ngOnInit() {

  }



  logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("expired");
    this.router.navigate(["/auth"]);
  }



  extend() {
    this.authService.extend().subscribe(res => {
      this.seg = 0;
      localStorage.setItem("token", res.token);
      localStorage.setItem("expired", res.expired.toString());

    });
  }
}


