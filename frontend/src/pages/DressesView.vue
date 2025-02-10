<template>
  <q-page>
    <q-page-container>
      <q-toolbar class="bg-primary text-white q-mb-md">
        <q-toolbar-title>Catálogo</q-toolbar-title>
      </q-toolbar>

      <q-card class="q-pa-md">
        <q-card-section class="row q-col-gutter-md">
          <q-input v-model="searchQuery" filled dense label="Buscar vestido" class="col-md-3 col-xs-12" />
          <q-select v-model="selectedForSelling" :options="forSellingOptions" filled dense label="Tipo de venta" class="col-md-2 col-xs-12" />
          <q-select v-model="selectedSize" :options="sizeOptions" filled dense label="Tamaño" class="col-md-2 col-xs-12" />
          <q-select v-model="selectedColor" :options="uniqueColors" filled dense label="Color" class="col-md-2 col-xs-12" />
          <q-input v-model.number="minPrice" type="number" filled dense label="Precio mínimo" class="col-md-2 col-xs-6" />
          <q-input v-model.number="maxPrice" type="number" filled dense label="Precio máximo" class="col-md-2 col-xs-6" />
          <q-toggle v-model="onlyAvailable" label="Solo disponibles" class="col-md-2 col-xs-12" />
          <q-toggle v-model="onlyCleaning" label="En limpieza" class="col-md-2 col-xs-12" />
          <q-select v-model="selectedCategory" :options="categoryOptions" filled dense label="Categoría" class="col-md-2 col-xs-12" />
        </q-card-section>
      </q-card>

      <q-card-section>
        <q-list class="row q-col-gutter-md">
          <q-item v-for="dress in filteredDresses" :key="dress.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <DressCard :dress="dress" />
          </q-item>
        </q-list>
      </q-card-section>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DressCard from '../components/DressCard.vue';
import { api } from 'boot/axios';

const dresses = ref([]);
const searchQuery = ref('');
const selectedSize = ref('');
const selectedColor = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);
const onlyAvailable = ref(false);
const onlyCleaning = ref(false);
const selectedForSelling = ref('');
const selectedCategory = ref('');

const forSellingOptions = [
  { label: 'Todos', value: '' },
  { label: 'Para Venta', value: 'sale' },
  { label: 'Para Renta', value: 'rent' }
];

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
const categoryOptions = ['Fiesta', 'Casual', 'Boda', 'Cóctel'];

const uniqueColors = computed(() => {
  if (!dresses.value) return [];
  const colors = [...new Set(dresses.value.map(dress => dress.color))];
  return colors.map(color => ({ label: color, value: color }));
});

const filteredDresses = computed(() => {
  if (!dresses.value) return [];
  const minPriceValue = minPrice.value ? Number(minPrice.value) : null;
  const maxPriceValue = maxPrice.value ? Number(maxPrice.value) : null;

  return dresses.value.filter(dress => {
    const matchesSearch = dress.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSize = selectedSize.value ? dress.size === selectedSize.value : true;
    const matchesColor = selectedColor.value ? dress.color.toLowerCase() === selectedColor.value.toLowerCase() : true;
    const matchesAvailability = onlyAvailable.value ? dress.available : true;
    const matchesCleaning = onlyCleaning.value ? dress.cleaning : true;
    const matchesMinPrice = minPriceValue !== null ? Number(dress.price) >= minPriceValue : true;
    const matchesMaxPrice = maxPriceValue !== null ? Number(dress.price) <= maxPriceValue : true;
    const matchesCategory = selectedCategory.value ? dress.category === selectedCategory.value : true;

    const isForSale = dress.toSell === true;
    const isSold = dress.sold === true;
    const matchesForSelling = selectedForSelling.value === ''
      || (selectedForSelling.value === 'sale' && isForSale && !isSold)
      || (selectedForSelling.value === 'rent' && !isForSale);

    return matchesSearch && matchesSize && matchesColor && matchesMinPrice && matchesMaxPrice && matchesAvailability && matchesCleaning && matchesForSelling && matchesCategory;
  });
});

const fetchDresses = async () => {
  try {
    const response = await api.get('/dresses/getAll');
    dresses.value = response.data;
  } catch (error) {
    console.error('Error fetching dresses:', error);
  }
};



onMounted(fetchDresses);
</script>

<style scoped>
.q-toolbar-title {
  font-size: 1.5rem;
}
</style>
