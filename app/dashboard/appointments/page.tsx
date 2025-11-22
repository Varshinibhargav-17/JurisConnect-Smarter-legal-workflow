'use client';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { appointments } from '@/lib/data';
import './calendar.css';

const localizer = momentLocalizer(moment);

const events = appointments.map((apt) => ({
  title: apt.title,
  start: new Date(apt.date + 'T' + apt.time),
  end: new Date(new Date(apt.date + 'T' + apt.time).getTime() + 60 * 60 * 1000), // 1 hour duration
  allDay: false,
  resource: apt.clientName,
}));

export default function AppointmentsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        <button className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          New Appointment
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    </div>
  );
}
