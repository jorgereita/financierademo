import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { 

  loginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  hide = true;
  error = false;
  mensaje: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {



  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // console.log(this.error ,
    //   this.submitted,
    //   this.loading ) 
  }


  get f() { return this.loginForm.controls; }


  login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;
    sessionStorage.setItem("email", this.f.email.value);
    this.authService.authenticate(this.f.email.value, this.f.password.value).subscribe(res => {
      if (res.IdError == 2 || res.IdError==-999) {

        this.mensaje = "Se ha generado un error. Intente de nuevo";
        this.error = true;
        this.submitted = false;
        this.loading = false;
        return;
      }

      if (res.IdError == 1) {

        this.mensaje = "Usuario y/o contraseña erronea";
        this.error = true;
        this.submitted = false;
        this.loading = false;
        return;
      }
     
      localStorage.setItem("token", res.JWT);
      localStorage.setItem("expired", res.Expiracion.toString());
      // localStorage.setItem("roleId", res.roleId.toString());
      this.router.navigate(["/home"]);
      return;
      //1 puede seguir
      //2 no esta enrolado
      //0 no foto hoy
      //-1 no requerido 
      
      // if (res.Identificado == 1 ||res.Identificado == -1) {
      //   var idTokenFace=(parseInt(localStorage.getItem("expired")))*2;
      //   localStorage.setItem("idTokenFace",idTokenFace.toString() );
      //   this.router.navigate(["/home"]);
      // }
      // if (res.Identificado == 2) {
      //   this.mensaje = "El Usuario no se encuentra enrolado , contactese con el area de RH.";
      //   this.error = true;
      //   this.submitted = false;
      //   this.loading = false;
      //   return;
      // }
    
      // if (res.Identificado == 0) {
      //   var idTokenFace=(parseInt(localStorage.getItem("expired")))*4;
      //   localStorage.setItem("idTokenFace",idTokenFace.toString() );
      //    this.router.navigate(["/facematch"]);
      // }
     

    }, err => {
      this.mensaje = "Se ha generado un error. Intente de nuevo"
      this.submitted = false;
      this.loading = false;
      this.error = true;
    });


  }

}
