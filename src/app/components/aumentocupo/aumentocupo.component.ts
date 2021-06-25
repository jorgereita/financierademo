import { Component, OnInit, ViewChild, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
export interface DialogData {
  user: any;
  day: any;
  turnosAb: any;
}
@Component({
  selector: 'app-aumentocupo',
  templateUrl: './aumentocupo.component.html',
  styleUrls: ['./aumentocupo.component.css']
})
export class AumentocupoComponent implements OnInit {
  dataIntra: FormGroup = this.formBuilder.group({
    Documento: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],
    Ingresos: ['', [Validators.required,]],
    CupoSolicitado: ['', [Validators.required,]],
  });
  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })
  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private dataService: DataService, public dialogo: MatDialog, public dialog: MatDialog) { }
  waitSend = false
  dataElement

  ngOnInit() {
  }
  onKeyNumDataSocio(event: any, campo) {
    var format = /[ `!¡@#$%^&*()'¿_+\-=\[\]{};:"\\|,.<>\/?~AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYzZz ]/;
    var num = event.target.value;
    if (format.test(num)) {
      var id = num.indexOf(event.key)
      var num = num.slice(0, (id));
      this.dataIntra.controls[campo].setValue(num);
    }
  }
  onKey(event: any, campo) {
    var num = event.target.value.replace("L", "");
    var num = num.replace(/,/g, "");
    var num = num.replace(/[^0-9]/g, "");
    var x = this.formatter.format(num);
    x = x.replace("$", "L");
    x = x.replace("L", "");
    x = "L " + x;
    this.dataIntra.controls[campo].setValue(x);
  }
  irPopUpInfo(data1) {
    const dialogRef = this.dialog.open(popUpInfo, {
      width: '450px',
      height: '',
      data: { user: data1, day: " ", turnosAb: "dts" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {

      }
    });
  }
  consultarCedula() {
    var dts =
    {
      "Identificacion": this.dataIntra.value.Documento,
      "Ingresos": this.dataIntra.value.Ingresos.replace("L ", "").replace(/,/g, ""),
      "CupoSolicitado": this.dataIntra.value.CupoSolicitado.replace("L ", "").replace(/,/g, ""),
    }
//     this.irPopUpInfo({
//       "Id": 149,
//       "IdConsulta": 149,
//       "Estado": 0,
//       "MotivoRechazo": null,
//       "CupoAprobado": 25000.0000,
//       "FechaControl": "2020-01-10T18:31:10.2",
//       "CupoActual": 20000.0000
//   }
// );
    this.waitSend = true;
    this.dataService.aumentoCupo(dts).subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) {
        this.dataElement = response.TBL_ResultadoAumentoCupo;
        this.irPopUpInfo(this.dataElement)
      } else {
        this.openSnackBar(response.Mensaje, "Cerrar");
      }
    });
  }
  mostrarDialogo2(): void {

    this.dialogo
      .open(ConfirmdialogComponent, {
        data: 'asdasdasd '
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          // this.enviarSevicioOk(item,telefono);
        } else {

        }
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}

@Component({
  selector: 'popUpInfo',
  templateUrl: 'popUpInfo.html',
  styleUrls: ['./aumentocupo.component.css']
})
export class popUpInfo implements OnInit {
  waitSend
  isLinear = false;

  validate = false;
  screenOn = false;
  numeros = true;
  valida = true;
  foto = true;
 
  imageSrc: string = 'assets/img/default-user.png';

  constructor(
    public dialogRef: MatDialogRef<popUpInfo>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private dataService: DataService, public dialogo: MatDialog) {
  }

  ngOnInit() {

  }
  onNoClick2(): void {
    this.dialogRef.close(undefined);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}