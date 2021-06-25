import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css']
})
export class ConfirmdialogComponent implements OnInit {
  validaMsm=1
  mensaje2;
  constructor(
    public dialogo: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

    cerrarDialogo(): void {
      this.dialogo.close(false);
    }
    confirmado(): void {
      this.dialogo.close(true);
    }

  ngOnInit() {
    if(this.mensaje.includes("@@")){
      this.mensaje2=this.mensaje.split("@@")[1];
      this.validaMsm=2
    }
    if(this.mensaje.includes("Documentos completos")){
      this.validaMsm=3
    }
  }
}
