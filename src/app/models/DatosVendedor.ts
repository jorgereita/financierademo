export interface DatosVendedor {
    Identificacion: string;
    Nombre: string;
    Sucursal: string;
    Jornada: string;
    Productividad: Productividad;
    Incentivos: Incentivos;
    AprobacionGlobal: number;
    ParticipacionEmpleado: number;
    AprobacionEmpleado: number;
    ParticipacionPensionado: number;
    AprobacionPensionado: number;
    ParticipacionIndependiente: number;
    AprobacionIndependiente: number;
    ParticipacionProfesional: number;
    AprobacionProfesional: number;
    ParticipacionRentista: number;
    AprobacionRentista: number;
    ParticipacionTransportador: number;
    AprobacionTransportador: number;
    IdCuadrante: number;
    Cuadrante: string;
    NombreCapacitacion: string;
    URLCapacitacion: string;
    // Perfilamiento: Perfilamiento;
    FechaCorte: string;
    Error: number;
    RankingLocal: number;
    RankingNacional: number;
    TramitesDiarios: number;
    Aprobacion: number;
    Entregas: number;
    ProductividadDiaria: number;
    ProyeccionEntregas: number;
    Activacion: number;
    Ranking: number;
    MetaEntregas:number;
    MetaEntregasCorte:number;
    Ciclo:string;
}

export interface Productividad {
   
}

export interface Incentivos {
    ProyeccionEntregas: number;
    Activacion: number;
    ProyeccionComision: number;
    TCProximoRango: number;
    AdicionalProximoRango: number;
    TCBono1: number;
    Bono1: number;
    TCBono2: number;
    Bono2: number;
    TCBono3: number;
    Bono3: number;
    TotalComision: number;
    TotalComisionAdicional: number;
}
export interface Perfilamiento {
    
}