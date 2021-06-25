export interface DatosPreguntas {
    IdError: number;
    Mensaje: string;
    Modulo: number;
    Preguntas: Preguntas;
}
export interface Preguntas {
    Id: number;
    Imagen: string;
    TramitesDiarios: number;
    Respuestas: Respuestas;
    TextoPregunta: string;
    RespuestaCheck:string;
}
export interface Respuestas {
    Id: number;
    TextosRespuesta: string;
}
export interface DatosSave {
    Modulo: number;
    IdError: number;
    Mensaje:string;
    datosCertificado:object;
    PreguntasIncorrectas:object;
}
export interface dataList {
    IdError: number
    Lista: dataList1

  }

  export interface dataList1 {
    Id: number
    IdAsesor: number
    NombreAsesor: string
    IdVendedor: number
    IdTipoDocumento:string
    Documento: string
    FechaControl:string
    IdEstado:string
    IdPantalla: string
  }
  