export interface ListaVendedores {
    Vendedores: Vendedor[];
}
export interface Vendedor {
    Identificacion: string;
    Nombre: string;
    Cuadrante: string;
    Id: number;
    Cargo:string;
}
export interface respLoadImg {
    IdError: number;
    IdPersona: string;
    Mensaje: string;

}