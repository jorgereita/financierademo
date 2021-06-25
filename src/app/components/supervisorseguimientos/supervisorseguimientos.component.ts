import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-supervisorseguimientos',
  templateUrl: './supervisorseguimientos.component.html',
  styleUrls: ['./supervisorseguimientos.component.scss']
})
export class SupervisorseguimientosComponent implements OnInit {

  waitSend = false;
  dataElement
  dataMes
  dataMes1
  dataHoy=[]
  dataHoy1=[]
  constructor(private _snackBar: MatSnackBar,   private dataService: DataService,  ) { }

  ngOnInit() {
    this.waitSend = true;
    this.dataService.ReporteSupervisor().subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) { 
        this.dataElement = response.Reporte;
        this.dataMes = response.Reporte.vwGestionMensuales
        this.dataMes1 = response.Reporte.vwGestionMensuales
        this.dataHoy = response.Reporte.vwGestionDiarias
        this.dataHoy1 = response.Reporte.vwGestionDiarias
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
      if (( (data[e].Name?data[e].Name:"").toLowerCase().includes(val.toLowerCase()) || (data[e].NombreAsesor?data[e].NombreAsesor:"").toLowerCase().includes(val.toLowerCase()) || (data[e].FechaControl?data[e].FechaControl:"").toLowerCase().includes(val.toLowerCase()) )) {
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
      if ( (data[e].Name?data[e].Name:"").toLowerCase().includes(val.toLowerCase())) {
        userForFilter.push(data[e])
      }
    }

    this.dataMes = userForFilter;
 
  }
  filtrarAsc(obj,field){
    this.dataMes= _.orderBy(obj, [field], ['asc']);
  }
  filtrarAsc1(obj,field){
    this.dataHoy= _.orderBy(obj, [field], ['asc']);
  }
}