import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resumenasesor',
  templateUrl: './resumenasesor.component.html',
  styleUrls: ['./resumenasesor.component.scss']
})
export class ResumenasesorComponent implements AfterViewInit {
  waitSend = false;
  dataElement
  showContent=false
  roleId  
  state=true
  solicitudes
  dataAsesores
  dataIntra: FormGroup = this.formBuilder.group({
    Documento: ['', [Validators.required]],
  });;
  @ViewChild('drawer') sidenav: MatSidenav;
  constructor(private _snackBar: MatSnackBar,   private dataService: DataService,   private formBuilder: FormBuilder,) { 
    
  }
  evalAsesor(item){
    let dts={
      "UserId":item
     }
    this.dataService.reportePorPerfil(dts).subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) { 
        this.dataElement = response.Reporte;
        this.showContent=true;
       this.sidenav.toggle();
      } else {
        this.openSnackBar(response.Mensaje, "Cerrar");
      }
    });
  }
 
  ngAfterViewInit() { 
    this.roleId=localStorage.getItem("roleId")
    if(this.roleId=='1'){
      this.sidenav.toggle();
      this.showContent=true;
      this.state=false;
 
      let dts={
        "UserId":0
       }
      this.dataService.reportePorPerfil(dts).subscribe(response => {
 
        if (response.IdError == 0) { 
          this.dataElement = response.Reporte;
         
        } else {
          this.openSnackBar(response.Mensaje, "Cerrar");
        }
      });
    }else{
      this.showContent=false;
      this.state=true;
      
      this.dataService.ListaAsesores().subscribe(response => {
         
        if (response.IdError == 0) {  
           this.dataAsesores=response.AsesorDetalle
           this.solicitudes=response.AsesorDetalle
        } else {
          this.openSnackBar(response.Mensaje, "Cerrar");
        }
      });
    }

  }
  onSearchChange(event: any) {
    var val = event;
    var userForFilter = [];
    var data = this.solicitudes;
    for (var e in data) {
      if ((((data[e].Usuario?data[e].Usuario:"").toString()).toLowerCase().includes((val.toString()).toLowerCase()) || (data[e].Nombre?data[e].Nombre:"").toLowerCase().includes(val.toLowerCase())   )) {
        userForFilter.push(data[e])
      }
    }
    this.dataAsesores=userForFilter
     
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
