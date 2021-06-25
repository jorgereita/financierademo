import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Input, ElementRef, AfterViewInit, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatStepper } from '@angular/material/stepper';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebcamImage } from 'ngx-webcam';
import { AppDateAdapter, APP_DATE_FORMATS } from './date.adapter';


@Component({
  selector: 'app-nuevo-caso',
  templateUrl: './nuevo-caso.component.html',
  styleUrls: ['./nuevo-caso.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})

export class NuevoCasoComponent implements AfterViewInit {
  private IdDepartamento: string;
  private IdCiudad: string;
  private IdColonia: any;
  screenOn: boolean;
  screenOn1: boolean;
  screenOn2: boolean;


  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private FormsModule: FormsModule,
  ) {
    this.maxDate = this.myDate.getDate() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getFullYear();
    this.dataService.departamentos().subscribe(data => {
      if (data.IdError == 0) {
        this.Departamento = data.Lista;
        this.FilterDepartamento = data.Lista;
      }
    });
    this.dataService.catalogos().subscribe(data => {
      if (data.IdError == 0) {
        for (let e in data.Lista) {
          if (data.Lista[e].TipoCatalogo == 'ActividadEconomica') {
            this.ActividadEconomica = data.Lista[e].Catalago;
          }
          if (data.Lista[e].TipoCatalogo == 'EstadoCivil') {
            this.EstadoCivil = data.Lista[e].Catalago;
          }
          if (data.Lista[e].TipoCatalogo == 'Sexo') {
            this.Sexo = data.Lista[e].Catalago;
          }
        }
      }
    });
    this.dataIntra = this.formBuilder.group({
      // TipoDoc: ['', [Validators.required,]],
      Documento: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    });
  }
  @ViewChild('stepper') private myStepper: MatStepper;
  stateSid = false;
  waitSendC = false;
  validate = true;
  validateFalse = false;
  validateTrue = false;
  imageSrc1 = 'assets/img/nombre.png';
  imageSrc2 = 'assets/img/nombre.png';
  imageSrc = 'assets/img/reconocimiento-facial.png';
  title = 'angular-gmap';
  @ViewChild('mapContainer') gmap: ElementRef;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  map: google.maps.Map;
  lat = 15.5346585;
  lng = -88.0351269;
  latitudSeleccionada;
  longitudSeleccionada;
  adrres;
  backResponse;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  marker;
  dataIntra: FormGroup = this.formBuilder.group({
    Documento: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14)]],
  });
  dataPreEval: FormGroup = this.formBuilder.group({
    ActividadEconomica: ['', [Validators.required,]],
    Ingresos: ['', [Validators.required,]],
    FechaNacimiento: ['', [Validators.required,]],
    expCrediticia: ['', [Validators.required,]],
    AniosAntiguedadLaboral: ['', [Validators.required,]],
    MesesAntiguedadLaboral: ['', [Validators.required,]],
  });
  dataSocioDe: FormGroup = this.formBuilder.group({
    PrimerNombreCliente: ['', [Validators.required,]],
    SegundoNombreCliente: ['',],
    PrimerApellidoCliente: ['', [Validators.required,]],
    SegundoApellidoCliente: ['',],
    Sexo: ['', [Validators.required,]],
    EstadoCivil: ['', [Validators.required,]],
    FechaNacimiento: ['', [Validators.required,]],
    CorreoElectronico: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')
    ])),
    NumeroCelular: ['', [Validators.required,]],
    SegundoNumeroTelefonico: ['',],
    telefonoTrabajo: ['', [Validators.required,]],
    ActividadEconomica: ['', [Validators.required,]],
    AniosAntiguedadLaboral: ['', [Validators.required,]],
    MesesAntiguedadLaboral: ['', [Validators.required,]],
    Ingresos: ['', [Validators.required,]],
    lugarTrabajo: ['', [Validators.required,]],
    puestoTrabajo: ['', [Validators.required,]],

    Departamento: ['', [Validators.required,]],
    Ciudad: ['', [Validators.required,]],
    Colonia: ['', [Validators.required,]],
    Direccion: ['', [Validators.required,]],

    Comentarios: [''],
    nombreRef1: ['', [Validators.required,]],
    apellidoRef1: ['', [Validators.required,]],
    telefonoRef1: ['', [Validators.required,]],
    nombreRef2: [''],
    apellidoRef2: [''],
    telefonoRef2: [''],
    latitud: ['', [Validators.required,]],
    longitud: ['', []],
  }); waitSend = false;
  paso1 = true;
  paso2 = false;
  pasoPre = false;
  paso3 = false;
  paso4 = false;
  alertCupo;
  cupoActual = 0;
  idTipoCliente = 0;
  img = '';
  docActual;
  maxDate;
  myDate = new Date();

  checked = false;
  estado = 'Re[chazado';
  logicList = [{ "state": true, "label": "Si" }, { "state": false, "label": "No" }]
  IdCaso = 0;
  ActividadEconomica;
  validateActPre = true;

  Departamento;
  FilterDepartamento;

  Ciudad;
  FilterCiudad;

  Colonia;
  FilterColonia;

  EstadoCivil;
  Sexo;

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  });
  public webcamImage: string = null;
  public webcamImage1: string = null;
  public webcamImage2: string = null;




  ngAfterViewInit() {

  }

  mapInitializer(loc) {
    let mapOptions: google.maps.MapOptions = {
      center: loc,
      zoom: 15
    };
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    google.maps.event.addListener(this.marker, 'dragend', (evt) => {
      this.dataSocioDe.controls['latitud'].setValue(evt.latLng.lat());
      this.dataSocioDe.controls['longitud'].setValue(evt.latLng.lng());
      this.latitudSeleccionada = evt.latLng.lat();
      this.longitudSeleccionada = evt.latLng.lng();
      let myLatlng = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'location': myLatlng }, (results, status) => {

        if (status == google.maps.GeocoderStatus.OK) {

          if (results.length > 0) {
            this.dataSocioDe.controls['Direccion'].setValue(results[0].formatted_address);
          } else {

          }
          // this.mapInitializer(this.coordinates);
        } else {
          this.openSnackBar('Geocode was not successful for the following reason: ' + status, 'Cerrar');
        }
      });
    });
    this.marker.setMap(this.map);

    //  var coordinates2 = new google.maps.LatLng( 15.4985648, -88.0215175);
    //  var marker2 = new google.maps.Marker({
    //   position: coordinates2,
    //   map: this.map,
    //   draggable: true
    // });
    // marker2.setMap(this.map);
  }

  handleImage1(webcamImage: any) {
    this.webcamImage1 = webcamImage.imageAsDataUrl;
  }

  handleImage2(webcamImage: any) {
    this.webcamImage2 = webcamImage.imageAsDataUrl;
  }

  handleImage(webcamImage: any) {
    this.webcamImage = webcamImage.imageAsDataUrl;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  openFingerprintFlow(type: string): void {
    this.img = '';

    const dialogRef = this.dialog.open(FingerprintComponent, {
      width: '75%',
      height: '80%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        type,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('RES: ', result);
        switch (type) {
          case 'placeholder':
            this.webcamImage1 = result.image;
            this.screenOn1 = true;
            break;
          case 'placeholder-inverse':
            this.webcamImage2 = result.image;
            this.screenOn2 = true;
            break;
          case 'face':
            this.webcamImage = result.image;
            this.screenOn = true;
            break;
          default:
            this.webcamImage1 = result.image;
            this.screenOn1 = true;
            break;
        }
      }
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
  toggleCamera() {
    this.webcamImage = null;
    this.screenOn = true;
  }
  resetPhoto() {
    this.webcamImage = null;
  }
  forzarFecha(picker: MatDatepicker<Date>) {
    picker.open();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FirmaDialog, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: this.img
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.img = result;
      }
    });
  }
  evalSex() {
    let x = this.Sexo.find(key => key.Id == this.dataSocioDe.value.Sexo);
    let s = '';
    if (x) {
      s = x.Descripcion;
    }
    return s;
  }
  onKeyColonia(event: any) {
    let val = event.target.value;
    let userForFilter = [];
    let data = this.Colonia;
    for (let e in data) {
      if ((data[e].Nombre.toLowerCase().startsWith(val.toLowerCase()))) {
        userForFilter.push(data[e]);
      }
    }
    this.FilterColonia = userForFilter;
  }
  onKeyCiudad(event: any) {
    let val = event.target.value;
    let userForFilter = [];
    let data = this.Ciudad;
    for (let e in data) {
      if ((data[e].Nombre.toLowerCase().startsWith(val.toLowerCase()))) {
        userForFilter.push(data[e]);
      }
    }
    this.FilterCiudad = userForFilter;
  }
  onKeyDepartamento(event: any) {
    let val = event.target.value;
    let userForFilter = [];
    let data = this.Departamento;
    for (let e in data) {
      if ((data[e].Nombre.toLowerCase().startsWith(val.toLowerCase()))) {
        userForFilter.push(data[e]);
      }
    }
    this.FilterDepartamento = userForFilter;
  }
  evalCivil() {
    let x = this.EstadoCivil.find(key => key.Id == this.dataSocioDe.value.EstadoCivil);
    let s = '';
    if (x) {
      s = x.Descripcion;
    }
    return s;
  }
  evalEco() {
    let x = this.ActividadEconomica.find(key => key.Id == this.dataSocioDe.getRawValue().ActividadEconomica);
    let s = '';
    if (x) {
      s = x.Descripcion;
    }
    return s;
  }
  evalMuni() {

  }
  getAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  cancelar(stepper) {
    this.paso1 = true;
    this.paso2 = false;
    this.pasoPre = false;
    this.paso3 = false;
    this.paso4 = false;
    this.dataSocioDe.reset();
    this.dataPreEval.reset();
    this.dataIntra.controls['Documento'].setValue("");
    setTimeout((e) => {
      this.dataSocioDe.reset();
      stepper.next();
    }, 500);
  }
  changeCiudad(event) {
    let dato = event;
    let index = this.Ciudad.findIndex(key => key.Nombre === dato);
    if (index !== -1) {
      let dts = {
        'IdCiudad': parseInt(this.Ciudad[index].Id)
      };
      this.waitSend = true;
      this.dataSocioDe.controls['Colonia'].setValue('');
      this.dataService.getColonia(dts).subscribe(response => {
        this.waitSend = false;
        this.Colonia = response.Lista;
        this.FilterColonia = response.Lista;
      });
    }
  }
  changeDepartamento(event) {
    let dato = event;
    let index = this.Departamento.findIndex(key => key.Nombre === dato);
    if (index !== -1) {
      this.dataSocioDe.controls['Departamento'].setValue(dato);
      let dts = {
        'IdDepartamento': parseInt(this.Departamento[index].Id)
      };
      this.waitSend = true;
      this.dataSocioDe.controls['Ciudad'].setValue('');
      this.dataSocioDe.controls['Colonia'].setValue('');
      this.dataService.getCiudades(dts).subscribe(response => {
        this.waitSend = false;
        this.Ciudad = response.Lista;
        this.FilterCiudad = response.Lista;
      });
    } else {
      this.openSnackBar('Departamento  ' + this.dataSocioDe.value.Departamento + ' no existe', 'Cerrar');
    }
  }
  nextFirma(stepper: MatStepper) {

    this.paso3 = true;
    let ref = [];
    ref.push({ 'NombreReferencia': this.dataSocioDe.value.nombreRef1, 'ApellidoReferencia': this.dataSocioDe.value.apellidoRef1, 'TelefonoReferencia': this.dataSocioDe.value.telefonoRef1.toString() });
    if (this.dataSocioDe.value.telefonoRef2 && this.dataSocioDe.value.nombreRef2 && this.dataSocioDe.value.apellidoRef2) {
      ref.push({ 'NombreReferencia': this.dataSocioDe.value.nombreRef2, 'ApellidoReferencia': this.dataSocioDe.value.apellidoRef2, 'TelefonoReferencia': this.dataSocioDe.value.telefonoRef2.toString() });
    } else {
      // ref.push({ "NombreReferencia": this.dataSocioDe.value.nombreRef2, "ApellidoReferencia": this.dataSocioDe.value.apellidoRef2, "TelefonoReferencia": ""  })
    }

    if (this.dataSocioDe.value.Departamento) {
      this.IdDepartamento = this.dataSocioDe.value.Departamento.toLowerCase();
      let index = this.Departamento.findIndex(key => key.Nombre.toLowerCase() === this.IdDepartamento);
      if (index !== -1) {
        this.IdDepartamento = this.Departamento[index].Id;
      } else {
        this.openSnackBar('Departamento  ' + this.dataSocioDe.value.Departamento + ' no existe', 'Cerrar');
        return;
      }
    }
    if (this.dataSocioDe.value.Ciudad) {
      this.IdCiudad = this.dataSocioDe.value.Ciudad.toLowerCase();
      let index = this.Ciudad.findIndex(key => key.Nombre.toLowerCase() === this.IdCiudad);
      if (index !== -1) {
        this.IdCiudad = this.Ciudad[index].Id;
      } else {
        this.openSnackBar('Ciudad  ' + this.dataSocioDe.value.Departamento + ' no existe', 'Cerrar');
        return;
      }
    }
    if (this.dataSocioDe.value.Colonia) {
      this.IdColonia = this.dataSocioDe.value.Colonia.toLowerCase();
      let index = this.Colonia.findIndex(key => key.Nombre.toLowerCase() === this.IdColonia);
      if (index !== -1) {
        this.IdColonia = this.Colonia[index].Id;
      } else {
        this.openSnackBar('Colonia  ' + this.dataSocioDe.value.Colonia + ' no existe', 'Cerrar');
        return;
      }
    }

    let data = {
      'IdConsulta': this.IdCaso,
      'PrimerNombre': this.dataSocioDe.value.PrimerNombreCliente,
      'SegundoNombre': this.dataSocioDe.value.SegundoNombreCliente,
      'PrimerApellido': this.dataSocioDe.value.PrimerApellidoCliente,
      'SegundoApellido': this.dataSocioDe.value.SegundoApellidoCliente,
      'IdSexo': this.dataSocioDe.value.Sexo,
      'IdEstadoCivil': this.dataSocioDe.value.EstadoCivil,
      'FechaNacimiento': this.dataSocioDe.getRawValue().FechaNacimiento,
      'Email': this.dataSocioDe.value.CorreoElectronico,
      'Celular': this.dataSocioDe.value.NumeroCelular ? this.dataSocioDe.value.NumeroCelular.toString() : '',
      'Telefono': this.dataSocioDe.value.SegundoNumeroTelefonico ? this.dataSocioDe.value.SegundoNumeroTelefonico.toString() : '',
      'IdActividadEconomica': this.dataSocioDe.getRawValue().ActividadEconomica,
      'LugarTrabajo': this.dataSocioDe.value.lugarTrabajo,
      'Cargo': this.dataSocioDe.value.puestoTrabajo,
      'TelefonoEmpresa': this.dataSocioDe.value.telefonoTrabajo,
      'AniosAntiguedadLaboral': this.dataSocioDe.getRawValue().AniosAntiguedadLaboral,
      'MesesAntiguedadLaboral': this.dataSocioDe.getRawValue().MesesAntiguedadLaboral,
      'Ingresos': this.dataSocioDe.getRawValue().Ingresos.toString().replace(/,/g, '').replace(/[^0-9]/g, ''),
      'IdDepartamento': this.IdDepartamento ? parseInt(this.IdDepartamento, 10) : '',
      'IdMunicipio': this.IdCiudad ? parseInt(this.IdCiudad, 10) : '',
      'IdColonia': this.IdColonia ? parseInt(this.IdColonia, 10) : '',
      'Direccion': this.dataSocioDe.value.Direccion,
      'Observacion': this.dataSocioDe.value.Comentarios,
      'ConsultaCentrales': this.checked,
      'Firma': this.img,
      'Latitud': this.latitudSeleccionada,
      'Longitud': this.longitudSeleccionada,
      'Referencia': ref,
      'FotoCedula': this.webcamImage1,
      'FotoCedulaReverso': this.webcamImage2,
      'FotoPerfil': this.webcamImage,
    };
    this.waitSend = true;
    this.dataService.sendEquifax(data).subscribe(response => {
      this.waitSend = false;

      if (response.IdError == 0) {
        this.paso4 = true;
        this.paso3 = false;
        this.paso2 = false;
        this.pasoPre = false;
        this.cupoActual = response.Cupo;
        this.idTipoCliente = response.IdTipoConsulta;
        this.docActual = response.Documento;
        this.estado = response.Estado;
        this.IdCaso = response.IdConsulta;
        this.webcamImage = null;
        this.webcamImage1 = null;
        this.webcamImage2 = null;
        this.img = '';
        this.checked = false;
        // this.paso4 = true;
        setTimeout((e) => {
          this.dataSocioDe.reset();
          stepper.next();
        }, 500);
      } else {
        this.openSnackBar(response.Mensaje, 'Cerrar');
      }
    });
  }
  evalDireccion(e) {

    // var data = this.Municipio.find(key => key.Id == e);
    // var dts = data.Descripcion
    // var address = dts + " Honduras";
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': this.dataSocioDe.value.Direccion }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {

        this.dataSocioDe.controls['latitud'].setValue(results[0].geometry.location.lat());
        this.dataSocioDe.controls['longitud'].setValue(results[0].geometry.location.lng());
        this.latitudSeleccionada = results[0].geometry.location.lat();
        this.longitudSeleccionada = results[0].geometry.location.lng();
        this.coordinates = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        this.marker = new google.maps.Marker({
          position: this.coordinates,
          map: this.map,
          draggable: true
        });
        this.mapInitializer(this.coordinates);
      } else {
        this.openSnackBar('Geocode was not successful for the following reason: ' + status, 'Cerrar');
      }
    });
  }
  changeMunicipio(e) {


  }
  // Dasda
  formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    let input_val = input.val();

    // don't validate empty input
    if (input_val === '') { return; }

    // original length
    let original_len = input_val.length;

    // initial caret position
    let caret_pos = input.prop('selectionStart');

    // check for decimal
    if (input_val.indexOf('.') >= 0) {

      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      let decimal_pos = input_val.indexOf('.');

      // split number by decimal point
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.formatNumber(left_side);

      // validate right side
      right_side = this.formatNumber(right_side);

      // On blur make sure 2 numbers after decimal
      if (blur === 'blur') {
        right_side += '00';
      }

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = '$' + left_side + '.' + right_side;

    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = this.formatNumber(input_val);
      input_val = '$' + input_val;

      // final formatting
      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    let updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
  }

  validateDateB() {

    if (this.dataSocioDe.getRawValue().AniosAntiguedadLaboral !== '') {
      let num = parseInt(this.dataSocioDe.getRawValue().AniosAntiguedadLaboral);
      let edad = this.getAge(this.dataSocioDe.getRawValue().FechaNacimiento);
      if (num >= edad) {
        this.dataSocioDe.controls['AniosAntiguedadLaboral'].setValue(edad);
      }
    }
  }
  onChangeActiPreScore(event) {
     
    if (event=="1" || event=="3" || event=="4") {
      this.validateActPre = false;
      this.dataPreEval.controls['AniosAntiguedadLaboral'].setValidators([]);
      this.dataPreEval.controls['MesesAntiguedadLaboral'].setValidators([]);
      this.dataPreEval.controls['AniosAntiguedadLaboral'].setValue("");
      this.dataPreEval.controls['MesesAntiguedadLaboral'].setValue("");
      // this.dataPreEval.get('MesesAntiguedadLaboral').updateValueAndValidity();
      // this.dataPreEval.get('AniosAntiguedadLaboral').updateValueAndValidity();
    } else {
      this.validateActPre = true;
      this.dataPreEval.controls['AniosAntiguedadLaboral'].setValidators([Validators.required,]);
      this.dataPreEval.controls['MesesAntiguedadLaboral'].setValidators([Validators.required,]);
      // this.dataPreEval.get('AniosAntiguedadLaboral').setValidators([Validators.required,]);
      // this.dataPreEval.get('MesesAntiguedadLaboral').setValidators([Validators.required,]);
    }


  }
  onBlurCombo() {
    if (this.dataSocioDe.value.Departamento) {
      let IdDepartamento = this.dataSocioDe.value.Departamento.toLowerCase();
      let index = this.Departamento.findIndex(key => key.Nombre.toLowerCase() === IdDepartamento);
      if (index !== -1) {
        IdDepartamento = this.Departamento[index].Id;
      } else {
        this.openSnackBar('Departamento  ' + this.dataSocioDe.value.Departamento + ' no existe', 'Cerrar');
        this.dataSocioDe.controls['Departamento'].setValue('');

      }
    }

    if (this.dataSocioDe.value.Ciudad) {
      let IdCiudad = this.dataSocioDe.value.Ciudad.toLowerCase();
      let index = this.Ciudad.findIndex(key => key.Nombre.toLowerCase() === IdCiudad);
      if (index !== -1) {
        IdCiudad = this.Ciudad[index].Id;
      } else {
        this.openSnackBar('Ciudad  ' + this.dataSocioDe.value.Ciudad + ' no existe', 'Cerrar');
        this.dataSocioDe.controls['Ciudad'].setValue('');

      }
    }
    if (this.dataSocioDe.value.Colonia) {
      let IdColonia = this.dataSocioDe.value.Colonia.toLowerCase();
      let index = this.Colonia.findIndex(key => key.Nombre.toLowerCase() === IdColonia);
      if (index !== -1) {
        IdColonia = this.Colonia[index].Id;
      } else {
        this.openSnackBar('Colonia  ' + this.dataSocioDe.value.Colonia + ' no existe', 'Cerrar');
        this.dataSocioDe.controls['Colonia'].setValue('');

      }
    }
  }
  onKeyAniosPre(event: any) {


    let num = parseInt(event.target.value);
    if (num < 0) {
      num = 0;
    }
    this.dataPreEval.controls['AniosAntiguedadLaboral'].setValue(num);

  }
  onKeyAnios(event: any) {

    let num = parseInt(event.target.value);
    if (this.dataSocioDe.value.FechaNacimiento !== '') {
      let edad = this.getAge(this.dataSocioDe.value.FechaNacimiento);
      if (edad >= num) {

      } else {
        this.dataSocioDe.controls['AniosAntiguedadLaboral'].setValue(edad);
      }

    }

  }

  onKeyCedula(event: any) {
    let num = event.target.value;
    num = num.replace(/[^0-9]/g, '');
    if (num.length > 13) {
      num = num.slice(0, 13);
    }
    this.dataIntra.controls['Documento'].setValue(num);
  }
  onKeyMesesPre(event: any) {
    let num = parseInt(event.target.value);
    if (num > 12) {
      num = 12;
    }
    this.dataPreEval.controls['MesesAntiguedadLaboral'].setValue(num);
  }
  onKeyMeses(event: any) {
    let num = parseInt(event.target.value);
    if (num > 12) {
      num = 12;
    }
    this.dataSocioDe.controls['MesesAntiguedadLaboral'].setValue(num);

  }
  onKeyTextEspDataSocio(event: any, campo) {
    let format = /[ `!¡@#$%^&*()'¿_+\-=\[\]{};:"\\|,.<>\/?~1234567890]/;
    let num = event.target.value;

    if (format.test(num)) {
      let id = num.indexOf(event.key);
      num = num.slice(0, (id));
    }
    this.dataSocioDe.controls[campo].setValue(num);
  }
  onKeyNumDataSocio(event: any, campo) {
    let format = /[ `!¡@#$%^&*()'¿_+\-=\[\]{};:"\\|,.<>\/?~AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxY ]/;
    let num = event.target.value;
    if (format.test(num)) {
      let id = num.indexOf(event.key);
      num = num.slice(0, (id));
      this.dataSocioDe.controls[campo].setValue(num);
    }
  }
  onKey(event: any) {

    let y = event.target.value.toLocaleString();
    let num = event.target.value.replace('$', '');
    num = num.replace(/,/g, '');
    num = num.replace(/[^0-9]/g, '');
    let x = this.formatter.format(num);
    x = x.replace('$', '');
    x = 'L ' + x;
    this.dataSocioDe.controls['Ingresos'].setValue(x);
  }
  finalizar(stepper: MatStepper) {

    setTimeout((e) => {
      this.paso1 = true;
      stepper.reset();
      if (this.webcamImage) {
        this.webcamImage = null;
        this.screenOn = false;
      }
      this.paso2 = false;
      this.pasoPre = false;
      this.paso3 = false;
      this.paso4 = false;
    }, 500);


  }
  next(stepper: MatStepper) {
    if (!this.dataSocioDe.valid || !this.webcamImage) {
      this.openSnackBar('Recuerde llenar todos los campos obligatorios.', 'Cerrar');
      return;
    }
    if (this.dataSocioDe.value.Departamento) {
      let IdDepartamento = this.dataSocioDe.value.Departamento.toLowerCase();
      let index = this.Departamento.findIndex(key => key.Nombre.toLowerCase() === IdDepartamento);
      if (index !== -1) {
        IdDepartamento = this.Departamento[index].Id;
      } else {
        this.openSnackBar('Departamento  ' + this.dataSocioDe.value.Departamento + ' no existe', 'Cerrar');
        return;
      }
    }

    if (this.dataSocioDe.value.Ciudad) {
      let IdCiudad = this.dataSocioDe.value.Ciudad.toLowerCase();
      let index = this.Ciudad.findIndex(key => key.Nombre.toLowerCase() === IdCiudad);
      if (index !== -1) {
        IdCiudad = this.Ciudad[index].Id;
      } else {
        this.openSnackBar('Ciudad  ' + this.dataSocioDe.value.Ciudad + ' no existe', 'Cerrar');
        return;
      }
    }
    if (this.dataSocioDe.value.Colonia) {
      let IdColonia = this.dataSocioDe.value.Colonia.toLowerCase();
      let index = this.Colonia.findIndex(key => key.Nombre.toLowerCase() === IdColonia);
      if (index !== -1) {
        IdColonia = this.Colonia[index].Id;
      } else {
        this.openSnackBar('Colonia  ' + this.dataSocioDe.value.Colonia + ' no existe', 'Cerrar');
        return;
      }
    }
    this.paso3 = true;
    // this.paso4 = true;
    setTimeout((e) => {
      stepper.next();
    }, 500);
  }
  cancelarCamera() {
    this.webcamImage = null;
    this.screenOn = false;
  }
  setPreEvalInfo(data) {
    this.dataSocioDe.controls['ActividadEconomica'].setValue(data.ActividadEconomica ? data.ActividadEconomica : data.IdActividadEconomica);
    this.dataSocioDe.controls['Ingresos'].setValue(data.Ingresos);
    this.dataSocioDe.controls['FechaNacimiento'].setValue(data.FechaNacimiento);
    this.dataSocioDe.controls['AniosAntiguedadLaboral'].setValue(data.AniosAntiguedadLaboral);
    this.dataSocioDe.controls['MesesAntiguedadLaboral'].setValue(data.MesesAntiguedadLaboral);

    this.dataSocioDe.controls["ActividadEconomica"].disable();
    this.dataSocioDe.controls["Ingresos"].disable();
    this.dataSocioDe.controls["FechaNacimiento"].disable();
    this.dataSocioDe.controls["AniosAntiguedadLaboral"].disable();
    this.dataSocioDe.controls["MesesAntiguedadLaboral"].disable();
  }
  evalPre(stepper: MatStepper) {
    this.docActual = this.backResponse.Documento;
    let data = {
      "IdConsulta": this.backResponse.IdConsulta,
      "Documento": this.backResponse.Documento,
      "FechaNacimiento": this.dataPreEval.value.FechaNacimiento,
      "Ingresos": this.dataPreEval.value.Ingresos.replace(/,/g, '').replace(/[^0-9]/g, ''),
      "IdActividadEconomica": this.dataPreEval.value.ActividadEconomica,
      "ExperienciaCrediticia": this.dataPreEval.value.expCrediticia,
      "AniosAntiguedadLaboral": this.dataPreEval.value.AniosAntiguedadLaboral,
      "MesesAntiguedadLaboral": this.dataPreEval.value.MesesAntiguedadLaboral
    };
    this.dataService.registrarPreevaluacion(data).subscribe(response => {
      if (response.IdError == 0) {
        this.estado = response.IdEstado;
        if (response.IdPantalla === "2") {
          this.pasoPre = false;
          this.paso2 = true;
          this.paso3 = false;
          this.paso4 = false;
          this.setPreEvalInfo(this.dataPreEval.value);
          // this.dataPreEval.reset();
        }
        if (response.IdPantalla === "3") {
          this.paso2 = false;
          this.pasoPre = false;
          this.paso3 = false;
          this.paso4 = true;
          this.backResponse = response;
          this.idTipoCliente = response.IdTipoConsulta;
          this.IdCaso = response.IdConsulta;
        }
        setTimeout((e) => {
          stepper.next();
        }, 100);
      } else {
        this.openSnackBar(response.Mensaje, 'Cerrar');
      }
    })
  }
  getDataPreEval() {
    let data = {
      "IdConsulta": this.backResponse.IdConsulta,
    };
    this.dataService.precargarDatosPreevaluacion(data).subscribe(response => {
      if (response.IdError == 0) {
        this.setPreEvalInfo(response);
      } else {
        this.openSnackBar(response.Mensaje, 'Cerrar');
      }
    })
  }
  evalCons(stepper: MatStepper) {

    this.docActual = this.dataIntra.value.Documento.toString();


    if (this.dataIntra.value.Documento.toString()) {
      if (this.dataIntra.value.Documento !== '' && this.dataIntra.value.Documento !== null && this.dataIntra.value.Documento !== ' ') {
        this.waitSend = true;
        let data = {
          'IdTipoDocumento': '1',
          'Documento': this.dataIntra.value.Documento,
        };
        this.dataService.consultaMegaBase(data).subscribe(response => {
          this.webcamImage = null;
          this.screenOn = false;
          this.checked = false;
          this.img = '';
          this.waitSend = false;
          if (response.IdError == 0) {
            this.backResponse = response;
            this.dataPreEval.reset();
            this.dataSocioDe.controls['MesesAntiguedadLaboral'].setValue(0);
            if (response.IdTipoConsulta) {
              this.paso1 = false;
              if (response.IdPantalla == '3') {// pantalla cupo
                this.paso2 = false;
                this.pasoPre = false;
                this.paso3 = false;
                this.paso4 = true;
                this.cupoActual = response.Cupo;
                this.idTipoCliente = response.IdTipoConsulta;
                this.docActual = response.Documento;
                this.estado = response.Estado;
                this.IdCaso = response.IdConsulta;
              }
              if (response.IdPantalla == '1.5') {// pantalla pre captura de datos
                this.estado = response.Estado;
                this.IdCaso = response.IdConsulta;
                this.pasoPre = true;
                this.paso2 = false;
                this.paso3 = false;
                this.paso4 = false;
              }
              if (response.IdPantalla == '2') {// pantalla captura de datos
                this.estado = response.Estado;
                this.IdCaso = response.IdConsulta;
                this.pasoPre = false;
                this.paso2 = true;
                this.paso3 = false;
                this.paso4 = false;
                this.getDataPreEval();
              }
            } else {
              this.openSnackBar(response.Mensaje, 'Cerrar');
            }

            setTimeout((e) => {
              stepper.next();

            }, 500);
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
  ngOnInit() {
    this.marker = new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
      draggable: true
    });
  }

}

@Component({
  selector: 'firma-dialog',
  templateUrl: 'firma-dialog.html',
  // styleUrls: ['./home.component.css']
})

export class FirmaDialog {

  constructor(
    public dialogRef: MatDialogRef<FirmaDialog>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = window.innerWidth / 1.1;
  @Input() public height = window.innerHeight / 2;
  private cx: CanvasRenderingContext2D;

  onNoClick(): void {
    this.dialogRef.close();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = window.innerWidth / 1.1;
    this.height = window.innerHeight / 2;
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = this.width;
    canvasEl.height = this.height;
  }
  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 2;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
    this.captureEvents2(canvasEl);
  }
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }
  private captureEvents2(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          e.preventDefault();
          return fromEvent(canvasEl, 'touchmove')
            .pipe(

              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)

              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            );
        })
      )
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].touches[0].clientX - rect.left,
          y: res[0].touches[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].touches[0].clientX - rect.left,
          y: res[1].touches[0].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }
  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
  limpiarCanvas() {
    this.cx.clearRect(0, 0, this.width, this.height);
    this.data = null;
  }
  guardarCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.data = canvasEl.toDataURL('image/png');
    this.dialogRef.close(this.data);
  }
}


@Component({
  selector: 'app-fingerprint',
  templateUrl: 'fingerprint.component.html',
  styleUrls: ['./nuevo-caso.component.css']
})
export class FingerprintComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<FingerprintComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  takePhoto($event: any) {
    this.dialogRef.close($event);
  }
}
