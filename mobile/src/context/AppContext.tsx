import React, { createContext, useContext, useState } from 'react';

export interface Appointment {
  id: string;
  specialty: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Completada';
  doctor: string;
  date: string;
  time: string;
  location: string;
  color: string;
}

interface AppContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;
  showToast: boolean;
}

const INITIAL: Appointment[] = [
  {
    id: '1', specialty: 'Medicina General', status: 'Confirmada',
    doctor: 'Dr. Carlos Rodríguez', date: '25 Abr, 2026', time: '10:30 AM',
    location: 'Clínica del Norte, Piso 3', color: '#2563eb',
  },
  {
    id: '2', specialty: 'Cardiología', status: 'Pendiente',
    doctor: 'Dra. María González', date: '2 May, 2026', time: '3:00 PM',
    location: 'Hospital Central, Consultorio 205', color: '#dc2626',
  },
  {
    id: '3', specialty: 'Dermatología', status: 'Confirmada',
    doctor: 'Dr. Luis Martínez', date: '8 May, 2026', time: '11:00 AM',
    location: 'Centro Médico Sur, Piso 2', color: '#7c3aed',
  },
];

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL);
  const [showToast, setShowToast] = useState(false);

  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = { ...apt, id: Date.now().toString() };
    setAppointments(prev => [newApt, ...prev]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'Cancelada' as const } : a)
    );
  };

  return (
    <AppContext.Provider value={{ appointments, addAppointment, cancelAppointment, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
