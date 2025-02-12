<template>
    <q-page class="container q-pa-md">
      <!-- Botón para crear una nueva renta -->
      <div class="row justify-end q-mb-md">
        <q-btn
          color="primary"
          label="Crear Nueva Renta"
          icon="add"
          unelevated
          @click="navigateToCreateRent"
        />
      </div>

      <!-- Filtros -->
      <q-card flat bordered class="q-pa-md q-mb-md shadow-1">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="searchKeyword"
              placeholder="Buscar por cliente, vestido"
              outlined
              dense
              clearable
              prepend-icon="search"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="startDate"
              type="date"
              outlined
              dense
              label="Fecha inicial"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="endDate"
              type="date"
              outlined
              dense
              label="Fecha final"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-btn
              @click="filterRentsByDate"
              color="primary"
              label="Filtrar"
              icon="filter_alt"
              unelevated
              class="full-width"
            />
          </div>
        </div>
      </q-card>

      <!-- Tabla de alquileres -->
      <q-table
  :rows="paginatedRents"
  :columns="columns"
  row-key="_id"
  flat
  bordered
  separator="cell"
  class="q-mt-md shadow-1"
>
  <template v-slot:body-cell-actions="props">
    <q-td :props="props">
      <q-btn
        @click="handleReturnClick(props.row)"
        color="positive"
        label="Recibir vestido"
        icon="check_circle"
        size="sm"
        unelevated
        class="q-mr-sm"
      />
    </q-td>
  </template>
</q-table>


      <!-- Paginación -->
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          boundary-links
          direction-links
          color="primary"
          active-color="secondary"
          class="shadow-1"
        />
      </div>

      

      <!-- Mensajes de éxito y error -->
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import  apiService  from '../boot/ApiServices/api.service';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const  $q  = useQuasar();
const router = useRouter();
const user = JSON.parse(localStorage.getItem('user'));
import checkLoggedIn from 'src/boot/auth';

// Verificar si el usuario está autenticado
checkLoggedIn();


const rents = ref([]);
const searchKeyword = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);


// Columnas de la tabla
const columns = [
  { name: 'clientName', required: true, label: 'Nombre del cliente', align: 'left', field: 'clientName' },
  { name: 'clientPhone', required: true, label: 'Teléfono', align: 'left', field: 'clientPhone' },
  {
  name: 'dress',
  required: true,
  label: 'Vestido',
  align: 'left',
  field: 'dressName'
},
  { name: 'total', label: 'Total', align: 'right', field: 'total' },
  { name: 'rentalDate', label: 'Fecha de renta', align: 'left', field: 'rentalDate' },
  { name: 'returnDate', label: 'Fecha de devolución', align: 'left', field: 'returnDate' },
  { 
    name: 'status', 
    label: 'Estado', 
    align: 'center', 
    field: 'returned',
    format: (val) => val ? 'Devuelto' : 'No devuelto',
    style: 'font-weight: bold',
    classes: (val) => val ? 'text-positive' : 'text-negative'
    },
  { name: 'actions', label: 'Acciones', align: 'center' },
];

// Obtener rentas desde la API
const fetchRents = async () => {
  try {
    const response = await apiService.get('/rents');
    console.log(response.data);
    rents.value = response.data.map(rent => ({
      ...rent,
      rentalDate: new Date(rent.rentalDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      returnDate: new Date(rent.returnDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dressName: rent.dress_id?.name || 'Sin vestido',
    }));
    console.log({rents});
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al cargar las rentas: ${error.message}`,
      position: 'top',
      timeout: 3000
    });
  }
};

const handleReturnClick = async (rent) => {
  try {
    // Verificar si el vestido ya fue devuelto
    if (rent.returned) {
      $q.notify({
        type: 'warning',
        message: 'Este vestido ya ha sido devuelto.',
        position: 'top',
        timeout: 3000
      });
      return;
    }

    const vestido_id = rent._id;
    const user_id = user._id;
    console.log(vestido_id, user_id);
    
    if (!vestido_id || !user_id) {
      $q.notify({
        type: 'negative',
        message: 'Faltan datos necesarios para procesar la devolución.',
        position: 'top',
        timeout: 3000
      });
      return;
    }

    // Verificar si la fecha de devolución ya pasó
    const returnDate = new Date(rent.returnDate);
    const today = new Date();
    if (today > returnDate) {
      const confirm = window.confirm('La fecha de devolución ya pasó. ¿Desea continuar con la devolución?');
      if (!confirm) return;
    }

    await apiService.post(`/rents/return/${vestido_id}`, {user_id: user_id});

    $q.notify({
      type: 'positive',
      message: 'Vestido recibido correctamente.',
      position: 'top',
      timeout: 3000
    });

    fetchRents();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al recibir el vestido: ${error.message}`,
      position: 'top',
      timeout: 3000
    });
  }
};
// Cargar rentas al montar el componente
onMounted(() => {
  fetchRents();
});

// Filtrado de alquileres
const paginatedRents = computed(() => {
  let filtered = rents.value;

  // Filtrar por palabra clave (cliente o vestido)
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(
      (rent) =>
        rent.clientName.toLowerCase().includes(keyword) ||
        (rent.dress_id?.name && rent.dress_id.name.toLowerCase().includes(keyword))
    );
  }

  // Filtrar por rango de fechas
  if (startDate.value && endDate.value) {
    filtered = filtered.filter(
      (rent) =>
        new Date(rent.rentalDate) >= new Date(startDate.value) &&
        new Date(rent.returnDate) <= new Date(endDate.value)
    );
  }

  // Paginación
  return filtered.slice((currentPage.value - 1) * 10, currentPage.value * 10);
});

const totalPages = computed(() => Math.ceil(paginatedRents.value.length / 10));

const navigateToCreateRent = () => {
  router.push('/createRent');
};
// const filterRentsByDate = () => {
//   // La lógica de filtrado ya está implementada en el computed paginatedRents
// };

// const handleReturnClick = async (rent) => {
//   // Implementar lógica para manejar la devolución
//   showSuccessMessage.value = true;
//   setTimeout(() => {
//     showSuccessMessage.value = false;
//   }, 3000);
// };

// const confirmLateReturn = async (rent) => {
//   // Implementar lógica para confirmar entrega tardía
// };

// const cancelLateReturn = (rent) => {
//   // Implementar lógica para cancelar entrega tardía
// };
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}

.q-table {
  border-radius: 8px;
}

.q-banner {
  border-radius: 8px;
}

.container {
  max-width: 1200px;
  margin: auto;
}

.q-table {
  border-radius: 8px;
}

.q-banner {
  border-radius: 8px;
}

/* Estilo para la columna "Vestido" */
.q-table td:nth-child(3) {
  font-weight: bold;
  color: #027be3; /* Azul */
}
</style>
