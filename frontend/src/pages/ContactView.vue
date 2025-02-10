<template>
    <q-page class="flex flex-center">
      <!-- Contenedor principal -->
      <div class="container q-pa-md">
        <!-- Título -->
        <div class="text-center q-mb-lg">
          <h1 class="text-h3 text-weight-bold">Contáctanos</h1>
        </div>
  
        <!-- Contenido principal -->
        <q-card flat bordered class="q-pa-lg shadow-2 rounded-borders max-w-3xl mx-auto">
          <!-- Descripción -->
          <p class="text-body1 q-mb-lg text-justify">
            Si tienes alguna pregunta o necesitas más información sobre nuestros vestidos, no dudes en contactarnos.
            Estamos aquí para ayudarte a encontrar el vestido perfecto para tu ocasión especial.
          </p>
  
          <!-- Dirección -->
          <div class="q-mb-lg">
            <h2 class="text-h5 text-weight-medium q-mb-sm text-center">Dirección</h2>
            <p class="text-center">C. Gómez Farias 29-A, Zona Centro, 20670 Pabellón de Arteaga, Ags.</p>
          </div>
  
          <!-- Teléfono -->
          <div class="q-mb-lg text-center">
            <h2 class="text-h5 text-weight-medium q-mb-sm">Teléfono</h2>
            <q-btn
              flat
              dense
              color="primary"
              :label="phone"
              @click="copyToClipboard(phone)"
              icon="content_copy"
              class="text-capitalize"
            />
          </div>
  
          <!-- Correo Electrónico -->
          <div class="q-mb-lg text-center">
            <h2 class="text-h5 text-weight-medium q-mb-sm">Correo Electrónico</h2>
            <q-btn
              flat
              dense
              color="primary"
              :label="email"
              @click="copyToClipboard(email)"
              icon="content_copy"
              class="text-capitalize"
            />
          </div>
  
          <!-- Horario de Atención -->
          <div class="q-mb-lg text-center">
            <h2 class="text-h5 text-weight-medium q-mb-sm">Horario de Atención</h2>
            <p>Lunes a Viernes: 11:00 AM - 3:00 PM / 6:00 PM - 8:00 PM</p>
            <p>Sábados: 11:30 AM - 3:30 PM</p>
            <p>Domingos: Cerrado</p>
          </div>
  
          <!-- Redes Sociales -->
          <div class="q-mb-lg text-center">
            <h2 class="text-h5 text-weight-medium q-mb-sm">Redes Sociales</h2>
            <div class="row justify-center q-gutter-sm">
              <q-btn
                flat
                round
                color="primary"
                icon="fab fa-facebook"
                size="lg"
                @click="openLink('https://www.facebook.com/profile.php?id=100063739113428&mibextid=LQQJ4d')"
              />
              <q-btn
                flat
                round
                color="pink"
                icon="fab fa-instagram"
                size="lg"
                @click="openLink('https://www.instagram.com/citronella_2020?igsh=MXJ2bjczMm1qeG1tZA==')"
              />
            </div>
          </div>
  
          <!-- Mapa -->
          <div class="text-center">
            <h2 class="text-h5 text-weight-medium q-mb-sm">Ubicación</h2>
            <iframe
              class="full-width"
              style="height: 300px; border: none;"
              src="https://www.google.com.mx/maps/embed?pb=!1m18!1m12!1m3!1d3675.3046012107656!2d-102.278548!3d22.1493919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8429e3e7dc71b3f7%3A0x187323d350b75534!2sCitronella!5e0!3m2!1ses-419!2smx!4v1687371252456!5m2!1ses-419!2smx"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </q-card>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('contacto@tiendarenta.com');
  const phone = ref('(+52) 449 469 7204');
  
  // Función para copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${text} copiado al portapapeles`);
    });
  };
  
  // Función para abrir enlaces
  const openLink = (url) => {
    window.open(url, '_blank');
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: auto;
  }
  
  .max-w-3xl {
    max-width: 38rem;
    margin: auto;
  }
  
  .text-center {
    text-align: center;
  }
  
  .full-width {
    width: 100%;
  }
  </style>