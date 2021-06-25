import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { MatTabGroup } from '@angular/material/tabs';
declare var io: any;

export interface DialogData {
  data: any;
}
@Component({
  selector: 'app-feedrequests',
  templateUrl: './feedrequests.component.html',
  styleUrls: ['./feedrequests.component.css']
})
export class FeedrequestsComponent implements OnInit, OnDestroy {
  baseNode = environment.baseNode;
  feeditems: Array<object>;
  observable
  socket;
  myRequest: Array<object> = [];
  takedSol;
  itemToRelase
  index2Relase
  @ViewChild("tabsFeed", { static: false }) tabsFeed: MatTabGroup;
  @Output() formResult = new EventEmitter<object>();
  constructor(
    private dataService: DataService,
    public dialogo: MatDialog,
    public dialogReasons: MatDialog,

    private _snackBar: MatSnackBar) {


    this.dataService.getSolicitudes().subscribe(response => {

      this.feeditems = response?.AsesorDetalle;

    });
  }
  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  ngOnInit(): void {
    this.dataService.load();
    this.soketHandshake();
  }

  soketHandshake() {
    this.socket = io.connect(this.baseNode + '/', { transports: ['websocket'] });
    this.socket.on('connect', () => {
      this.socket.emit('request', JSON.stringify({ office: localStorage.getItem("tienda") ? localStorage.getItem("tienda") : '0001', identificacion: "000" }));
    });
    this.socket.on('response', data => {
      var datos = { ...data };
      datos.animation = 1;
      setTimeout(() => {
        datos.animation = 0;
      }, 4000);
      this.dataService.addItemService(datos);
    });
  }

  evalStateSimbol(item) {
    switch (item) {
      case 1:
        return "check"
      case 2:
        return "warning"
      case 3:
        return "error"
      default:
        return "check"
    }
  }
  checkStateItem(item) {
    switch (item.UserId) {
      case 1:
        return "Disponible"
      case 2:
        return "Tomada"
      case 3:
        return "Cliente rechaza"
      default:
        return "Disponible"
    }

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  takeSol(item) {
    this.dialogConfirm("¿ Confirma que desea tomar esta solicitud ?", 1);
    this.takedSol = item;
    // this.formResult.emit(item);
  }
  resumeSol(item) {
    this.formResult.emit(item);
  }
  relase(item, index) {
    item.UserId = 1;
    this.index2Relase = index
    this.itemToRelase = item;
    this.dialogConfirm("¿ Confirma que desea liberar esta solicitud ?", 2);
  }
  public goTake() {
    const tabGroup = this.tabsFeed;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;
    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
  }
  dialogConfirm(text, confimType): void {
    this.dialogo
      .open(ConfirmdialogComponent, {
        data: text
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          if (confimType === 1) this.confirmedTake();
          if (confimType === 2) this.confirmedRelase();
        }
      });
  }
  confirmedRelase() {
    this.itemToRelase.office = "1";
    this.dataService.relaseItem(this.itemToRelase).subscribe(response => {
      if (response.error === 0) {
        this.myRequest.splice(this.index2Relase, 1);
        this.openSnackBar("Has liberado la solicitud ", 'Cerrar');
      } else {
        this.openSnackBar("Error en liberar solicitud ", 'Cerrar');
      }
    });
  }
  confirmedTake() {
    this.takedSol.UserId = 2;
    this.myRequest.push(this.takedSol);
    this.goTake();
    this.openSnackBar("Has tomado la solicitud en caja " + this.takedSol.UserId, 'Cerrar');
  }

  irPopUpInfo(data1, index) {
    this.index2Relase = index;
    const dialogRef = this.dialogReasons.open(popUpReason, {
      width: '450px',
      height: '',
      data: { data: data1 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.myRequest.splice(this.index2Relase, 1);
      }
    });
  }
}



@Component({
  selector: 'popUpReason',
  templateUrl: 'popUpReason.html',
  styleUrls: ['./feedrequests.component.css']
})
export class popUpReason implements OnInit {
  waitSend
  reasonsList = [{ "id": 2, "label": "No le interesa." }, { "id": 2, "label": "No tiene tiempo." }, { "id": 3, "label": "Otra." }]

  // imageSrc: string = 'assets/img/default-user.png';
  dataReasons: FormGroup = this.formBuilder.group({
    reason: ['', [Validators.required,]],
  });
  constructor(
    public dialogRef: MatDialogRef<popUpReason>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _snackBar: MatSnackBar, public dialogo: MatDialog) {
  }

  ngOnInit() {

  }
  close(): void {
    this.dialogRef.close(undefined);
  }
  sendReason(): void {
    // alert("ok")
    this.dialogRef.close(undefined);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}