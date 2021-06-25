import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl =  environment.baseUrl;

  constructor(private httpClient: HttpClient) { }
  authenticate(email, password) {

    return this.httpClient.post<{ JWT: string, Expiracion: number, IdError: number, roleId:number,Identificado:number }>(this.baseUrl + "/api/auth/token"
      , { Usuario: email, Clave: password }
      , { headers: new HttpHeaders({ "No-Auth": "True" }) }
    );
  }

  extend() {
    return this.httpClient.get<{ token: string, expired: number, error: number }>(this.baseUrl + "/api/auth/extend");
  }

  change(ContrasenaActual: string, ContrasenaNueva: string) {
    return this.httpClient.post<{ error: number }>(this.baseUrl + "/api/auth/change"
      , { ContrasenaActual: ContrasenaActual, ContrasenaNueva: ContrasenaNueva }
    );
  }
}
