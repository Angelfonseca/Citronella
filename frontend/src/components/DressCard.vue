<template>
  <q-card class="dress-card">
    <!-- Imagen del vestido -->
    <q-img
  :src="localDress.image || 'https://via.placeholder.com/300'"
  :alt="dress.name"
  class="dress-image"
/>

    <!-- Información del vestido -->
    <q-card-section>
      <div class="text-h6 text-center">{{ dress.name }}</div>
      <q-list separator>
        <q-item>
          <q-item-section>Talla:</q-item-section>
          <q-item-section side>{{ dress.size }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Color:</q-item-section>
          <q-item-section side>{{ dress.color }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Precio:</q-item-section>
          <q-item-section side>{{ dress.price }} $</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Disponibilidad:</q-item-section>
          <q-item-section side>
            <q-badge :color="dress.available ? 'green' : 'red'">
              {{ dress.available ? 'Disponible' : 'No disponible' }}
            </q-badge>
          </q-item-section>
        </q-item>
        <q-item v-if="dress.cleaning">
          <q-item-section>Estado:</q-item-section>
          <q-item-section side>
            <q-badge color="orange">En tintorería</q-badge>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Vestido para:</q-item-section>
          <q-item-section side>
            <q-badge :color="dress.toSell ? 'blue' : 'purple'">
              {{ dress.toSell ? 'Venta' : 'Renta' }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Botones de acción -->
    <q-card-actions align="around">
      <q-btn
        color="blue"
        text-color="white"
        @click="updateAvailability(dress._id)"
        v-if="user && (user.role === 'admin' || user.role === 'user')"
      >
        {{ dress.available ? 'Marcar como No Disponible' : 'Marcar como Disponible' }}
      </q-btn>

      <q-btn
        color="yellow"
        text-color="black"
        @click="updateCleaning(dress._id)"
        v-if="user && (user.role === 'admin' || user.role === 'user')"
      >
        {{ dress.cleaning ? 'Volver a disponibilidad' : 'Marcar en tintorería' }}
      </q-btn>

      <q-btn
        color="red"
        text-color="white"
        @click="deleteDress"
        v-if="user && user.role === 'admin'"
      >
        Eliminar vestido
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import apiService from 'src/boot/ApiServices/api.service';

const props = defineProps({
  dress: {
    type: Object,
    required: true
  }
});

// Copia local reactiva del vestido para evitar modificar props directamente
const localDress = ref({ ...props.dress });

// Sincronizar cambios si el prop `dress` cambia externamente
watch(() => props.dress, (newVal) => {
  localDress.value = { ...newVal };
}, { deep: true });

// Simulación de usuario para pruebas
const user = ref({ role: 'admin' });

// Cambiar disponibilidad
const updateAvailability = async () => {
  try {
    await apiService.put(`/dresses/changeAvailability/${localDress.value._id}`);
    localDress.value.available = !localDress.value.available; // Actualiza la copia local
    window.location.reload();
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
  }
};

// Cambiar estado de limpieza
const updateCleaning = async () => {
  try {
    await apiService.put(`/dresses/changeCleaning/${localDress.value._id}`);
    localDress.value.cleaning = !localDress.value.cleaning; // Actualiza la copia local
    window.location.reload();
  } catch (error) {
    console.error('Error actualizando limpieza:', error);
  }
};

// Simulación de eliminación
const deleteDress = () => {
  console.log('Vestido eliminado');
};

const getDressImage = () => {
  if (localDress.value.image) {
    localDress.value.image = `http://localhost:3000/dresses/${localDress.value.image}`;
  } else {
    localDress.value.image = 'https://via.placeholder.com/300';
  }
};

onMounted(() => {
  getDressImage();
  console.log('Imagen del vestido:', localDress.value.image);
});

watch(
  () => props.dress,
  (newVal) => {
    localDress.value = { ...newVal };
    getDressImage(); // Actualiza la imagen cuando cambie el prop
  },
  { deep: true }
);
</script>


<style scoped>
.dress-card {
  width: 100%;
  max-width: 300px;
  margin: auto;
  border-radius: 12px;
  overflow: hidden;
}

.dress-image {
  height: 250px;
  object-fit: cover;
}
</style>
