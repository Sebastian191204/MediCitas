import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FILTERS = ['Todos', 'Sangre', 'Orina', 'Imágenes'];

const MOCK_EXAMS = [
  {
    id: '1', name: 'Hemograma Completo',   type: 'Sangre',  status: 'Disponible',
    date: '15 Abr, 2026', doctor: 'Dr. Carlos Rodríguez',
  },
  {
    id: '2', name: 'Perfil Lipídico',      type: 'Sangre',  status: 'Disponible',
    date: '10 Abr, 2026', doctor: 'Dra. María González',
  },
  {
    id: '3', name: 'Glucosa en Ayunas',    type: 'Sangre',  status: 'Disponible',
    date: '5 Abr, 2026',  doctor: 'Dr. Carlos Rodríguez',
  },
  {
    id: '5', name: 'Radiografía de Tórax', type: 'Imagen',  status: 'Disponible',
    date: '28 Mar, 2026', doctor: 'Dr. Luis Martínez',
  },
  {
    id: '4', name: 'Examen de Orina',      type: 'Orina',   status: 'Pendiente',
    date: '20 May, 2026', doctor: 'Dra. Ana Ramírez',
  },
];

export default function ExamsScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = MOCK_EXAMS.filter(e => {
    const matchFilter =
      activeFilter === 'Todos' ||
      e.type === activeFilter ||
      (activeFilter === 'Imágenes' && e.type === 'Imagen');
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.doctor.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const disponibles = MOCK_EXAMS.filter(e => e.status === 'Disponible').length;
  const pendientes  = MOCK_EXAMS.filter(e => e.status === 'Pendiente').length;

  const handleVerResultados = (exam: typeof MOCK_EXAMS[0]) => {
    navigation.navigate('ExamDetail', {
      examId:     exam.id,
      examName:   exam.name,
      examDate:   exam.date,
      examDoctor: exam.doctor,
      examStatus: exam.status,
    });
  };

  const handleDownload = (exam: typeof MOCK_EXAMS[0]) => {
    if (exam.status === 'Pendiente') {
      Alert.alert('No disponible', 'Los resultados de este examen aún están pendientes.');
      return;
    }
    Alert.alert(
      'Descargar resultado',
      `El archivo PDF de "${exam.name}" estará listo próximamente.\n\n(Función de descarga con expo-file-system en roadmap)`,
      [{ text: 'Entendido' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Exámenes</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar exámenes..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#16a34a' }]}>{disponibles}</Text>
            <Text style={[styles.statLabel, { color: '#16a34a' }]}>Disponibles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#ea580c' }]}>{pendientes}</Text>
            <Text style={[styles.statLabel, { color: '#ea580c' }]}>Pendientes</Text>
          </View>
        </View>

        {/* ── Filters ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Results ── */}
        <Text style={styles.sectionTitle}>Resultados Recientes</Text>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTxt}>No se encontraron exámenes</Text>
          </View>
        ) : (
          filtered.map(exam => (
            <View key={exam.id} style={styles.examCard}>
              <View style={styles.examTop}>
                {/* Icon */}
                <View style={[
                  styles.examIconBox,
                  { backgroundColor: exam.type === 'Imagen' ? '#dbeafe' : '#dcfce7' },
                ]}>
                  <Ionicons
                    name={exam.type === 'Imagen' ? 'image-outline' : 'document-text-outline'}
                    size={22}
                    color={exam.type === 'Imagen' ? '#2563eb' : '#16a34a'}
                  />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.examName}>{exam.name}</Text>
                  <View style={styles.examTags}>
                    <View style={styles.typeTag}>
                      <Text style={styles.typeTagText}>{exam.type}</Text>
                    </View>
                    <View style={[
                      styles.statusTag,
                      { backgroundColor: exam.status === 'Disponible' ? '#dcfce7' : '#fff7ed' },
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: exam.status === 'Disponible' ? '#16a34a' : '#ea580c' },
                      ]}>
                        {exam.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.examMeta}>
                    <Ionicons name="calendar-outline" size={13} color="#64748b" />
                    <Text style={styles.metaText}>{exam.date}</Text>
                  </View>
                  <Text style={styles.doctorText}>Ordenado por: {exam.doctor}</Text>
                </View>
              </View>

              {/* Action buttons */}
              <View style={styles.examActions}>
                <TouchableOpacity
                  style={styles.verBtn}
                  onPress={() => handleVerResultados(exam)}
                >
                  <Ionicons name="eye-outline" size={16} color="#374151" />
                  <Text style={styles.verBtnText}>Ver Resultados</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.downloadBtn,
                    exam.status === 'Pendiente' && styles.downloadBtnDisabled,
                  ]}
                  onPress={() => handleDownload(exam)}
                >
                  <Ionicons
                    name="download-outline"
                    size={18}
                    color={exam.status === 'Pendiente' ? '#cbd5e1' : '#64748b'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header:       { backgroundColor: '#16a34a', paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle:  { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  searchRow:    {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput:  { flex: 1, fontSize: 15, color: '#1e293b' },

  // Body
  body:         { flex: 1, paddingHorizontal: 16 },

  // Stats
  statsRow:     { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 16 },
  statCard:     {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statNumber:   { fontSize: 28, fontWeight: 'bold' },
  statLabel:    { fontSize: 13, fontWeight: '500', marginTop: 2 },

  // Filters
  filtersRow:   { marginBottom: 16 },
  filterChip:   {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0', marginRight: 8, backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  filterText:   { fontSize: 14, color: '#64748b', fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: '700' },

  // Section
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 12 },

  // Exam card
  examCard:     {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  examTop:      { flexDirection: 'row', gap: 12 },
  examIconBox:  { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  examName:     { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  examTags:     { flexDirection: 'row', gap: 8, marginBottom: 6 },
  typeTag:      { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeTagText:  { fontSize: 12, color: '#475569', fontWeight: '500' },
  statusTag:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText:   { fontSize: 12, fontWeight: '600' },
  examMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  metaText:     { fontSize: 12, color: '#64748b' },
  doctorText:   { fontSize: 12, color: '#94a3b8' },

  // Actions
  examActions:  {
    flexDirection: 'row', alignItems: 'center', marginTop: 12,
    borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10, gap: 10,
  },
  verBtn:       {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, paddingVertical: 8, gap: 6,
  },
  verBtnText:   { fontSize: 14, color: '#374151', fontWeight: '500' },
  downloadBtn:  {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8,
    padding: 9, alignItems: 'center', justifyContent: 'center',
  },
  downloadBtnDisabled: { borderColor: '#f1f5f9', backgroundColor: '#fafafa' },

  // Empty
  empty:        { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyTxt:     { fontSize: 15, color: '#94a3b8' },
});
