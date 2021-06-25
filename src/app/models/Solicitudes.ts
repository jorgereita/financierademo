export interface Solicitudes {
    todas: Solicitud[],
    tomadas: Solicitud[],
    gestionadas: Solicitud[],
    idError: number
}

export interface Solicitud {
    id: number,
    tipoIdentificacion: string,
    identificacion: string,
    nombreCliente: string,
    apellidoCliente: string,
    caja: string,
    tienda: string,
    ciudad: string,
    departamento: string,
    fechaControl: string,
    gestiones?: Gestion[],
    gestion?: string
}

export interface Gestion {
    text: string,
    value?: string
}