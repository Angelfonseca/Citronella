<template>
  <BaseLayout>
    <q-page class="container q-pa-md">
      <!-- Filtros -->
      <q-card flat bordered class="q-pa-md q-mb-md shadow-1">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="searchKeyword"
              placeholder="Buscar por usuario, vestido, joyería"
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
              @click="filterSalesByDate"
              color="primary"
              label="Filtrar"
              icon="filter_alt"
              unelevated
              class="full-width"
            />
          </div>
        </div>
      </q-card>

      <!-- Tabla de ventas -->
      <q-table
        :rows="paginatedSales"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        separator="cell"
        class="q-mt-md shadow-1"
      >
        <template v-slot:body-cell-products="props">
          <q-td :props="props">
            <div v-for="(product, index) in props.row.products" :key="index" class="q-mb-xs">
              <span v-if="product.product_model === 'dresses'">
                Vestido: {{ product.product_id?.name || 'N/A' }}
              </span>
              <span v-else-if="product.product_model === 'jewelry'">
                Joyería: {{ product.product_id?.name || 'N/A' }}
              </span>
              <br />
              <small>Cantidad: {{ product.quantity }}, Precio: ${{ product.price }}</small>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              @click="viewDetails(props.row)"
              color="info"
              label="Ver detalles"
              icon="visibility"
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
  </BaseLayout>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from 'src/boot/ApiServices/api.service';

// Datos reactivos
const searchKeyword = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5); // Número de elementos por página
const showErrorMessage = ref(false);
const errorMessage = ref('');

// Estado para almacenar las ventas
const sales = ref([]);

// Función para obtener detalles de un producto (joyería o vestido)
const getProductDetails = async (productModel, productId) => {
  try {
    const endpoint = productModel === 'jewelry' ? '/jewelry/getOne' : '/dresses/getOne';
    const response = await apiService.get(`${endpoint}/${productId}`);
    return response.data; // Devuelve los detalles del producto
  } catch (error) {
    console.error(`Error obteniendo detalles del producto (${productModel}):`, error);
    return { name: 'N/A' }; // Retorna un nombre predeterminado si hay un error
  }
};

// Obtener ventas desde la API y cargar detalles de productos
const fetchSales = async () => {
  try {
    const response = await apiService.get('/sells');
    console.log('Ventas obtenidas:', response.data);

    // Iterar sobre cada venta y cargar los detalles de los productos
    const enrichedSales = await Promise.all(
      response.data.map(async (sale) => {
        const enrichedProducts = await Promise.all(
          sale.products.map(async (product) => {
            const productDetails = await getProductDetails(product.product_model, product.product_id);
            return {
              ...product,
              product_id: productDetails, // Reemplazar el ID con los detalles del producto
            };
          })
        );
        return {
          ...sale,
          products: enrichedProducts,
          date: sale.date.split('T')[0], // Formatear fecha para mostrar solo YYYY-MM-DD
        };
      })
    );

    sales.value = enrichedSales;
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    showErrorMessage.value = true;
    errorMessage.value = 'No se pudieron cargar las ventas. Inténtalo más tarde.';
  }
};

// Cargar datos al montar el componente
onMounted(fetchSales);

// Columnas de la tabla
const columns = [
  { name: 'user', required: true, label: 'Usuario', align: 'left', field: (row) => row.user_id?.name || 'N/A' },
  { name: 'products', required: true, label: 'Productos', align: 'left' },
  { name: 'total', label: 'Total', align: 'right', field: 'total' },
  { name: 'date', label: 'Fecha', align: 'left', field: 'date' },
  { name: 'actions', label: 'Acciones', align: 'center' },
];

// Filtrado de ventas
const filteredSales = computed(() => {
  let filtered = sales.value;

  // Filtro por búsqueda
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter((sale) =>
      sale.user_id.name.toLowerCase().includes(keyword) ||
      sale.products.some((product) => product.product_id.name.toLowerCase().includes(keyword))
    );
  }

  // Filtro por rango de fechas
  if (startDate.value && endDate.value) {
    filtered = filtered.filter(
      (sale) => sale.date >= startDate.value && sale.date <= endDate.value
    );
  }

  return filtered;
});

// Paginación
const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSales.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage.value));

// Función para filtrar ventas por fecha
const filterSalesByDate = () => {
  currentPage.value = 1; // Resetear a la primera página al filtrar
};

// Función para ver detalles de una venta
const viewDetails = (sale) => {
  console.log('Detalles de la venta:', sale);
};
</script>