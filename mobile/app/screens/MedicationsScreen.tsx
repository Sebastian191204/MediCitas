import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  taken: boolean;
}

interface Prescription {
  id: string;
  name: string;
  status: 'Activo' | 'Inactivo';
  description: string;
  frequency: string;
  hours: string;
  duration: string;
  doctor: string;
  date: string;
  adherence: number; // 0-3
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: '1', name: 'Losartán 50mg',      time: '8:00 AM',  taken: true  },
  { id: '2', name: 'Omeprazol 20mg',     time: '8:00 AM',  taken: true  },
  { id: '3', name: 'Omeprazol 20mg',     time: '8:00 PM',  taken: false },
  { id: '4', name: 'Atorvastatina 20mg', time: '10:00 PM', taken: false },
];

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: '1', name: 'Losartán 50mg', status: 'Activo',
    description: 'Control de presión arterial',
    frequency: '1 vez al día', hours: '8:00 AM', duration: 'Continuo',
    doctor: 'Dra. María González', date: '10 Ene, 2026',
    adherence: 1, color: '#2563eb',
  },
  {
    id: '2', name: 'Atorvastatina 20mg', status: 'Activo',
    description: 'Control de colesterol',
    frequency: '1 vez al día', hours: '10:00 PM', duration: 'Continuo',
    doctor: 'Dra. María González', date: '10 Ene, 2026',
    adherence: 2, color: '#2563eb',
  },
  {
    id: '3', name: 'Omeprazol 20mg', status: 'Activo',
    description: 'Protección gástrica',
    frequency: '2 veces al día', hours: '8:00 AM, 8:00 PM', duration: '30 días',
    doctor: 'Dr. Carlos Rodríguez', date: '1 May, 2026',
    adherence: 2, color: '#2563eb',
  },
  {
    id: '4', name: 'Ibuprofeno 400mg', status: 'Activo',
    description: 'Antiinflamatorio',
    frequency: 'Cada 8 horas si hay dolor', hours: 'Según necesidad', duration: '10 días',
    doctor: 'Dr. Luis Martínez', date: '3 May, 2026',
    adherence: 1, color: '#2563eb',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AdherenceBar({ value, total = 3 }: { value: number; total?: number }) {
  return (
    <View style={adh.row}>
      <View style={adh.track}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              adh.segment,
              { marginRight: i < total - 1 ? 4 : 0 },
              i < value ? adh.filled : adh.empty,
            ]}
          />
        ))}
      </View>
      <Text style={adh.label}>{value}/{total}</Text>
    </View>
  );
}

