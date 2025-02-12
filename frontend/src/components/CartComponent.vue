<template>
  <div>
    <q-btn fab color="primary" icon="shopping_cart" class="floating-btn" @click="toggleCart" />
    <q-dialog v-model="cartOpen">
      <q-card class="cart-container">
        <q-card-section>
          <div class="text-h6">Carrito de Compras</div>
        </q-card-section>
        <q-card-section v-if="computedCartItems.length">
          <q-list>
            <q-item v-for="item in computedCartItems" :key="item._id" class="cart-item">
              <q-item-section avatar>
                <q-img :src="item.image" class="item-image" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="item-name">{{ item.name }} (x{{ item.quantity }})</q-item-label>
                <q-item-label caption class="item-price">Precio: ${{ item.price }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn icon="remove_circle" color="red" dense @click="removeFromCart(item._id)" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <div class="text-right q-mt-md">Total: ${{ totalPrice }}</div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-center text-grey">El carrito está vacío.</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="cartOpen = false" />
          <q-btn label="Vender" color="green" @click="sellCartItems" :disable="!computedCartItems.length" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue';
import apiService from '../boot/ApiServices/api.service.js'; // Asegúrate de importar tu servicio API
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
    default: () => []
  }
});
const emit = defineEmits(['remove-from-cart', 'clear-cart']);
const cartOpen = ref(false);
const toggleCart = () => {
  cartOpen.value = !cartOpen.value;
};

const removeFromCart = (productId) => {
  emit('remove-from-cart', productId);
};

const computedCartItems = computed(() => props.cartItems);

const totalPrice = computed(() => {
  return computedCartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const sellCartItems = async () => {
  if (!computedCartItems.value.length) return;
  
  const user = localStorage.getItem('user'); // Obtén el usuario desde localStorage
  const user_id = user ? JSON.parse(user)._id : null;
  if (!user_id) {
    console.error('Usuario no autenticado');
    return;
  }
  
  const products = computedCartItems.value.map(item => ({
    product_id: item._id,
    product_model: 'jewelry', // Debe ser 'dresses' o 'jewelry'
    quantity: item.quantity,
    price: item.price * item.quantity
  }));
  
  const saleData = {
    user_id,
    products,
    total: totalPrice.value
  };
  
  try {
    console.log('Enviando venta:', saleData);
    await apiService.post('/sells', saleData);
    $q.notify({
      type: 'positive',
      message: 'Venta realizada con éxito',
      position: 'top'
    });
    emit('clear-cart');
    cartOpen.value = false;
  } catch (error) {
    console.error('Error al procesar la venta:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al procesar la venta',
      position: 'top'
    });
  }
};
</script>


<style scoped>
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.cart-container {
  width: 300px;
}
.cart-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.item-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.item-name {
  font-weight: bold;
}
.item-price {
  color: grey;
}
</style>
