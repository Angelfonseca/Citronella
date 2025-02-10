<template>
  <q-card class="jewelry-card">
    <!-- Imagen de la joya -->
    <q-img :src="getImageUrl(jewel.image)" :alt="jewel.name" class="jewelry-image" />

    <!-- Información de la joya -->
    <q-card-section>
      <div class="text-h6 text-center">{{ jewel.name }}</div>
      <q-list separator>
        <q-item>
          <q-item-section>Descripción:</q-item-section>
          <q-item-section side>{{ jewel.description }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Precio:</q-item-section>
          <q-item-section side>{{ jewel.price }} $</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Disponibilidad:</q-item-section>
          <q-item-section side>
            <q-badge :color="localStock > 0 ? 'green' : 'red'">
              {{ localStock > 0 ? 'Disponible' : 'No disponible' }}
            </q-badge>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Cantidad disponible:</q-item-section>
          <q-item-section side>{{ localStock }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Botones de acción -->
    <q-card-actions align="around">
      <q-btn
        color="yellow"
        text-color="black"
        @click="openSaleDialog"
        v-if="user && (user.role === 'admin' || user.role === 'user')"
      >
        Vender
      </q-btn>

      <q-btn
        color="red"
        text-color="white"
        @click="deleteJewelry"
        v-if="user && user.role === 'admin'"
      >
        Eliminar joya
      </q-btn>

      <q-btn
        color="primary"
        @click="addToCart"
        :disable="localStock <= 0"
      >
        Agregar al carrito
      </q-btn>
    </q-card-actions>

    <q-dialog v-model="saleDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Venta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model.number="quantityToBuy"
            type="number"
            label="Cantidad a comprar"
            :max="localStock"
            :min="1"
            @update:model-value="validateQuantity"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Confirmar"
            color="primary"
            @click="confirmSale"
            :disable="!isValidQuantity"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { url } from 'src/boot/ApiServices/api.config';
import apiService from 'src/boot/ApiServices/api.service';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps({
  jewel: {
    type: Object,
    required: true,
    default: () => ({
      _id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image: '',
    }),
  },
});

// Emite eventos al componente padre
const emit = defineEmits(['add-to-cart']);

const defaultImage = 'https://via.placeholder.com/300'; // Imagen por defecto si no hay una definida
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const localStock = ref(props.jewel.stock);
const saleDialog = ref(false);
const quantityToBuy = ref(1);
console.log( user );
// Validación de cantidad
const isValidQuantity = computed(() => quantityToBuy.value > 0 && quantityToBuy.value <= localStock.value);

// Función para obtener la URL de la imagen
const getImageUrl = (imagePath) => {
  if (!imagePath) return defaultImage; // Usa imagen por defecto si no hay imagen
  const imageUrl = `${url}jewelry/${imagePath}`; // Construye la URL con el endpoint correcto
  console.log('URL de la imagen:', imageUrl);
  return imageUrl;
};

// Función para validar la cantidad de venta
const validateQuantity = () => {
  if (quantityToBuy.value < 1) quantityToBuy.value = 1;
  if (quantityToBuy.value > localStock.value) quantityToBuy.value = localStock.value;
};

// Alternar estado de disponibilidad de la joya

// Simulación de eliminación
const deleteJewelry = () => {
  console.log(`Joya "${props.jewel.name}" eliminada`);
};

// Abrir diálogo de venta
const openSaleDialog = () => {
  quantityToBuy.value = 1;
  saleDialog.value = true;
};

// Confirmar venta

const confirmSale = async () => {
  if (isValidQuantity.value) {
    try {
      // Update local stock
      const jewel = { ...props.jewel };
      localStock.value -= quantityToBuy.value;
      
      // Prepare sale data
      const saleData = {
        user_id: user._id, // Assuming the user has an _id
        products: [
          {
            product_id: jewel._id,
            product_model: 'jewelry',
            quantity: quantityToBuy.value,
            price: jewel.price,
          },
        ],
        total: jewel.price * quantityToBuy.value,
      };

      // Send sale data to the server
      await apiService.post('/sells', saleData);
      console.log(`Venta confirmada de ${quantityToBuy.value} unidades de "${props.jewel.name}"`);
      
      // Notify the user of the successful sale
      $q.notify({
        type: 'positive',
        message: `Venta confirmada de ${quantityToBuy.value} unidades de "${props.jewel.name}"`,
      });
    } catch (error) {
      console.error('Error confirmando la venta:', error);
      $q.notify({
        type: 'negative',
        message: 'Error confirmando la venta',
      });
    }
  } else {
    console.error('Cantidad no válida');
    $q.notify({
      type: 'warning',
      message: 'Cantidad no válida',
    });
  }
};
// Agregar al carrito
const addToCart = () => {
  const productToAdd = {
    ...props.jewel,
    quantity: 1, // Añade una cantidad inicial de 1
  };
  emit('add-to-cart', productToAdd); // Emite el evento al componente padre
  console.log(`Agregado al carrito: ${props.jewel.name}`);
};

// Sincronizar cambios en `props.jewel.stock`
watch(
  () => props.jewel.stock,
  (newStock) => {
    localStock.value = newStock;
  }
);

onMounted(() => {
  console.log('Joya recibida:', props.jewel);
});
</script>

<style scoped>
.jewelry-card {
  width: 100%;
  max-width: 300px;
  margin: auto;
  border-radius: 12px;
  overflow: hidden;
}

.jewelry-image {
  height: 250px;
  object-fit: cover;
}
</style>