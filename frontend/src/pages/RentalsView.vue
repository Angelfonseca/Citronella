<template>
    <BaseLayout>
      <q-page class="container q-pa-md">
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
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div v-if="props.col.field === 'actions'">
                <q-btn
                  @click="handleReturnClick(props.row)"
                  color="positive"
                  label="Recibir vestido"
                  icon="check_circle"
                  size="sm"
                  unelevated
                  class="q-mr-sm"
                />
                <q-banner
                  v-if="props.row.showLateMessage"
                  inline-actions
                  class="bg-yellow-1 text-black q-mt-sm"
                >
                  <template v-slot:avatar>
                    <q-icon name="warning" color="warning" />
                  </template>
                  <div class="text-subtitle1">{{ props.row.lateMessage }}</div>
                  <div>{{ props.row.daysLate }} días de retraso.</div>
                  <template v-slot:action>
                    <q-btn
                      @click="confirmLateReturn(props.row)"
                      color="negative"
                      label="Confirmar entrega tardía"
                      size="sm"
                      unelevated
                    />
                    <q-btn
                      @click="cancelLateReturn(props.row)"
                      color="grey"
                      label="Cancelar"
                      size="sm"
                      unelevated
                      class="q-ml-sm"
                    />
                  </template>
                </q-banner>
              </div>
              <div v-else>
                {{ props.row[props.col.field] || 'N/A' }}
              </div>
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
        <q-banner
          v-if="showSuccessMessage"
          class="bg-positive text-white q-mt-md shadow-2 rounded-borders"
        >
          <template v-slot:avatar>
            <q-icon name="check_circle" size="md" />
          </template>
          <div class="text-h6">¡Vestido recibido con éxito!</div>
          <div>El vestido ha sido recibido correctamente.</div>
        </q-banner>
  
        <q-banner
          v-if="showErrorMessage"
          class="bg-negative text-white q-mt-md shadow-2 rounded-borders"
        >
          <template v-slot:avatar>
            <q-icon name="error" size="md" />
          </template>
          <div class="text-h6">Error</div>
          <div>{{ errorMessage }}</div>
        </q-banner>
      </q-page>
    </BaseLayout>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const searchKeyword = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const currentPage = ref(1);
  const showSuccessMessage = ref(false);
  const showErrorMessage = ref(false);
  const errorMessage = ref('');
  
  // Datos de ejemplo (simulando datos de MongoDB)
  const rents = ref([
    {
      _id: '1',
      user_id: { name: 'Usuario 1' },
      dress_id: { name: 'Vestido A' },
      clientName: 'Juan Pérez',
      clientPhone: 1234567890,
      total: 150,
      rentalDate: '2024-01-15',
      returnDate: '2024-01-22',
      showLateMessage: false,
      lateMessage: '',
      daysLate: 0,
    },
    {
      _id: '2',
      user_id: { name: 'Usuario 2' },
      dress_id: { name: 'Vestido B' },
      clientName: 'María López',
      clientPhone: 9876543210,
      total: 200,
      rentalDate: '2024-02-01',
      returnDate: '2024-02-08',
      showLateMessage: true,
      lateMessage: 'Entrega tardía',
      daysLate: 3,
    },
  ]);
  
  // Columnas de la tabla
  const columns = [
    { name: 'clientName', required: true, label: 'Nombre del cliente', align: 'left', field: 'clientName' },
    { name: 'clientPhone', required: true, label: 'Teléfono', align: 'left', field: 'clientPhone' },
    { name: 'dress', required: true, label: 'Vestido', align: 'left', field: (row) => row.dress_id?.name || 'N/A' },
    { name: 'total', label: 'Total', align: 'right', field: 'total' },
    { name: 'rentalDate', label: 'Fecha de renta', align: 'left', field: 'rentalDate' },
    { name: 'returnDate', label: 'Fecha de devolución', align: 'left', field: 'returnDate' },
    { name: 'actions', label: 'Acciones', align: 'center' },
  ];
  
  // Filtrado de alquileres
  const paginatedRents = computed(() => {
    let filtered = rents.value;
  
    // Filtro por búsqueda
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      filtered = filtered.filter(
        (rent) =>
          rent.clientName.toLowerCase().includes(keyword) ||
          rent.dress_id.name.toLowerCase().includes(keyword)
      );
    }
  
    // Filtro por rango de fechas
    if (startDate.value && endDate.value) {
      filtered = filtered.filter(
        (rent) => rent.rentalDate >= startDate.value && rent.returnDate <= endDate.value
      );
    }
  
    return filtered;
  });
  
  const totalPages = ref(10); // Número total de páginas
  
  // Funciones simuladas
//   const filterRentsByDate = () => {
//     // Lógica para filtrar alquileres por fecha
//   };
  
//   const handleReturnClick = (rent) => {
//     // Lógica para manejar la devolución del vestido
//   };
  
//   const confirmLateReturn = (rent) => {
//     // Lógica para confirmar la entrega tardía
//   };
  
//   const cancelLateReturn = (rent) => {
//     // Lógica para cancelar la entrega tardía
//   };
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
  </style>