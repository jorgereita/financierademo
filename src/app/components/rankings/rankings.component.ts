import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {


  waitSend = false;
  dataElement
  dataMes
  dataMes1
  dataHoy = []
  dataHoy1 = []
  getClass(type) {

    if (type >= 0 && type <= 80) {
      return 'panelRojo1';
    }
    if (type >= 81  ) {
      return 'panelVerde1';
    }
  }
  getClass2(type) {

    if (type < 0) {
      return 'panelRojo1';
    }
   
  }
  constructor(private _snackBar: MatSnackBar, private dataService: DataService,) { }

  ngOnInit() {
    this.waitSend = true;
    this.dataService.reporteRanking().subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) {
        // var dts=[]
        // for(var e=0;e<100;e++){
        //   dts.push(response.ReporteRanking.vwGestionRankings[0])
        // }
        this.dataElement = response.ReporteRanking.vwGestionRankings;
        // this.dataElement=dts
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
  // filtrarAsc(obj,field){
  //   this.dataMes= _.orderBy(obj, [field], ['asc']);
  // }
  // filtrarAsc1(obj,field){
  //   this.dataHoy= _.orderBy(obj, [field], ['asc']);
  // }

}
