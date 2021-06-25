import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  hide = true;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }


  get f() { return this.registerForm.controls; }


  register() {

    if (this.registerForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;


    localStorage.setItem("email", this.f.email.value);

    this.router.navigate(["/home"]);
  }

}
