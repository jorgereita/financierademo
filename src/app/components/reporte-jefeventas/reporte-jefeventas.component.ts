import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reporte-jefeventas',
  templateUrl: './reporte-jefeventas.component.html',
  styleUrls: ['./reporte-jefeventas.component.scss']
})
export class ReporteJefeventasComponent implements OnInit {


  waitSend = false;
  dataElement
  dataMes
  dataMes1
  dataHoy = []
  dataHoy1 = []
  getClass1(type) {

    if (type >= 0 && type <= 44) {
      return 'colorRojo';
    }
    if (type >= 45 && type <= 64) {
      return 'colorNaranja';
    }
    if (type >= 65  ) {
      return 'colorVerde';
    }
  }

  getClass2(type) {

    if (type >= 0 && type <= 44) {
      return 'colorRojo';
    }
    if (type >= 45 && type <= 90) {
      return 'colorNaranja';
    }
    if (type >= 91  ) {
      return 'colorVerde';
    }
   
  }
  constructor(private _snackBar: MatSnackBar, private dataService: DataService,) { }

  ngOnInit() {
    this.waitSend = true;
    this.dataService.reporteJefeVentas().subscribe(response => { 
      this.waitSend = false;
      if (response.IdError == 0) {
     
        this.dataElement = response;
 
      } else {
        this.openSnackBar(response.Mensaje, "Cerrar");
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  onSearchChange(event: any) {
    var val = event;
    var userForFilter = [];

    var data = this.dataHoy1;
    for (var e in data) {
      if (((data[e].Name ? data[e].Name : "").toLowerCase().includes(val.toLowerCase()) || (data[e].NombreAsesor ? data[e].NombreAsesor : "").toLowerCase().includes(val.toLowerCase()) || (data[e].FechaControl ? data[e].FechaControl : "").toLowerCase().includes(val.toLowerCase()))) {
        userForFilter.push(data[e])
      }
    }

    this.dataHoy = userForFilter;

  }
  onSearchChange2(event: any) {
    var val = event;
    var userForFilter = [];

    var data = this.dataMes1;
    for (var e in data) {
      if ((data[e].Name ? data[e].Name : "").toLowerCase().includes(val.toLowerCase())) {
        userForFilter.push(data[e])
      }
    }

    this.dataMes = userForFilter;

  }
 

}
