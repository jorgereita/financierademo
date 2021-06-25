import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-visordiunsa',
  templateUrl: './visordiunsa.component.html',
  styleUrls: ['./visordiunsa.component.css']
})
export class VisordiunsaComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private dataService: DataService,
    public dialog: MatDialog,
  ) {
    this.dataService.catalogos().subscribe(data => {
      if (data.IdError == 0) {
        for (const e in data.Lista) {
          if (data.Lista[e].TipoCatalogo == 'TipoConstancia') {

            for (const m in data.Lista[e].Catalago) {

              this.constanciaTipo.push({ 'Id': data.Lista[e].Catalago[m].Id, 'Descripcion': data.Lista[e].Catalago[m].Descripcion, 'Show': true });
            }

            // this.constanciaTipo = data.Lista[e].Catalago
          }
          if (data.Lista[e].TipoCatalogo == 'CiudadConstancia') {
            for (const m in data.Lista[e].Catalago) {

              this.ciudad.push({ 'Id': data.Lista[e].Catalago[m].Descripcion, 'Descripcion': data.Lista[e].Catalago[m].Descripcion });
            }
          }

        }
      }
    });
  }

  dataUsuario = null;
  fechasRow = 4;
  showBtsTable = false;
  waitSend = false;
  docActual;
  waitSendRep = false;
  waitSendCont = false;
  waitSendCsv = false;
  roleId = localStorage.getItem('roleId');
  ciudad = [

  ];
  constanciaTipo = [
  ];
  dataIntra: FormGroup = this.formBuilder.group({
    Documento: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
  });
  dataSocioDe: FormGroup = this.formBuilder.group({
    tipoConstancia: ['', [Validators.required, ]],
    institucion: ['', [ ]],
    ciudad: ['', [Validators.required, ]],
  });  ngOnInit() {
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }


  download(filename, text) {
    window.open(text, '_blank');
  }
  verPdfRepo() {

  }
  onKeyCedula(event: any) {
    let num = event.target.value;
    num = num.replace(/[^0-9]/g, '');
    if (num.length > 13) {
      num = num.slice(0, 13);
    }
    this.dataIntra.controls['Documento'].setValue(num);
  }
  descargarReportePdf() {

    this.waitSendRep = true;
    this.dataService.verPdfRepo(this.docActual).subscribe(response => {

      this.waitSendRep = false;
      if (response.length > 0) {

        const element = document.createElement('a');
        element.setAttribute('href', ' data:application/pdf;base64,' + response);
        element.setAttribute('download', 'Reporte' + '_' + this.docActual + '.pdf');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {

        this.openSnackBar('Se ha generado un error.', 'Cerrar');
      }
    });
  }
  descargarConsta() {
    if (this.dataSocioDe.valid) {
      this.waitSendCont = true;
      const dts = this.docActual + '/' + this.dataSocioDe.value.tipoConstancia.toString() + '/' + this.dataSocioDe.value.institucion.toString() + '/' + this.dataSocioDe.value.ciudad.toString();
      this.dataService.verPdfConstancia(dts).subscribe(response => {
        this.waitSendCont = false;
        if (response.length > 0) {
          const element = document.createElement('a');
          element.setAttribute('href', ' data:application/pdf;base64,' + response);
          element.setAttribute('download', 'Constancia' + '_' + this.docActual + '.pdf');
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        } else {
          this.openSnackBar('Sin datos de usuario.', 'Cerrar');
        }
      });
    } else {
      this.openSnackBar('Recuerde llenar todo los campos para su solicitud.', 'Cerrar');
    }

  }
  enviarBuscar() {
    this.dataUsuario = null;
    this.docActual = this.docActual || this.dataIntra.value.Documento.toString();
    this.waitSend = true;
    const data = {
      'Identificacion': this.docActual || this.dataIntra.value.Documento.toString(),
    };
    this.dataService.buscarCliente(data).subscribe(response => {
      this.waitSend = false;
      this.showBtsTable = true;
      if (response.IdError == 0) {
        this.dataIntra.reset();
        this.dataUsuario = response.Cliente[0];
        const sal = parseInt(this.dataUsuario.ValorDeuda);
        if (sal < 0) {
          for (const e in this.constanciaTipo) {
            if (this.constanciaTipo[e].Id == 2) {
              this.constanciaTipo[e].Show = false;
            }
          }
        }
      } else {
        this.showBtsTable = false;
        this.dataUsuario = null;
        this.openSnackBar(response.Mensaje, 'Cerrar');
      }
    });
  }
  descargarReporte() {
    this.waitSendCsv = true;
    // var dts = parseInt(this.valueFecha);
    this.dataService.verReporteGeneral().subscribe(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const fileOfBlob = new File([blob], 'LogConstancias.csv');
      const objectUrl = URL.createObjectURL(fileOfBlob);
      const fileName = 'LogConstancias.csv';
      this.saveAs(blob, fileName);
      this.waitSendCsv = false;
    });
  }
  saveAs(blob, fileName) {
    const url = window.URL.createObjectURL(blob);

    const anchorElem = document.createElement('a');
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

  openUploaderModal() {
    const dialogRef = this.dialog.open(UploadComponentComponent, {
      width: '50%',
      minHeight: '30%',
      height : 'auto',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formData = {
          ...result,
          NumeroIdentificacion: this.docActual,
          Pdf: result.Pdf.replace('data:application/pdf;base64,', ''),
        };

        this.dataService.uploadFile(formData).subscribe(data => {
          if (data.IdError == 0) {
            this.enviarBuscar();
            this.openSnackBar('El archivo se subió correctamente', 'Cerrar');
          } else {
            this.openSnackBar(data.Mensaje, 'Cerrar');
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-upload-file',
  templateUrl: 'upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadComponentComponent {

  showConfirm = false;
  selectedOption = '';
  errorSize: boolean;
  file: File;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<UploadComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {

  }

  responseCancel() {
    this.dialogRef.close();
  }

  onFileChanged(target: HTMLInputElement): void {
    console.log(target.files[0]);
    if (target.files && target.files[0]) {
      this.errorSize = target.files[0].size > 1000000;

      if (!this.errorSize) {
        this.file = target.files[0];
      }
    }
  }

  removeFile() {
    this.file = null;
    this.fileInput.nativeElement.value = '';
  }

  async uploadFile() {
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    const Pdf = await toBase64(this.file);

    this.dialogRef.close({
      TipoArchivo: this.selectedOption,
      Pdf,
    });
  }
}
