import type Evento from "../models/Evento";
import { fetchAPI } from "../utils/FetchAPI"

const API_URL_BASE = "http://localhost:3000/api"

export class EventService {
    static async getAll() {
        return await fetchAPI(`${API_URL_BASE}/eventos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    }
    

    static async getById(id: number) {
        return await fetchAPI(`${API_URL_BASE}/eventos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    }

    static async create(evento: Partial<Evento>) {
        return await fetchAPI(API_URL_BASE+'/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento),
            credentials: 'include'
        })
    }

    static async update(id:number, evento: Partial<Evento>) {
        return await fetchAPI(API_URL_BASE+'/eventos/'+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento),
            credentials: 'include'
        })
    }
    static async delete(id: number){
        return await fetchAPI(API_URL_BASE+'/eventos/'+id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
    }



}
export default EventService