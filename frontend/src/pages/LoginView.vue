<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Contenedor principal -->
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <!-- Contenido de la página -->
        <q-card class="q-pa-lg shadow-5 login-container">
          <div class="text-center q-mb-lg">
            <img src="../assets/login.png" alt="Logo" style="width: 80px; height: 80px;" />
          </div>

          <h1 class="text-h5 text-weight-bold text-center q-mb-md">Inicia Sesión</h1>

          <q-form @submit.prevent="login" class="q-gutter-y-md">
            <q-banner v-if="hasError" class="bg-red-1 text-white rounded-borders">
              <template v-slot:avatar>
                <q-icon name="error" color="white" />
              </template>
              <div class="text-subtitle1">Error</div>
              <div>Datos incorrectos. Por favor, revísalos.</div>
            </q-banner>

            <q-input
              v-model="form.username"
              label="Usuario"
              outlined
              dense
              placeholder="user98"
              required
              :rules="[val => !!val || 'El usuario es requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              label="Contraseña"
              outlined
              dense
              type="password"
              placeholder="••••••••"
              required
              :rules="[val => !!val || 'La contraseña es requerida']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>

            <q-btn
              type="submit"
              label="Ingresar"
              color="teal"
              unelevated
              class="full-width q-py-sm"
            />

            <div class="text-center q-mt-md">
              <q-btn
                flat
                no-caps
                label="¿Olvidaste tu contraseña?"
                color="primary"
                @click="forgotPassword"
              />
            </div>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../boot/ApiServices/api.service';
import { useQuasar } from 'quasar'; // Importa useQuasar

// Inicializa useQuasar
const $q = useQuasar();

const router = useRouter();
const hasError = ref(false);
const form = ref({
  username: '',
  password: ''
});

// Función para iniciar sesión
const login = () => {
  if (!form.value.username || !form.value.password) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Por favor, completa todos los campos.'
    });
    return;
  }

  hasError.value = false;
  apiService
    .post('/users/login', form.value)
    .then((response) => {
      if (response.error) {
        hasError.value = true;
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Error en el inicio de sesión. Verifica tus credenciales.'
        });
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'admin') {
          router.push('/');
        } else {
          router.push('/');
        }
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'check',
          message: 'Inicio de sesión exitoso.'
        });
      }
    })
    .catch(() => {
      hasError.value = true;
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Error en el inicio de sesión. Inténtalo de nuevo más tarde.'
      });
    });
};

// Verificar si ya está autenticado
const isAuth = localStorage.getItem('token');
if (isAuth) {
  router.push('/');
}

// Función para recuperar contraseña
const forgotPassword = () => {
  $q.notify({
    color: 'blue-5',
    textColor: 'white',
    icon: 'info',
    message: 'Redirigiendo a la recuperación de contraseña...'
  });
  // Aquí podrías agregar la lógica para redirigir a la página de recuperación de contraseña
};
</script>
<style scoped>
.login-container {
  max-width: 400px;
  width: 100%;
}
</style>