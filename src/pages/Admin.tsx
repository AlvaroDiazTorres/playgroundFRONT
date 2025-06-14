import { useEffect, useState } from 'react';
import EventService from '../services/event.services';
import type Evento from '../models/Evento';

const emptyEvent: Partial<Evento> = {
  ciudad: '',
  direccion: '',
  fecha: new Date(),
  frontImage: '',
  backImage: '',
};

function EventForm({ initial, onSave, onCancel }: {
  initial: Partial<Evento>,
  onSave: (data: Partial<Evento>) => void,
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<Evento>>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <form
      className="bg-white p-4 rounded shadow space-y-2"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="flex gap-2">
        <input name="ciudad" value={form.ciudad || ''} onChange={handleChange} placeholder="City" className="border p-1 rounded flex-1 font-sans" required />
        <input name="direccion" value={form.direccion || ''} onChange={handleChange} placeholder="Address" className="border p-1 rounded flex-1 font-sans" required />
      </div>
      <div className="flex gap-2">
        <input name="fecha" type="date" value={form.fecha ? String(form.fecha).slice(0,10) : ''} onChange={handleChange} className="border p-1 rounded flex-1 font-sans" required />
      </div>
      <input name="frontImage" value={form.frontImage || ''} onChange={handleChange} placeholder="Front Image URL" className="border p-1 rounded w-full font-sans" required />
      <input name="backImage" value={form.backImage || ''} onChange={handleChange} placeholder="Back Image URL" className="border p-1 rounded w-full font-sans" required />
      <div className="flex gap-2 justify-end mt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-[#d93823] text-white hover:bg-[#b32d1c]">Save</button>
      </div>
    </form>
  );
}

export default function Admin() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Evento> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    EventService.getAll()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await EventService.delete(id);
      const updatedEvents = await EventService.getAll();
      setEvents(updatedEvents);
      alert('Event deleted');
    } catch (err) {
      console.error('Error deleting event:', err);
      window.location.reload();
    }
  };

  const handleEdit = (id: number) => {
    const event = events.find(e => e.id === id);
    if (event) {
      setEditing(event);
      setIsNew(false);
      setShowForm(true);
    }
  };

  const handleNew = () => {
    setEditing(emptyEvent);
    setIsNew(true);
    setShowForm(true);
  };

  const handleSave = async (data: Partial<Evento>) => {
    try {
      if (isNew) {
        const created = await EventService.create(data);
        setEvents([...events, created]);
      } else if (editing && editing.id) {
        const updated = await EventService.update(editing.id, data);
        setEvents(events.map(ev => ev.id === editing.id ? updated : ev));
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error('Error saving event:', err);
      window.location.reload();
    }
  };

  if (loading) return <div className="mt-10 text-2xl text-[#d93823]">Loading events...</div>;
  if (error) return <div className="mt-10 text-2xl text-red-600">Error: {error}</div>;

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl text-[#d93823]">Events</div>
        <button onClick={handleNew} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2">
          New Event <span className="text-xl">➕</span>
        </button>
      </div>
      {showForm && (
        <EventForm
          initial={editing || emptyEvent}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      <ul className="space-y-4 mt-4">
        {events.map(event => (
          <li key={event.id} className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
            <div>
              <div className="font-bold text-lg">Evento {event.ciudad}</div>
              <div className="text-sm text-gray-600 font-sans">{new Date(event.fecha).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event.id)}
                className="text-xl px-2 py-1 rounded hover:bg-gray-200"
                title="Edit"
              >
                ⚙️
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-xl px-2 py-1 rounded hover:bg-red-100 text-red-600"
                title="Delete"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