const adh = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  track:   { flex: 1, flexDirection: 'row' },
  segment: { flex: 1, height: 7, borderRadius: 4 },
  filled:  { backgroundColor: '#16a34a' },
  empty:   { backgroundColor: '#e2e8f0' },
  label:   { fontSize: 12, fontWeight: '700', color: '#64748b', minWidth: 28 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MedicationsScreen({ navigation }: any) {
  const [schedule, setSchedule]           = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [prescriptions]                   = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);

  const takenCount   = schedule.filter(s => s.taken).length;
  const pendingCount = schedule.filter(s => !s.taken).length;
  const activeCount  = prescriptions.filter(p => p.status === 'Activo').length;

  const markTaken = (id: string) => {
    setSchedule(prev =>
      prev.map(s => s.id === id ? { ...s, taken: true } : s)
    );
  };

  const handleMarcar = (item: ScheduleItem) => {
    Alert.alert(
      'Marcar como tomado',
      `¿Confirmás que tomaste ${item.name} a las ${item.time}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => markTaken(item.id) },
      ]
    );
  };

  const handleAgregar = () => {
    Alert.alert(
      'Agregar medicamento',
      'Esta función te permite registrar un nuevo medicamento recetado.\n\n(Próximamente conectado a Supabase)',
      [{ text: 'Entendido' }]
    );
  };

  const handleDetails = (p: Prescription) => {
    Alert.alert(
      p.name,
      `Indicación: ${p.description}\n\nFrecuencia: ${p.frequency}\nHorarios: ${p.hours}\nDuración: ${p.duration}\n\nRecetado por: ${p.doctor}\nFecha: ${p.date}`,
      [{ text: 'Cerrar' }]
    );
  };

  const handleReminders = (p: Prescription) => {
    Alert.alert(
      'Recordatorios',
      `Tienes recordatorios configurados para ${p.name}.\n\n🔔 ${p.hours} - Notificación activa\n\n(Administración de notificaciones próximamente)`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6d28d9" />

      {/* ── Gradient Header ── */}
      <LinearGradient colors={['#6d28d9', '#2563eb']} style={styles.header}>
        {/* Title row */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Medicamentos</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleAgregar}>
            <Ionicons name="add" size={15} color="#6d28d9" />
            <Text style={styles.addBtnTxt}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{activeCount}</Text>
            <Text style={styles.statLbl}>Activos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{takenCount}</Text>
            <Text style={styles.statLbl}>Tomados hoy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{pendingCount}</Text>
            <Text style={styles.statLbl}>Pendientes</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* ── Horario de Hoy ── */}
        <Text style={styles.sectionTitle}>Horario de Hoy</Text>
        <View style={styles.section}>
          {schedule.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.scheduleItem,
                idx < schedule.length - 1 && styles.scheduleItemBorder,
              ]}
            >
              {/* Icon */}
              <View style={[
                styles.scheduleIcon,
                { backgroundColor: item.taken ? '#dcfce7' : '#dbeafe' },
              ]}>
                {item.taken
                  ? <Ionicons name="checkmark" size={20} color="#16a34a" />
                  : <MaterialCommunityIcons name="pill" size={20} color="#2563eb" />
                }
              </View>

              {/* Info */}
              <View style={styles.scheduleInfo}>
                <Text style={[styles.scheduleName, item.taken && styles.scheduleNameDone]}>
                  {item.name}
                </Text>
                <View style={styles.scheduleTimeRow}>
                  <Ionicons name="time-outline" size={13} color="#94a3b8" />
                  <Text style={styles.scheduleTime}>{item.time}</Text>
                  {item.taken && (
                    <View style={styles.takenBadge}>
                      <Text style={styles.takenTxt}>Tomado</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Action */}
              {!item.taken && (
                <TouchableOpacity style={styles.marcarBtn} onPress={() => handleMarcar(item)}>
                  <Text style={styles.marcarTxt}>Marcar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* ── Recetas Activas ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recetas Activas</Text>
          <TouchableOpacity onPress={() =>
            Alert.alert('Recetas', 'Vista completa de recetas próximamente.')
          }>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {prescriptions.map(p => (
          <View key={p.id} style={styles.prescCard}>
            <View style={[styles.prescBorder, { backgroundColor: p.color }]} />
            <View style={styles.prescBody}>
              {/* Name + badge */}
              <View style={styles.prescNameRow}>
                <Text style={styles.prescName}>{p.name}</Text>
                <View style={[styles.statusBadge, p.status === 'Activo' ? styles.badgeGreen : styles.badgeGrey]}>
                  <Text style={[styles.statusTxt, p.status === 'Activo' ? styles.statusGreen : styles.statusGrey]}>
                    {p.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.prescDesc}>{p.description}</Text>

              {/* Meta rows */}
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={14} color="#64748b" />
                <Text style={styles.metaLbl}>Frecuencia:</Text>
                <Text style={styles.metaVal}>{p.frequency}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="notifications-outline" size={14} color="#64748b" />
                <Text style={styles.metaLbl}>Horarios:</Text>
                <Text style={styles.metaVal}>{p.hours}</Text>
              </View>
              <View style={[styles.metaRow, { marginBottom: 10 }]}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={styles.metaLbl}>Duración:</Text>
                <Text style={styles.metaVal}>{p.duration}</Text>
              </View>

              {/* Doctor */}
              <Text style={styles.prescDoctor}>
                Recetado por: <Text style={styles.prescDoctorBold}>{p.doctor}</Text>
                {'  ·  '}{p.date}
              </Text>

              {/* Adherence */}
              <Text style={styles.adherenceLbl}>Adherencia últimos 3 días</Text>
              <AdherenceBar value={p.adherence} />

              {/* Buttons */}
              <View style={styles.prescActions}>
                <TouchableOpacity style={styles.detailsBtn} onPress={() => handleDetails(p)}>
                  <Text style={styles.detailsTxt}>Ver Detalles</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.remindersBtn} onPress={() => handleReminders(p)}>
                  <Ionicons name="notifications-outline" size={15} color="#2563eb" />
                  <Text style={styles.remindersTxt}>Recordatorios</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* ── Consejo del día ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="notifications" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Consejo del día</Text>
            <Text style={styles.tipTxt}>
              Toma tus medicamentos a la misma hora todos los días para crear una rutina. Esto ayuda a mejorar la adherencia al tratamiento.
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header:     { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20 },
  headerTop:  { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn:    { marginRight: 10 },
  headerTitle:{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 },
  addBtn:     {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  addBtnTxt:  { fontSize: 13, color: '#6d28d9', fontWeight: '700' },
  statsRow:   { flexDirection: 'row', gap: 10 },
  statBox:    {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  statNum:    { fontSize: 26, fontWeight: 'bold', color: '#fff', lineHeight: 30 },
  statLbl:    { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2, textAlign: 'center' },

  // Body
  body:          { flex: 1, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  sectionTitle:  { fontSize: 17, fontWeight: '700', color: '#1e293b', marginTop: 20, marginBottom: 10 },
  sectionLink:   { fontSize: 14, color: '#2563eb', fontWeight: '600' },

  // Schedule card
  section:           {
    backgroundColor: '#fff', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  scheduleItem:      { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  scheduleItemBorder:{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  scheduleIcon:      { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scheduleInfo:      { flex: 1 },
  scheduleName:      { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  scheduleNameDone:  { textDecorationLine: 'line-through', color: '#94a3b8' },
  scheduleTimeRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scheduleTime:      { fontSize: 13, color: '#64748b' },
  takenBadge:        { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 6 },
  takenTxt:          { fontSize: 12, color: '#16a34a', fontWeight: '600' },
  marcarBtn:         { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  marcarTxt:         { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Prescription cards
  prescCard:    {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  prescBorder:  { width: 4, alignSelf: 'stretch' },
  prescBody:    { flex: 1, padding: 14 },
  prescNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  prescName:    { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  statusBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeGreen:   { backgroundColor: '#dcfce7' },
  badgeGrey:    { backgroundColor: '#f1f5f9' },
  statusTxt:    { fontSize: 12, fontWeight: '600' },
  statusGreen:  { color: '#16a34a' },
  statusGrey:   { color: '#94a3b8' },
  prescDesc:    { fontSize: 13, color: '#64748b', marginBottom: 10 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  metaLbl:      { fontSize: 13, color: '#64748b' },
  metaVal:      { fontSize: 13, color: '#1e293b', fontWeight: '500', flex: 1 },
  prescDoctor:  { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  prescDoctorBold: { fontWeight: '600', color: '#64748b' },
  adherenceLbl: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  prescActions: {
    flexDirection: 'row', gap: 10,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  detailsBtn:   {
    flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8,
    paddingVertical: 8, alignItems: 'center',
  },
  detailsTxt:   { fontSize: 13, color: '#374151', fontWeight: '500' },
  remindersBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderWidth: 1.5, borderColor: '#bfdbfe', borderRadius: 8, paddingVertical: 8,
  },
  remindersTxt: { fontSize: 13, color: '#2563eb', fontWeight: '500' },

  // Tip card
  tipCard:  {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: '#eff6ff', borderRadius: 14, padding: 16, marginTop: 4, marginBottom: 8,
  },
  tipIcon:  {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
  tipTxt:   { fontSize: 13, color: '#1e40af', lineHeight: 20 },
});
