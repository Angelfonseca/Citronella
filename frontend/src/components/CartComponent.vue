<template>
  <div>
    <q-btn fab color="primary" icon="shopping_cart" class="floating-btn" @click="toggleCart" />
    <q-dialog v-model="cartOpen">
      <q-card class="cart-container">
        <q-card-section>
          <div class="text-h6">Carrito de Compras</div>
        </q-card-section>
        <q-card-section v-if="cartItems.length">
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
        </q-card-section>
        <q-card-section v-else>
          <div class="text-center text-grey">El carrito está vacío.</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="cartOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props recibidos desde el componente padre
const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Controlador del diálogo del carrito
const cartOpen = ref(false);
const toggleCart = () => {
  cartOpen.value = !cartOpen.value;
};

// Función para eliminar un producto del carrito
const removeFromCart = (productId) => {
  emit('remove-from-cart', productId);
};

// Exponer las funciones para ser usadas por componentes padres
const emit = defineEmits(['remove-from-cart']);

// Computar los elementos del carrito para asegurar reactividad
const computedCartItems = computed(() => props.cartItems);
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