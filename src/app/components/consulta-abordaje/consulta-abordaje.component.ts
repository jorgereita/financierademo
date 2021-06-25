import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import  {MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-consulta-abordaje',
  templateUrl: './consulta-abordaje.component.html',
  styleUrls: ['./consulta-abordaje.component.css']
})

export class ConsultaAbordajeComponent {
  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private dataService: DataService, ) {
    this.waitsend=true;
    this.dataService.dataReporteList().subscribe(data => {
      this.waitsend=false;
      if (data.IdError == 0) {
          this.solicitudes = data.Lista;
          this.filterSolicitudes=data.Lista;
          this.dataSource = new MatTableDataSource(this.filterSolicitudes);
          this.dataSource.paginator = this.paginator;
      } else {

      }
    }); 
  }
  waitsend =false;
  roleId
  solicitudes
  filterSolicitudes
  displayedColumns: string[] = ['Id', 'Documento', 'NombreAsesor','NombreCompleto','Cupo','Celular', 'FechaControl','IdTipoConsulta','IdEstado'];
  dataSource  
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  recargar(){
    this.waitsend=true;
    this.dataService.dataReporteList().subscribe(data => {
      if (data.IdError == 0) {
        this.waitsend=false;
          this.solicitudes = data.Lista;
          this.filterSolicitudes=data.Lista;
          this.dataSource = new MatTableDataSource(this.filterSolicitudes);
          this.dataSource.paginator = this.paginator;
      } else {

      }
    }); 
  }
  onSearchChange(event: any) {
    var val = event;
    var userForFilter = [];
    var data = this.solicitudes;
    for (var e in data) {
      if ((((data[e].Id?data[e].Id:"").toString()).toLowerCase().includes((val.toString()).toLowerCase()) || (data[e].Documento?data[e].Documento:"").toLowerCase().includes(val.toLowerCase()) || (data[e].NombreAsesor?data[e].NombreAsesor:"").toLowerCase().includes(val.toLowerCase()) || (data[e].FechaControl?data[e].FechaControl:"").toLowerCase().includes(val.toLowerCase()) )) {
        userForFilter.push(data[e])
      }
    }

    this.filterSolicitudes = userForFilter;
    this.dataSource = new MatTableDataSource(this.filterSolicitudes);
    this.dataSource.paginator = this.paginator;
  }



  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

}
export interface dataList {
  Id: number
  IdAsesor: number
  NombreAsesor: string
  IdVendedor: number
  IdTipoDocumento:string
  Documento: string
  FechaControl:string
  IdEstado:string
  IdPantalla: string
}