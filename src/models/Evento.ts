export default interface Evento {
    id: number;
    ciudad: string;
    direccion: string;
    fecha: Date;
    frontImage: string;
    backImage: string;
    ticketFrontImage: string;
    ticketBackImage: string;
    price: number;
    artistas: {
        id: number;
        nombre: string;
    }[];
}