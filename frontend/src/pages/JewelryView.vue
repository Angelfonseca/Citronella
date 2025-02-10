<template>
  <q-page>
    <q-page-container>
      <q-toolbar class="bg-primary text-white q-mb-md">
        <q-toolbar-title>Catálogo de Joyería</q-toolbar-title>
      </q-toolbar>
      <q-card class="q-pa-md">
        <q-card-section class="row q-col-gutter-md">
          <q-input v-model="searchQuery" filled dense label="Buscar joya" class="col-md-3 col-xs-12" />
          <q-select v-model="selectedCategory" :options="categoryOptions" filled dense label="Categoría"
            class="col-md-2 col-xs-12" />
          <q-input v-model.number="minPrice" type="number" filled dense label="Precio mínimo"
            class="col-md-2 col-xs-6" />
          <q-input v-model.number="maxPrice" type="number" filled dense label="Precio máximo"
            class="col-md-2 col-xs-6" />
          <q-toggle v-model="onlyInStock" label="Solo disponibles" class="col-md-2 col-xs-12" />
        </q-card-section>
      </q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div
            v-for="jewel in filteredJewelry"
            :key="jewel._id"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <JewelryCard 
              :jewel="jewel" 
              @add-to-cart="addToCart" 
              @update-stock="updateStock"
            />
          </div>
        </div>
      </q-card-section>
    </q-page-container>
    <!-- Componente de carrito flotante -->
    <FloatingCart :cartItems="cart" @remove-from-cart="removeFromCart" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import JewelryCard from '../components/JewelryCard.vue';
import FloatingCart from '../components/CartComponent.vue';
import apiService from 'src/boot/ApiServices/api.service';

// Estado de las joyas y el carrito
const jewelry = ref([]);
const cart = ref([]);

// Filtros
const searchQuery = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);
const onlyInStock = ref(false);
const selectedCategory = ref('');
const categoryOptions = ['Collares', 'Anillos', 'Pulseras', 'Aretes'];

// Obtener joyas desde la API
const fetchJewelry = async () => {
  try {
    const response = await apiService.get('/jewelry/getAll');
    console.log('Joyas obtenidas:', response.data);
    jewelry.value = response.data.map(jewel => ({
      ...jewel,
      stock: jewel.stock || 0, // Asegúrate de que `stock` esté definido
    }));
  } catch (error) {
    console.error('Error obteniendo joyas:', error);
  }
};

// Cargar datos al montar el componente
onMounted(fetchJewelry);

// Filtrado de joyas
const filteredJewelry = computed(() => {
  if (!jewelry.value) return [];
  return jewelry.value.filter(jewel => {
    const matchesSearch = jewel.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesMinPrice = minPrice.value !== null ? jewel.price >= minPrice.value : true;
    const matchesMaxPrice = maxPrice.value !== null ? jewel.price <= maxPrice.value : true;
    const matchesStock = onlyInStock.value ? jewel.stock > 0 : true;
    const matchesCategory = selectedCategory.value
      ? jewel.category.toLowerCase() === selectedCategory.value.toLowerCase()
      : true;
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock && matchesCategory;
  });
});

// Funciones del carrito
const addToCart = (product) => {
  const existingItem = cart.value.find((item) => item._id === product._id);
  if (existingItem) {
    existingItem.quantity += 1; // Incrementa la cantidad si ya existe
  } else {
    cart.value = [...cart.value, { ...product, quantity: 1 }]; // Agrega el producto si no existe
  }
  console.log('Producto agregado al carrito:', product);
};

const removeFromCart = (jewelId) => {
  cart.value = cart.value.filter(item => item._id !== jewelId);
  console.log('Producto eliminado del carrito:', jewelId);
};

// Actualizar stock después de una venta
const updateStock = async ({ id, newStock }) => {
  try {
    await apiService.put(`/jewelry/updateStock/${id}`, { stock: newStock });
    const jewelToUpdate = jewelry.value.find(j => j._id === id);
    if (jewelToUpdate) {
      jewelToUpdate.stock = newStock;
    }
    console.log(`Stock actualizado para joya con ID ${id}: Nuevo stock = ${newStock}`);
  } catch (error) {
    console.error('Error actualizando stock:', error);
  }
};
</script>

<style scoped>
.q-toolbar-title {
  font-size: 1.5rem;
}
</style>