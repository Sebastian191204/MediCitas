import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet,
  Alert, ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@medical-app/shared/hooks/useAuth';
import { validateEmail } from '@medical-app/shared/utils';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="dark-content" backgroundColor="#eff6ff" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="heart" size={34} color="#fff" />
        </View>
        <Text style={styles.appName}>MediCitas</Text>
        <Text style={styles.tagline}>Tu salud, siempre a tiempo</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Iniciar Sesión</Text>
        <Text style={styles.cardSubtitle}>Accede a tu cuenta</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <View style={styles.inputRow}>
          <MaterialIcons name="email" size={20} color="#9ca3af" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="usuario@ejemplo.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Iniciar Sesión</Text>}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o continúa con</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.googleBtn, googleLoading && { opacity: 0.7 }]}
          disabled={googleLoading || loading}
          onPress={async () => {
            setGoogleLoading(true);
            try {
              await signInWithGoogle();
            } catch (e: any) {
              const msg = e?.message ?? 'Error con Google';
              if (!msg.includes('cancelled') && !msg.includes('cancel')) {
                Alert.alert('Error', msg);
              }
            } finally {
              setGoogleLoading(false);
            }
          }}
        >
          {googleLoading
            ? <ActivityIndicator size="small" color="#4285f4" />
            : <>
                <Text style={styles.googleG}>G</Text>
                <Text style={styles.googleBtnText}>Continuar con Google</Text>
              </>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
          <Text style={styles.registerText}>
            ¿No tienes una cuenta?{' '}
            <Text style={styles.registerLink}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2026 MediCitas. Todos los derechos reservados.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff6ff' },
  content: { padding: 24, paddingBottom: 32 },
  logoContainer: { alignItems: 'center', marginTop: 32, marginBottom: 28 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 4 },
  tagline: { fontSize: 14, color: '#64748b' },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14,
    backgroundColor: '#f8fafc',
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#1e293b' },
  forgotRow: { alignItems: 'flex-end', marginBottom: 20, marginTop: -6 },
  forgotText: { fontSize: 13, color: '#2563eb', fontWeight: '500' },
  primaryBtn: {
    backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginBottom: 16,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: '#94a3b8' },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
    paddingVertical: 12, marginBottom: 20, backgroundColor: '#fff',
  },
  googleG: { fontSize: 17, fontWeight: 'bold', color: '#4285f4', marginRight: 8 },
  googleBtnText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  registerRow: { alignItems: 'center' },
  registerText: { fontSize: 14, color: '#64748b' },
  registerLink: { color: '#2563eb', fontWeight: '700' },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8' },
});
