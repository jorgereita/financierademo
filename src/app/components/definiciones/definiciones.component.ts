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
@Injectable()
@Component({
  selector: 'app-definiciones',
  templateUrl: './definiciones.component.html',
  styleUrls: ['./definiciones.component.css']
})
export class DefinicionesComponent implements OnInit {
  waitSend = false
  dataElement
  objEstadoCuenta
  saludo
  waitSendC=false
  roleId=localStorage.getItem("roleId"); 
  dataIntra: FormGroup = this.formBuilder.group({
    // TipoDoc: ['', [Validators.required,]],
    Documento: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],

  });;
  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private dataService: DataService, public dialogo: MatDialog, public dialog: MatDialog) {

  }

  ngOnInit() {
  }

  mostrarDialogo2(text, item,telefono): void {

    this.dialogo
      .open(ConfirmdialogComponent, {
        data: '¿ Confirma la opción ' + text + ' ? '
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.enviarSevicioOk(item,telefono);
        } else {

        }
      });
  }
  mostrarDialogoRespuesta(text): void {

    this.dialogo
      .open(ConfirmdialogComponent, {
        data: "@@" + text
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {

        } else {

        }
      });
  }
  enviarSevicioOk(dts,telefono) {
    this.waitSend = true;
    var dts1={
      "Documento": dts.Documento,
      "IdDefinicion":dts.IdDefinicion,
      "OpcionMarcada": dts.OpcionMarcada,
      "Telefono": telefono
    }
    this.dataService.setPlanesPagos(dts1).subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) {
        this.mostrarDialogoRespuesta(response.Mensaje);
        this.dataElement = null
        this.objEstadoCuenta = null
        this.dataIntra.reset();
        this.saludo = null
      } else {
        this.openSnackBar(response.Mensaje, "Cerrar");
      }
    });
  }
  onKeyCedula(event: any) {
    var num = event.target.value;
    var num = num.replace(/[^0-9]/g, "");
    if (num.length > 14) {
      var num = num.slice(0, 14);
    }
    this.dataIntra.controls['Documento'].setValue(num);
  }
  sendA(e) {
    var opMarca = ""
    if (e.OpcionesPago) {
      if (e.OpcionesPago.EstadoSelect) {
        opMarca = e.OpcionesPago.EstadoSelect;
      } else {
        this.openSnackBar("Debe seleccionar una opción para continuar.", "Cerrar");
        return
      }
    }
    else {
      opMarca = "1";
    }

    var dts = {
      "Documento": this.dataIntra.value.Documento,
      "IdDefinicion": e.IdDefinicion,
      "OpcionMarcada": opMarca
    }
    this.irPopUpTelefono(e.Definicion, dts);
    // this.mostrarDialogo2(e.Definicion,dts);
  }
  descargarReporte() {
    this.waitSendC = true;
    // var dts = parseInt(this.valueFecha);
    this.dataService.verReporteAlivios().subscribe(data => {
      var blob = new Blob([data], { type: "application/octet-stream" });
      var fileOfBlob = new File([blob], 'Reporte_plan_alivios.csv');
      var objectUrl = URL.createObjectURL(fileOfBlob);
      var fileName = "Reporte_plan_alivios.csv";
      this.saveAs(blob, fileName);
      this.waitSendC = false;
    });
  }
  saveAs(blob, fileName) {
    var url = window.URL.createObjectURL(blob);

    var anchorElem = document.createElement("a");
    // anchorElem.style = "display: none";
    anchorElem.href = url;
    anchorElem.download = fileName;

    document.body.appendChild(anchorElem);
    anchorElem.click();

    document.body.removeChild(anchorElem);

    // On Edge, revokeObjectURL should be called only after
    // a.click() has completed, atleast on EdgeHTML 15.15048
    setTimeout(function () {
      window.URL.revokeObjectURL(url);
    }, 1000);
  }
  consultarCedula() {
    var dts = {
      "Documento": this.dataIntra.value.Documento,
    }
    this.waitSend = true;

    this.dataService.getPlanesPagos(dts).subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) {
        this.saludo = response.Saludo
        this.objEstadoCuenta = []
        for (var e in response.OpcionesWeb) {
          if (response.OpcionesWeb[e].OpcionesPago) {
            response.OpcionesWeb[e].OpcionesPago.EstadoSelect = "";
          }
          if (response.OpcionesWeb[e].EstadoCuentaActual && (this.objEstadoCuenta.length == 0)) {
            this.objEstadoCuenta = response.OpcionesWeb[e].EstadoCuentaActual
          }
        }
        this.dataElement = response.OpcionesWeb
      } else {
        this.openSnackBar(response.Mensaje, "Cerrar");
      }
    });
  }
  irPopUpTelefono(data1, data2) {
    const dialogRef = this.dialog.open(popUpTelPlan, {
      width: '450px',
      height: '',
      data: { user: data1, day: data2, turnosAb: "dts" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.mostrarDialogo2(data1, data2,result);
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
  selector: 'popUpTelPlan',
  templateUrl: 'popUpTelPlan.html',
  styleUrls: ['./definiciones.component.css']
})
export class popUpTelPlan implements OnInit {
  waitSend
  isLinear = false;

  validate = false;
  screenOn = false;
  numeros = true;
  valida = true;
  foto = true;
 
  imageSrc: string = 'assets/img/default-user.png';


  constructor(
    public dialogRef: MatDialogRef<popUpTelPlan>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private dataService: DataService, public dialogo: MatDialog) {


  }
  dataIntra: FormGroup = this.formBuilder.group({

    Telefono: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],

  });;
  ngOnInit() {

  }
  sendOkDocs() {
    var num=this.dataIntra.value.Telefono;
    var res = this.getFrequency(num);
    var status = false;
    for (var e in res) {
      if (res[e] == 8) {
        status = true;
      }
    }
    if (num.length == 8) {
      if (!status) {
        this.validate=true;
        this.dialogRef.close(this.dataIntra.value.Telefono);
      }else{
        this.validate=false;
      }
    } else {
      this.validate=false;
    }

  }
  getFrequency(string) {
    var freq = {};
    for (var i = 0; i < string.length; i++) {
      var character = string.charAt(i);
      if (freq[character]) {
        freq[character]++;
      } else {
        freq[character] = 1;
      }
    }

    return freq;
  };
  onKeyCedula(event: any) {

    var format = /[ `!¡@#$%^&*()'¿_+\-=\[\]{};:"\\|,.<>\/?~AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxY ]/;
    var num = event.target.value;
    if (format.test(num)) {
      var id = num.indexOf(event.key)
      var num = num.slice(0, (id));
    }
    if (num.length == 1) {
      if ((num !== '2' && num !== '3' && num !== '8' && num !== '9')) {
        this.dataIntra.controls['Telefono'].setValue("");
        return
      }
    } else {
      if ((num[0] !== '2' && num[0] !== '3' && num[0] !== '8' && num[0] !== '9')) {
        this.dataIntra.controls['Telefono'].setValue("");
        return
      }
    }

    this.dataIntra.controls["Telefono"].setValue(num);
    var res = this.getFrequency(num);
    var status = false;
    for (var e in res) {
      if (res[e] == 8) {
        status = true;
      }
    }
    if (num.length == 8) {
      if (!status) {
        this.validate=true;
      }else{
        this.validate=false;
      }
    } else {
      this.validate=false;
    }
  }



  mostrarDialogo(): void {
    this.dialogo
      .open(ConfirmdialogComponent, {
        data: `¿ Desea cambiar el estado de la gestion ha OTP no recibido ?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {

          // this.onNoClick2();
        } else {

        }
      });
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
