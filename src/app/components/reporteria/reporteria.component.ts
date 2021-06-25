import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporteria',
  templateUrl: './reporteria.component.html',
  styleUrls: ['./reporteria.component.css']
})
export class ReporteriaComponent implements OnInit {
  roleId=localStorage.getItem("roleId");
  index = 0;
  constructor() { }

  ngOnInit() {
    this.index = 0;
  }

}
