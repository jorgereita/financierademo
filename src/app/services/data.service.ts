import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Solicitudes } from '../models/Solicitudes';
import { environment } from '../../environments/environment';
import { DatosVendedor } from '../models/DatosVendedor';
import { ListaVendedores, respLoadImg } from '../models/ListaVendedores';
import { DatosReporte } from '../models/DatosReporte';
import { DatosPreguntas, DatosSave, dataList } from '../models/DatosPreguntas';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = environment.baseUrl;
  baseNode = environment.baseNode;
  public solicitudes
  public _asesores: BehaviorSubject<any>;
  private _solicitudes: BehaviorSubject<any>
  constructor(private httpClient: HttpClient) {
    this._asesores = <BehaviorSubject<any>>new BehaviorSubject('');
    this._solicitudes = <BehaviorSubject<any>> new BehaviorSubject(this.solicitudes);
  }
  public getValue() {
    return this._asesores.asObservable();

  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() - minutes * 60000);
  }

  list() {

    return this.httpClient.get<ListaVendedores>(this.baseUrl + '/api/values/list'
    );
  }
  
  getSolicitudes() {
    return this._solicitudes.asObservable();
  }

  load() {

    this.httpClient.get<any>(this.baseUrl + "/api/GenerarReporte/ListaAsesor"
       
    ).subscribe(data => {
      this.solicitudes = data;
      this._solicitudes.next(Object.assign({}, this.solicitudes));
    });
 
 
  }
  addItemService(data){
    if (this.solicitudes) {
      this.solicitudes.AsesorDetalle.unshift(data);

      this.solicitudes.AsesorDetalle.forEach(element => {

        var fecha = new Date(element.fechaControl);

        if (fecha < this.addMinutes(new Date(), 30)) {
          this.solicitudes.AsesorDetalle.splice(this.solicitudes.AsesorDetalle.indexOf(element), 1);
        }
      });

      this._solicitudes.next(Object.assign({}, this.solicitudes));
    }
  }
  all() {// trae todos los datos del vendedor
    return this.httpClient.get<DatosVendedor>(this.baseUrl + '/api/values/all'
    );
  }
  relaseItem(data) {// libera la solicitud para la tienda en tiempo real
    return this.httpClient.post<any>(this.baseNode + '/realtimecashier', data);
  }
  saveReport(data) {// guardar el proceso o queja
    return this.httpClient.post<number>(this.baseUrl + '/api/values/save-report', data);
  }
  report() {// consulta todas las quejas solo para rol 3
    return this.httpClient.get<ListaVendedores>(this.baseUrl + '/api/values/reports'
    );
  }
  updatereport(data) {// actualiza la gestion de la queja
    return this.httpClient.post<number>(this.baseUrl + '/api/values/update-report', data);
  }
  advisor(id) {//

    return this.httpClient.get<DatosVendedor>(this.baseUrl + '/api/values/advisor/' + id
    );
  }
  test(data) {// evalua intentos y estado del curso antes de seguir
    return this.httpClient.post<DatosPreguntas>(this.baseUrl + '/api/values/test', data);
  }
  saveTest(data) {// envia las preguntas para ser evaluadas
    return this.httpClient.post<DatosSave>(this.baseUrl + '/api/values/save-test', data);
  }
  roleTests() {// trae los cursos por rol
    return this.httpClient.get<object>(this.baseUrl + '/api/values/role-tests');
  }
  shifts() {// consulta data para malla siguiente semana
    return this.httpClient.get<any>(this.baseUrl + '/api/values/shifts');
  }
  pdf(e) {// pdf de certificado de los cursos
    return this.httpClient.get<string>(this.baseUrl + '/api/values/pdf/' + e);
  }
  offices() {// trae las sucursales
    return this.httpClient.get<object>(this.baseUrl + '/api/values/offices');
  }
  intradia(data) {// envia la data para los intradias
    return this.httpClient.post<number>(this.baseUrl + '/api/values/intradia', data);
  }
  enrolarUsr(data) {// envia registro para enrolar foto de usr
    return this.httpClient.post<respLoadImg>(this.baseUrl + '/api/epikface/agregar', data);
  }
  reportTest() {// trae un CSV de los cursos realizados de manera general
    return this.httpClient.get<any>(this.baseUrl + '/api/values/report-test', { 'responseType': 'arraybuffer' as 'json' });
  }
  identificarRostro(data) {// envia  el rostro para validar en la pantalla facematch
    return this.httpClient.post<respLoadImg>(this.baseUrl + '/api/epikface/identificar', data);
  }
  saveShift(data) {// guardar las mallas para la siguiente semana
    return this.httpClient.post<number>(this.baseUrl + '/api/values/save-shift', data);
  }
  lastShifts() {// consulta la data de la malla actual
    return this.httpClient.get<any>(this.baseUrl + '/api/values/last-shifts');
  }
  saveNovedad(data) {// guarda la novedad sobre la malla actual
    return this.httpClient.post<number>(this.baseUrl + '/api/values/novedades', data);
  }
  tramites(data) {// envia la data para la pantalla tramites EURO
    return this.httpClient.post<number>(this.baseUrl + '/api/values/tramites', data);
  }
  validaRol() {// trae el rol del usuario
    return this.httpClient.get<number>(this.baseUrl + '/api/values/validate-role');
  }
  requerimientoIt(data) {// envia el requerimiento
    return this.httpClient.post<number>(this.baseUrl + '/api/values/requerimiento-it', data);
  }
  listaRequerimientos() {// trae la data de requerimientos
    return this.httpClient.get<any>(this.baseUrl + '/api/values/lista-requerimientos');
  }
  actualizaRequerimiento(data) {// envia el requerimiento
    return this.httpClient.post<number>(this.baseUrl + '/api/values/actualizar-requerimiento', data);
  }
  descargarArchivoReq(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/values/archivo-requerimiento', data);
  }
  pregunasFeedback() {
    return this.httpClient.get<any>(this.baseUrl + '/api/values/lista-feedback-pregunta');
  }
  sendFeedBack(data) {
    return this.httpClient.post<number>(this.baseUrl + '/api/values/feedback-respuesta', data);
  }
  listaFeedCoor() {
    return this.httpClient.get<any>(this.baseUrl + '/api/values/lista-feedback-coordinador');
  }
  consultaMegaBase(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/cli/registrar', data);
  }
  setChecks(data){
    return this.httpClient.post<any>(this.baseUrl + '/api/cli/autorizar-datos', data);
  }
  setProfilePhoto(data){
    return this.httpClient.post<any>(this.baseUrl + '/api/cli/guardar-foto-perfil', data);
  }
  setIDPhoto(data){
    return this.httpClient.post<any>(this.baseUrl + '/api/cli/guardar-foto-documento', data);
  }
  registrarPreevaluacion(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/concli/registrar-preevaluacion', data);
  }
  
  precargarDatosPreevaluacion(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/concli/precargar-datos-preevaluacion', data);
  }
  catalogos() {
    return this.httpClient.get<any>(this.baseUrl + '/api/catalogo/lista');
  }
  sendEquifax(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/concli/registrar-datos', data);
  }
  requestApiGoogle(data) {
    return this.httpClient.get<any>( 'https://maps.googleapis.com/maps/api/geocode/json?address=' + data + '&fields=geometry&key=AIzaSyAaUzBM2A2NHGX3D7Bq2L1wN-gKJrpP7jU' );
  }
  buscarCliente(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/cli-unico/buscar', data);
  }
  verPdfRepo(data) {
    return this.httpClient.get<any>(this.baseUrl + '/api/cli-unico/pdf/' + data);
  }
  verPdfConstancia(data) {
    return this.httpClient.get<any>(this.baseUrl + '/api/cli-unico/generar-constancia/' + data);
  }
  verReporteGeneral() {
    return this.httpClient.get<any>(this.baseUrl + '/api/cli-unico/log-constancias', { 'responseType': 'arraybuffer' as 'json' });
  }
  verReporteAlivios() {
    return this.httpClient.get<any>(this.baseUrl + '/api/ConsultaPlan/ReportePlanAlivio', { 'responseType': 'arraybuffer' as 'json' });
  }
  dataReporteList() {
    return this.httpClient.get<dataList>(this.baseUrl + '/api/concli/lista-consulta');
  }
  departamentos() {
    return this.httpClient.get<dataList>(this.baseUrl + '/api/departamento/lista');
  }
  getCiudades(data) {
    return this.httpClient.post<dataList>(this.baseUrl + '/api/ciudad/lista', data);
  }
  getColonia(data) {
    return this.httpClient.post<dataList>(this.baseUrl + '/api/colonia/lista', data);
  }
  getPlanesPagos(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/ConsultaPlan/PlanAlivioWeb', data);
  }
  setPlanesPagos(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/ConsultaPlan/RtaPlanAlivioWeb', data);
  }
  activarCedula(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/ConsultaPlan/DesbloquearCliente', data);
  }
  aumentoCupo(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/aumento-cupo/buscar', data);
  }
  reportePorPerfil(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/GenerarReporte/ReporteAsesor', data);
  }
  reporteRanking() {
    return this.httpClient.get<any>(this.baseUrl + '/api/GenerarReporte/ReporteRanking');
  }
  reporteJefeVentas() {
    return this.httpClient.get<any>(this.baseUrl + '/api/GenerarReporte/ReporteJefeVenta');
  }
  ReporteSupervisor() {
    return this.httpClient.get<any>(this.baseUrl + '/api/GenerarReporte/ReporteSupervisor');
  }
  ListaAsesores() {
    return this.httpClient.get<any>(this.baseUrl + '/api/GenerarReporte/ListaAsesor');
  }
  uploadFile(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/cli-unico/carga-archivo', data);
  }
  getQuote(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/sim/cotizar', data);
  }
  getEmulation(data) {
    return this.httpClient.post<any>(this.baseUrl + '/api/sim/simular', data);
  }
}

