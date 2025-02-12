<template>
  <q-page class="container q-pa-md">
    <!-- Formulario para crear una renta -->
    <q-card flat bordered class="q-pa-md shadow-1">
      <div class="text-h6 text-center q-mb-md">Crear Nueva Renta</div>

      <q-form @submit="createRent" class="q-gutter-md">
        <!-- Selector de vestidos -->
        <q-select
          v-model="form.dress_id"
          :options="dressesOptions"
          option-value="_id"
          option-label="name"
          label="Seleccionar vestido"
          emit-value
          map-options
          outlined
          dense
          :rules="[val => !!val || 'El vestido es requerido']"
        />

        <!-- Nombre del cliente -->
        <q-input
          v-model="form.clientName"
          label="Nombre del cliente"
          outlined
          dense
          :rules="[val => !!val || 'El nombre del cliente es requerido']"
        />

        <!-- Teléfono del cliente -->
        <q-input
          v-model="form.clientPhone"
          label="Teléfono del cliente"
          type="number"
          outlined
          dense
          :rules="[val => !!val || 'El teléfono del cliente es requerido', val => val.toString().length === 10 || 'El teléfono debe tener 10 dígitos']"
        />

        <!-- Total -->
        <q-input
          v-model="form.total"
          label="Total ($)"
          type="number"
          outlined
          dense
          :rules="[val => val >= 0 || 'El total debe ser mayor o igual a 0']"
          readonly
        />

        <!-- Fecha de renta -->
        <q-input
          v-model="form.rentalDate"
          label="Fecha de renta"
          type="date"
          outlined
          dense
          :rules="[val => !!val || 'La fecha de renta es requerida']"
        />

        <!-- Fecha de devolución -->
        <q-input
          v-model="form.returnDate"
          label="Fecha de devolución"
          type="date"
          outlined
          dense
          :rules="[val => !!val || 'La fecha de devolución es requerida']"
        />

        <!-- Botón de envío -->
        <div class="row justify-center q-mt-md">
          <q-btn
            type="submit"
            color="primary"
            label="Crear Renta"
            icon="add"
            unelevated
            :loading="isLoading"
          />
        </div>
      </q-form>
    </q-card>


  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiService from 'src/boot/ApiServices/api.service';
import { useQuasar } from 'quasar';
const user = localStorage.getItem('user');
import checkLoggedIn from 'src/boot/auth';

// Verificar si el usuario está autenticado
checkLoggedIn();


const { $q } = useQuasar();
// Datos reactivos
const form = ref({
  user_id: user ? JSON.parse(user)._id : null,  
  dress_id: null,
  clientName: '',
  clientPhone: null,
  total: 0,
  rentalDate: '',
  returnDate: '',
});

const dressesOptions = ref([]);
const isLoading = ref(false);

// Obtener vestidos desde la API
const fetchDresses = async () => {
  try {
    const response = await apiService.get('/dresses/getAll');
    dressesOptions.value = response.data.filter(dress => 
      !dress.sold && dress.available
    );
  } catch (error) {
    console.error('Error obteniendo vestidos:', error);
    $q.notify({
      type: 'negative',
      message: 'No se pudieron cargar los vestidos. Inténtalo más tarde.',
      position: 'top'
    });
  }
};

// Crear una nueva renta
const createRent = async () => {
  try {
    isLoading.value = true;

    // Validar que las fechas sean válidas
    if (new Date(form.value.rentalDate) >= new Date(form.value.returnDate)) {
      throw new Error('La fecha de devolución debe ser posterior a la fecha de renta.');
    }

    // Enviar los datos al backend
    await apiService.post('/rents', form.value);

    // Mostrar mensaje de éxito
    $q.notify({
      type: 'positive',
      message: 'Renta creada exitosamente',
      position: 'top'
    });
    resetForm();
  } catch (error) {
    console.error('Error creando renta:', error);
    $q.notify({
      type: 'negative',
      message: error.message || 'No se pudo crear la renta. Inténtalo más tarde.',
      position: 'top'
    });
  } finally {
    isLoading.value = false;
  }
};

// Resetear el formulario
const resetForm = () => {
  form.value = {
    dress_id: null,
    clientName: '',
    clientPhone: null,
    total: 0,
    rentalDate: '',
    returnDate: '',
  };
};

// Cargar vestidos al montar el componente
onMounted(fetchDresses);

// Observar cambios en el vestido seleccionado para actualizar el total
watch(() => form.value.dress_id, (newDressId) => {
  const selectedDress = dressesOptions.value.find(dress => dress._id === newDressId);
  if (selectedDress) {
    form.value.total = selectedDress.price;
  } else {
    form.value.total = 0;
  }
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>