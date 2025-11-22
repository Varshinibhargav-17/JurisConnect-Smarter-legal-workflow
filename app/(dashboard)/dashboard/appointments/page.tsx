'use client';
import { Calendar, momentLocalizer, EventProps } from 'react-big-calendar';
import moment from 'moment';
import { appointments } from '@/lib/data';
import './calendar.css';
import { PlusIcon } from '@heroicons/react/24/outline';

const localizer = momentLocalizer(moment);

const events = appointments.map((apt) => ({
  title: apt.title,
  start: new Date(apt.date + 'T' + apt.time),
  end: new Date(new Date(apt.date + 'T' + apt.time).getTime() + 60 * 60 * 1000), // 1 hour duration
  allDay: false,
  resource: {
    clientName: apt.clientName,
    lawyer: apt.lawyer,
  },
}));

const CustomEvent = ({ event }: EventProps) => {
  return (
    <div className="text-xs">
      <p className="font-bold">{event.title}</p>
      <p>{event.resource.clientName}</p>
    </div>
  );
};

export default function AppointmentsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">Schedule and manage all appointments.</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200" style={{ height: 'calc(100vh - 200px)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          components={{
            event: CustomEvent,
          }}
          eventPropGetter={() => {
            const style = {
              backgroundColor: '#3B82F6',
              color: 'white',
              borderRadius: '5px',
              border: 'none',
              opacity: 0.8,
            };
            return { style };
          }}
        />
      </div>
    </div>
  );
}
