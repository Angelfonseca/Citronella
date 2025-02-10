<template>
  <q-drawer
    v-model="localActive"
    side="left"
    bordered
    class="bg-white shadow-2"
    :overlay="!isMobile"
    :width="280"
  >
    <!-- Logo y Nombre de la Empresa -->
    <div class="text-center q-pa-md">
      <q-img
        src="../assets/login.png"
        class="q-mx-auto"
        style="max-width: 80px; transition: transform 0.3s ease;"
        :class="{ 'hover:scale-110': !isMobile }"
      />
    </div>

    <!-- Menú de Navegación -->
    <q-list class="q-mt-lg">
      <q-item
        v-for="item in menuItems"
        :key="item.name"
        clickable
        v-ripple
        :to="item.link"
        @click="handleMenuItemClick(item)"
        class="q-my-xs"
        style="border-radius: 10px; transition: all 0.3s ease;"
        :class="{ 'hover:bg-primary hover:text-white': !isMobile }"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" class="text-primary" />
        </q-item-section>
        <q-item-section class="text-grey-9" style="font-family: 'Raleway', sans-serif;">
          {{ t(item.name) }}
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Botón de Logout -->
    <div class="absolute-bottom q-pa-md">
      <q-btn 
        color="negative" 
        icon="logout" 
        label="Cerrar sesión"
        class="full-width"
        @click="logout"
      />
    </div>
  </q-drawer>
</template>

<script setup>
import { defineProps, ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
  toggleSidebar: {
    type: Function,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();

const localActive = ref(props.isActive);
const isMobile = computed(() => $q.screen.lt.md);

const menuItems = [
  { name: 'components.lateralNavigation.home', icon: 'home', link: '/' },
  { name: 'components.lateralNavigation.dresses', icon: 'store', link: '/dresses' },
  { name: 'components.lateralNavigation.jewelry', icon: 'diamond', link: '/jewelry' },
  { name: 'components.lateralNavigation.sells', icon: 'shopping_cart', link: '/sales' },
  { name: 'components.lateralNavigation.rentals', icon: 'calendar_today', link: '/rentals' },
  { name: 'components.lateralNavigation.addProduct', icon: 'add', link: '/add-product' },
  { name: 'components.lateralNavigation.contact', icon: 'mail', link: '/contact' },
  { name: 'components.lateralNavigation.adminPage', icon: 'admin_panel_settings', link: '/admin' },
];

// Sincroniza la prop `isActive` con `localActive`
watch(() => props.isActive, (newVal) => {
  localActive.value = newVal;
});

// Notifica el cambio de estado al componente padre
watch(localActive, (newVal) => {
  if (newVal !== props.isActive) {
    props.toggleSidebar(newVal);
  }
});

// Cierra el drawer cuando cambia la ruta
watch(() => route.path, () => {
  localActive.value = false;
});

// Maneja el clic en un ítem del menú
function handleMenuItemClick(item) {
  if (item.action) {
    item.action(); // Ejecuta la acción personalizada del ítem
  }
  if (isMobile.value) {
    localActive.value = false; // Cierra automáticamente en móviles
  }
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login'); // Redirige al login
}
</script>

<style scoped>
/* Fuentes personalizadas */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Raleway:wght@400;500&display=swap');

/* Estilos para el drawer */
.q-drawer {
  border-right: 1px solid #e0e0e0;
}

/* Efecto hover en los ítems del menú */
.q-item:hover {
  background-color: #f0f0f0;
  transform: translateX(5px);
}

/* Transición suave para el logo */
.q-img {
  transition: transform 0.3s ease;
}

.q-img:hover {
  transform: scale(1.1);
}

/* Estilos para el texto del menú */
.q-item-section {
  font-size: 1rem;
  font-weight: 500;
}

/* Estilos para el ícono del menú */
.q-icon {
  font-size: 1.2rem;
}

/* Botón de logout en la parte inferior */
.absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}

/* Estilos para móviles */
@media (max-width: 768px) {
  .q-drawer {
    width: 100% !important;
  }
}
</style>
