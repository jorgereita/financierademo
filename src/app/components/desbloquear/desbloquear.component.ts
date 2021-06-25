import { Component, OnInit, ViewChild, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-desbloquear',
  templateUrl: './desbloquear.component.html',
  styleUrls: ['./desbloquear.component.css']
})
export class DesbloquearComponent implements OnInit {
  waitSend = false;
  dataIntra: FormGroup = this.formBuilder.group({
    // TipoDoc: ['', [Validators.required,]],
    Documento: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],

  });;
  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private dataService: DataService, public dialogo: MatDialog, public dialog: MatDialog) {

  }
  mostrarDialogoRespuesta(text): void {

    this.dialogo
      .open(ConfirmdialogComponent, {
        data: text
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {

        } else {

        }
      });
  }
  activarDocumento() {
    this.waitSend = true;
    var dts1={
      "Documento":this.dataIntra.value.Documento,
    }
    this.dataService.activarCedula(dts1).subscribe(response => {
      this.waitSend = false;
      if (response.IdError == 0) {
        this.mostrarDialogoRespuesta(response.Mensaje);
        this.dataIntra.reset();
      } else {
        this.mostrarDialogoRespuesta(response.Mensaje);
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
  ngOnInit() {
  }

}
