import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type Evento from "../models/Evento";
import EventService from "../services/event.services";

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    EventService.getAll()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'ERROR: We could not get any event');
        setLoading(false);
      });
  }, []);

  const handleBookTickets = (eventoId: number) => {
    navigate(`/ticket-purchase/${eventoId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evento) => (
          <div key={evento.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img src={evento.frontImage} alt={'Cartel evento '+evento.ciudad} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
                <h2 className="text-xl font-bold mb-2">{evento.ciudad}</h2>
                <p className="text-sm">
                  {new Date(evento.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Artists</h3>
              <div className="flex flex-wrap gap-2">
                {evento.artistas.map((artista) => (
                  <span key={artista.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {artista.nombre}
                  </span>
                ))}
              </div>
              <button
                className="w-full mt-4 bg-[#d93823] text-white py-2 px-4 rounded-lg hover:bg-[#b32d1c] transition-colors duration-200"
                onClick={() => handleBookTickets(evento.id)}
              >
                Book Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
