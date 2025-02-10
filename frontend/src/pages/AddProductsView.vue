<template>
  <q-page class="flex flex-center q-pa-md">
    <!-- Contenedor principal -->
    <q-card class="q-pa-lg shadow-2 form-container">
      <!-- Título -->
      <q-card-section>
        <div class="text-h4 text-primary text-weight-bold text-center q-mb-md">Añadir Nuevo Producto</div>
      </q-card-section>

      <!-- Formulario -->
      <q-card-section>
        <q-form @submit.prevent="submitProduct" class="q-gutter-y-md">
          <!-- Tipo de Producto -->
          <q-select
            v-model="selectedType"
            :options="productTypes"
            label="Tipo de Producto"
            outlined
            dense
            emit-value
            map-options
            options-dense
            class="full-width"
          />

          <!-- Nombre -->
          <q-input
            v-model="product.name"
            label="Nombre"
            outlined
            dense
            required
            placeholder="Ej. Vestido de Fiesta o Collar de Diamantes"
            class="full-width"
          />

          <!-- Descripción -->
          <q-input
            v-model="product.description"
            label="Descripción"
            type="textarea"
            outlined
            dense
            required
            placeholder="Escribe una descripción detallada..."
            class="full-width"
          />

          <!-- Precio -->
          <q-input
            v-model.number="product.price"
            label="Precio"
            type="number"
            outlined
            dense
            required
            prefix="$"
            placeholder="Ej. 500"
            class="full-width"
          />

          <!-- Campos específicos para vestidos -->
          <div v-if="selectedType === 'dress'">
            <q-select
              v-model="product.size"
              :options="dressSizes"
              label="Talla"
              outlined
              dense
              required
              class="full-width"
            />

            <q-input
              v-model="product.color"
              label="Color"
              outlined
              dense
              required
              placeholder="Ej. Rojo"
              class="full-width"
            />

            <q-toggle
              v-model="product.toSell"
              label="¿Es para venta?"
              color="primary"
              class="q-mb-md"
            />

            <q-select
              v-model="product.category"
              :options="dressCategories"
              label="Categoría"
              outlined
              dense
              required
              class="full-width"
            />
          </div>

          <!-- Campos específicos para joyería -->
          <div v-if="selectedType === 'jewelry'">
            <q-input
              v-model.number="product.stock"
              label="Stock"
              type="number"
              outlined
              dense
              required
              placeholder="Ej. 10"
              class="full-width"
            />

            <q-select
              v-model="product.category"
              :options="jewelryCategories"
              label="Categoría"
              outlined
              dense
              required
              class="full-width"
            />
          </div>

          <!-- Imagen -->
          <q-file
            v-model="product.image"
            label="Imagen"
            accept="image/*"
            outlined
            dense
            @update:model-value="onFileChange"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <!-- Vista previa de la imagen -->
          <div v-if="imageUrl" class="q-mt-md flex flex-center">
            <q-img :src="imageUrl" fit="cover" class="image-preview rounded-borders" />
          </div>

          <!-- Botón de envío -->
          <q-btn
            type="submit"
            label="Añadir Producto"
            color="primary"
            unelevated
            class="full-width q-py-sm"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '../boot/ApiServices/api.service';

const token = localStorage.getItem('token');

// Datos del formulario
const selectedType = ref('dress');
const product = ref({
  name: '',
  description: '',
  price: 0,
  size: '', // Solo para vestidos
  color: '', // Solo para vestidos
  toSell: true, // Solo para vestidos
  stock: 0, // Solo para joyería
  image: null,
  category: ''
});

// Opciones del formulario
const productTypes = [
  { label: 'Vestido', value: 'dress' },
  { label: 'Joyería', value: 'jewelry' }
];
const dressSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const dressCategories = ['Fiesta', 'Casual', 'Boda', 'Cóctel'];
const jewelryCategories = ['Collares', 'Aretes', 'Anillos', 'Brazaletes', 'Dijes'];

// Vista previa de la imagen
const imageUrl = ref('');
const onFileChange = (file) => {
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
  }
};

// Envío del formulario
const submitProduct = async () => {
  const formData = new FormData();
  formData.append('name', product.value.name);
  formData.append('description', product.value.description);
  formData.append('price', product.value.price);

  if (selectedType.value === 'dress') {
    formData.append('size', product.value.size);
    formData.append('color', product.value.color);
    formData.append('toSell', product.value.toSell);
    formData.append('category', product.value.category);
  } else {
    formData.append('stock', product.value.stock);
    formData.append('category', product.value.category);
  }

  if (product.value.image) {
    formData.append('image', product.value.image);
  }

  try {
    const endpoint = selectedType.value === 'dress' ? '/dresses/create' : '/jewelry/create';
    await apiService.post(endpoint, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Producto añadido con éxito');
    resetForm();
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
};

// Resetear formulario
const resetForm = () => {
  product.value = {
    name: '',
    description: '',
    price: 0,
    size: '', // Solo para vestidos
    color: '', // Solo para vestidos
    toSell: true, // Solo para vestidos
    stock: 0, // Solo para joyería
    image: null,
    category: ''
  };
  imageUrl.value = '';
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  width: 100%;
}

.image-preview {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
}
</style>