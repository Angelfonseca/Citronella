<template>
  <q-page class="flex flex-center column bg-grey-1">
    <!-- Hero Section -->
    <section class="hero-section q-py-xl full-width">
      <div class="row justify-center items-center">
        <div class="col-12 col-md-6 text-center">
          <h1 class="text-h3 text-weight-bold text-primary q-mb-md">Bienvenido a Citronella</h1>
          <p class="text-subtitle1 text-grey-8 q-mt-md q-mb-lg">
            Tu destino para encontrar el vestido perfecto y accesorios únicos. Ofrecemos renta de vestidos
            personalizados, venta de joyería exclusiva y vestidos únicos para cada ocasión.
          </p>
          <div class="q-mt-lg">
            <q-btn label="Explorar Vestidos" color="primary" size="lg" unelevated to="/dresses" class="q-mr-md" />
            <q-btn label="Ver Joyería" color="secondary" size="lg" outline to="/jewelry" />
          </div>
        </div>
        <div class="col-12 col-md-6 q-pl-md">
          <transition appear enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
            <div class="row justify-center">
              <q-img src="https://www.zapaka.com.mx/cdn/shop/files/HD2024005_20Light_20Yellow_20_5.jpg?v=1715250824"
                alt="Vestidos elegantes" class="rounded-borders shadow-10" style="max-width: 500px; margin: auto;" />
            </div>
          </transition>
        </div>
      </div>
    </section>

    <!-- Servicios Section -->
    <section class="services-section q-py-xl full-width bg-white">
      <div class="row justify-center q-col-gutter-lg">
        <div class="col-12 text-center">
          <h2 class="text-h4 text-weight-bold text-primary">Nuestros Servicios</h2>
          <p class="text-subtitle1 text-grey-8 q-mt-md">
            Descubre todo lo que Citronella tiene para ofrecerte.
          </p>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-grey-1 text-center">
            <q-card-section>
              <q-icon name="fas fa-tshirt" size="xl" color="primary" />
              <h3 class="text-h6 text-weight-bold q-mt-sm">Renta de Vestidos</h3>
              <p class="text-body2 text-grey-8">
                Encuentra el vestido perfecto para cualquier ocasión, ajustado a tu estilo y presupuesto.
              </p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-grey-1 text-center">
            <q-card-section>
              <q-icon name="fas fa-gem" size="xl" color="secondary" />
              <h3 class="text-h6 text-weight-bold q-mt-sm">Venta de Joyería</h3>
              <p class="text-body2 text-grey-8">
                Joyas exclusivas y elegantes para complementar tu look en cualquier evento especial.
              </p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-grey-1 text-center">
            <q-card-section>
              <q-icon name="fas fa-shopping-bag" size="xl" color="accent" />
              <h3 class="text-h6 text-weight-bold q-mt-sm">Venta de Vestidos</h3>
              <p class="text-body2 text-grey-8">
                Adquiere vestidos únicos diseñados para destacar en cada momento importante.
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Testimonios Section -->
    <section class="testimonials-section q-py-xl full-width bg-grey-2">
      <div class="row justify-center">
        <div class="col-12 text-center">
          <h2 class="text-h4 text-weight-bold text-primary">Lo que dicen nuestros clientes</h2>
        </div>
        <div class="col-12 col-md-8 q-mt-lg">
          <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable animated
            control-color="primary" navigation padding arrows height="300px" class="bg-white rounded-borders">
            <q-carousel-slide name="1" class="column no-wrap flex-center">
              <q-avatar size="100px">
                <q-icon name="fas fa-user" size="100px" color="primary" />
              </q-avatar>
              <p class="text-body1 text-grey-8 q-mt-md">
                "¡Citronella hizo que mi evento fuera inolvidable! El vestido era exactamente lo que quería."
              </p>
              <p class="text-subtitle2 text-weight-bold">- María G.</p>
            </q-carousel-slide>
            <q-carousel-slide name="2" class="column no-wrap flex-center">
              <q-avatar size="100px">
                <q-icon name="fas fa-user" size="100px" color="primary" />
              </q-avatar>
              <p class="text-body1 text-grey-8 q-mt-md">
                "La joyería es hermosa y de alta calidad. ¡Definitivamente volveré!"
              </p>
              <p class="text-subtitle2 text-weight-bold">- Laura P.</p>
            </q-carousel-slide>
            <q-carousel-slide name="3" class="column no-wrap flex-center">
              <q-avatar size="100px">
                <q-icon name="fas fa-user" size="100px" color="primary" />
              </q-avatar>
              <p class="text-body1 text-grey-8 q-mt-md">
                "El servicio de renta fue rápido, fácil y muy profesional."
              </p>
              <p class="text-subtitle2 text-weight-bold">- Ana R.</p>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer-section q-py-xl full-width bg-primary text-white">
      <div class="row justify-center">
        <div class="col-12 text-center">
          <h2 class="text-h5 text-weight-bold">Contáctanos</h2>
          <p class="text-body1 q-mt-md">
            Estamos aquí para ayudarte a encontrar el look perfecto para tu próximo evento.
          </p>
          <div class="q-mt-lg">
            <q-btn label="Contacto" color="white" text-color="primary" size="lg" unelevated to="/contacto" />
          </div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import checkLoggedIn from 'src/boot/auth';

// Verificar si el usuario está autenticado
checkLoggedIn();

export default {
  setup() {
    const slide = ref('1');
    return {
      slide,
    };
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f0f8ff, #e6e6fa);
  border-radius: 10px;
}

.services-section {
  padding: 40px 20px;
}

.testimonials-section {
  padding: 40px 20px;
}

.footer-section {
  padding: 40px 20px;
}

/* Mejoras visuales */
.text-primary {
  color: #87CEEB !important;
  /* Azul cielo */
}

.bg-primary {
  background-color: #87CEEB !important;
  /* Azul cielo */
}

.shadow-10 {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>