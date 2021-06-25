import { OnInit, Inject } from '@angular/core';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/services/data.service';
import { ListaVendedores } from 'src/app/models/ListaVendedores';
import { Router } from '@angular/router';
import { FormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DndDropEvent } from 'ngx-drag-drop';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { NuevoCasoComponent } from '../nuevo-caso/nuevo-caso.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {
  demo1TabIndex = 0;
  waitSend = false;
  screenOn1: boolean;
  screenOn2: boolean;
  screenOn3: boolean;
  public webcamImage1: string = null;
  public webcamImage2: string = null;
  public webcamImage3: string = null;
  imageSrc1 = 'assets/img/reconocimiento-facial.png';
  imageSrc2 = 'assets/img/nombre.png';
  imageSrc3 = 'assets/img/nombre.png';
  ngAfterViewInit() {

  }

  responseForm1
  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private FormsModule: FormsModule,
  ) {


  }
  dataIntra: FormGroup = this.formBuilder.group({
    Documento: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
  });
  ngOnInit() {

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  toggleCamera1() {
    this.webcamImage1 = null;
    this.screenOn1 = true;
  }
  toggleCamera2() {
    this.webcamImage2 = null;
    this.screenOn2 = true;
  }
  toggleCamera3() {
    this.webcamImage3 = null;
    this.screenOn3 = true;
  }
  handleImage1(webcamImage: any) {
    this.webcamImage1 = webcamImage.imageAsDataUrl;
  }
  handleImage2(webcamImage: any) {
    this.webcamImage2 = webcamImage.imageAsDataUrl;
  }
  handleImage3(webcamImage: any) {
    this.webcamImage3 = webcamImage.imageAsDataUrl;
  }
  cancelarCamera1() {
    this.webcamImage1 = null;
    this.screenOn1 = false;
  }
  cancelarCamera2() {
    this.webcamImage2 = null;
    this.screenOn2 = false;
  }
  cancelarCamera3() {
    this.webcamImage3 = null;
    this.screenOn3 = false;
  }
  setArovalService(idConsulta) {
    let data = {

      "IdConsulta": idConsulta,
      "AceptaTratamientoDatos": true,
      "AceptaConsultaCentrales": true
    }
    this.dataService.setChecks(data).subscribe(response => {

      this.waitSend = false;
      if (response.IdError == 0) {
        this.demo1TabIndex = this.demo1TabIndex + 1;
      }
      this.openSnackBar(response.Mensaje, 'Cerrar');
    });
  }
  evalCons() {

    // this.docActual = this.dataIntra.value.Documento.toString();


    if (this.dataIntra.value.Documento.toString()) {
      if (this.dataIntra.value.Documento !== '' && this.dataIntra.value.Documento !== null && this.dataIntra.value.Documento !== ' ') {
        this.waitSend = true;
        let data = {
          'IdTipoIdentificacion': '1',
          'NumeroIdentificacion': this.dataIntra.value.Documento,
        };
        this.dataService.consultaMegaBase(data).subscribe(response => {
          if (response.IdError == 0) {

            this.responseForm1 = response;
            if (response.IdPantalla == '3') { //nuevo
              setTimeout(() => {
                this.setArovalService(response.IdConsulta);
              }, 500);
            }
            if (response.IdPantalla == '4') { //foto
              this.waitSend = false;
              this.demo1TabIndex = this.demo1TabIndex + 1;
            }
            if (response.IdPantalla == '5') { //cc
              this.waitSend = false;
              this.demo1TabIndex = this.demo1TabIndex + 1;
              this.demo1TabIndex = this.demo1TabIndex + 1;
            }
          } else {
            this.openSnackBar(response.Mensaje, 'Cerrar');
          }
        });
      } else {
        this.openSnackBar('Por favor revise el documento antes de continuar ', 'Cerrar');
      }

    } else {
      this.openSnackBar('Por favor revise el documento antes de continuar ', 'Cerrar');
    }

  }

  sendFacePhoto() {
    let data = {

      "IdConsulta": this.responseForm1.IdConsulta,
      "FotoPerfil": this.webcamImage1
    }

    this.waitSend = true;
    this.dataService.setProfilePhoto(data).subscribe(response => {

      this.waitSend = false;
      if (response.IdError == 0) {
        // this.responseForm1 = response;
        this.demo1TabIndex = this.demo1TabIndex + 1;
      }
      this.openSnackBar(response.Mensaje, 'Cerrar');
    });
  }
  sendIDPhoto() {
    let data = {
      "IdConsulta": this.responseForm1.IdConsulta,
      "FotoDocAdverso": this.webcamImage3,
      "FotoDocReverso": this.webcamImage2
    }
    this.waitSend = true;
    this.dataService.setIDPhoto(data).subscribe(response => {

      this.waitSend = false;
      if (response.IdError == 0) {
        // this.responseForm1 = response;
        // this.demo1TabIndex = this.demo1TabIndex + 1;
        this.openSnackBar("OK !!!!!!!!!!!", 'Cerrar');
      }
      this.openSnackBar(response.Mensaje, 'Cerrar');
    });
  }


}
