import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  changeForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  error = false;
  mensaje: string;

  constructor(public snackBar: MatSnackBar, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.changeForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password1: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.changeForm.controls; }

  change() {
    if (this.changeForm.invalid) {
      return;
    }

    if (this.f.password.value == this.f.password1.value) {
      this.mensaje = "La contraseña nueva no puede ser igual a la actual";
      this.error = true;
      return;
    }

    if (this.f.password1.value != this.f.password2.value) {
      this.mensaje = "La contraseña no coincide";
      this.error = true;
      return;
    }

    this.loading = true;
    this.submitted = true;
    this.authService.change(this.f.password.value, this.f.password1.value).subscribe(res => {
      if (res.error == 0) {
        this.loading = false;
        this.error = false;
        this.MostarMensaje("La contraseña se cambio correctamente");
        this.router.navigate(["/home"]);
        return;
      }
      else if (res.error == 1) {
        this.loading = false;
        this.submitted = false;
        this.mensaje = "Contraseña erronea";
        this.error = true;
        return;
      }
    });
  }

  MostarMensaje(mensaje) {
    this.snackBar.open(mensaje, "", {
      duration: 3000
    });
  }


}
