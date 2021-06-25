import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { AccountComponent } from './components/account/account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { FaceGuard } from './guards/face.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { InterceptService } from './services/intercept.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMaskModule, IConfig } from 'ngx-mask';
 
import {NuevoCasoComponent, FirmaDialog, FingerprintComponent} from './components/nuevo-caso/nuevo-caso.component';
 
import { CameraComponent } from './components/camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import { VisordiunsaComponent, UploadComponentComponent } from './components/visordiunsa/visordiunsa.component';
import { ConsultaAbordajeComponent } from './components/consulta-abordaje/consulta-abordaje.component';
import { DefinicionesComponent, popUpTelPlan } from './components/definiciones/definiciones.component';
import { ConfirmdialogComponent } from './components/confirmdialog/confirmdialog.component';
import { DesbloquearComponent } from './components/desbloquear/desbloquear.component';
import { AumentocupoComponent, popUpInfo } from './components/aumentocupo/aumentocupo.component';
import { ResumenasesorComponent } from './components/resumenasesor/resumenasesor.component';
import { SupervisorseguimientosComponent } from './components/supervisorseguimientos/supervisorseguimientos.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { ReporteriaComponent } from './components/reporteria/reporteria.component';
import { ReporteJefeventasComponent } from './components/reporte-jefeventas/reporte-jefeventas.component';
import { QuoteComponent } from './components/quote/quote.component';
import {CommonModule} from '@angular/common';
import {FaceDetectorModule} from 'ml-face-detector';
import {DniDetectorModule} from 'dni-detector';
import { FeedrequestsComponent,popUpReason } from './components/feedrequests/feedrequests.component';
import { SocketIoModule } from 'ngx-socket-io';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

const routes: Routes = [
  { path: 'auth', component: AuthComponent,   },
  { path: 'home', component: HomeComponent,   },
  // { path: "facematch", component: FacematchComponent, canActivate: [FaceGuard] },
  // { path: "home2/:id", component: Home2Component, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'home' }
];



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ToolbarComponent,
    AccountComponent,
    // Home2Component,
    // CoursesComponent,
    // GestionprocesoComponent,
    // MallasComponent,
    // IntradiasComponent,
    // EnrolarComponent,
    CameraComponent,
    // FacematchComponent,
    // ListaAsesoresComponent,
    // DialogOverviewExampleDialog,
    // DialogOverviewExampleDialog2,
    FirmaDialog,
    FingerprintComponent,
    NuevoCasoComponent,
    VisordiunsaComponent,
    UploadComponentComponent,
    ConsultaAbordajeComponent,
    DefinicionesComponent,
    ConfirmdialogComponent,
    popUpTelPlan,
    popUpReason,
    DesbloquearComponent,
    AumentocupoComponent,
    popUpInfo,
    ResumenasesorComponent,
    SupervisorseguimientosComponent,
    RankingsComponent,
    ReporteriaComponent,
    ReporteJefeventasComponent,
    QuoteComponent,
    FeedrequestsComponent,
    // FeedbackComponent,
    // TramitesComponent,
    // RequerimientosComponent,
    // ListaRequerimientosComponent


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    // MatCarouselModule.forRoot(),
    // DndModule,
    // NgxChartsModule,
    WebcamModule,
    NgxMaskModule.forRoot(),
    CommonModule,
    FaceDetectorModule,
    DniDetectorModule,
    SocketIoModule
  ],
  entryComponents: [FirmaDialog, ConfirmdialogComponent, popUpTelPlan,popUpReason, popUpInfo, UploadComponentComponent, FingerprintComponent],
  providers: [AuthGuard, NoAuthGuard, AuthService, FaceGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptService,
    multi: true
  }],
  bootstrap: [AppComponent],

})
export class AppModule { }
