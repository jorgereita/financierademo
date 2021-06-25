import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  waitSend = false;
  searchForm: FormGroup;
  simulateForm: FormGroup;
  searchResults: any;
  simulationResults: any;
  dataTable: any;
  displayedColumns: Array<string> = ['term', 'financingQuote', 'newQuote'];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
  ) {
    this.searchForm = this.formBuilder.group({
      Documento: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14)]],
    });

    this.simulateForm = this.formBuilder.group({
      ValorSimular: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }
  onKeyDoc(event: any) {
    let num = event.target.value;
    num = num.replace(/[^0-9]/g, '');
    if (num.length > 13) {
      num = num.slice(0, 13);
    }
    this.searchForm.controls['Documento'].setValue(num);
  }
  search() {
    this.waitSend = true;

    const formData = {
      IdTipoDocumento: 1,
      ...this.searchForm.value,
    };

    this.dataService.getQuote(formData).subscribe(response => {
      this.waitSend = false;

      if (response.Respuesta.IdError === 0) {
        this.searchResults = response;
      } else {
        this.searchResults = response;
        this.openSnackBar(response.Respuesta.Mensaje, 'Cerrar');
      }
    });
  }

  simulate() {
    this.waitSend = true;

    const formData = {
      IdTipoDocumento: 1,
      ...this.searchForm.value,
      ...this.simulateForm.value,
    };

    this.dataService.getEmulation(formData).subscribe(response => {
      this.waitSend = false;

      if (response.Respuesta.IdError === 0) {
        this.simulationResults = response.RespuestaSimulaciones;
        this.dataTable = this.simulationResults;
      } else {
        this.openSnackBar(response.Respuesta.Mensaje, 'Cerrar');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  reset() {
    this.searchResults = null;
    this.simulationResults = null;
    this.dataTable = null;
    this.searchForm.reset();
    this.simulateForm.reset();
  }
}
