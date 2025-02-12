<template>
  <q-card class="dress-card">
    <!-- Imagen del vestido -->
    <q-img
      :src="localDress.image || 'https://via.placeholder.com/300'"
      :alt="localDress.name"
      class="dress-image"
    />
    <!-- Información del vestido -->
    <q-card-section>
      <div class="text-h6 text-center">{{ localDress.name }}</div>
      <q-list separator>
        <q-item>
          <q-item-section>Talla:</q-item-section>
          <q-item-section side>{{ localDress.size }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Color:</q-item-section>
          <q-item-section side>{{ localDress.color }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Precio:</q-item-section>
          <q-item-section side>{{ localDress.price }} $</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Disponibilidad:</q-item-section>
          <q-item-section side>
            <q-badge :color="localDress.available ? 'green' : 'red'">
              {{ localDress.available ? 'Disponible' : 'No disponible' }}
            </q-badge>
          </q-item-section>
        </q-item>
        <q-item v-if="localDress.cleaning">
          <q-item-section>Estado:</q-item-section>
          <q-item-section side>
            <q-badge color="orange">En tintorería</q-badge>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Vestido para:</q-item-section>
          <q-item-section side>
            <q-badge :color="localDress.toSell ? 'blue' : 'purple'">
              {{ localDress.toSell ? 'Venta' : 'Renta' }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <!-- Botones de acción -->
    <q-card-actions align="around">
      <q-btn
        color="blue"
        text-color="white"
        @click="updateAvailability(localDress._id)"
        v-if="user && (user.role === 'admin' || user.role === 'user')"
      >
        {{ localDress.available ? 'Marcar como No Disponible' : 'Marcar como Disponible' }}
      </q-btn>
      <q-btn
        color="yellow"
        text-color="black"
        @click="updateCleaning(localDress._id)"
        v-if="user && (user.role === 'admin' || user.role === 'user')"
      >
        {{ localDress.cleaning ? 'Volver a disponibilidad' : 'Marcar en tintorería' }}
      </q-btn>
      <!-- Botón para cambiar a venta -->
      <q-btn
        color="green"
        text-color="white"
        @click="openChangeToSellModal"
        v-if="!localDress.toSell && user && user.role === 'admin'"
      >
        Cambiar a Venta
      </q-btn>
      <!-- Botón para vender -->
      <q-btn
        color="orange"
        text-color="white"
        @click="sellDress"
        v-if="localDress.toSell && user && user.role === 'admin'"
      >
        Vender
      </q-btn>
    </q-card-actions>
    <!-- Mini Modal para cambiar a venta -->
    <q-dialog v-model="changeToSellModal">
      <q-card style="width: 400px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Cambiar a Venta</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newPrice"
            type="number"
            label="Nuevo Precio"
            filled
            :rules="[val => !!val || 'El precio es requerido']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="changeToSellModal = false" />
          <q-btn label="Guardar" color="primary" @click="saveNewPrice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import apiService from 'src/boot/ApiServices/api.service';
import { useQuasar} from 'quasar';
import { url } from 'src/boot/ApiServices/api.config';

const $q = useQuasar();

const props = defineProps({
  dress: {
    type: Object,
    required: true,
  },
});

// Copia local reactiva del vestido para evitar modificar props directamente
const localDress = ref({ ...props.dress });

// Sincronizar cambios si el prop `dress` cambia externamente
watch(
  () => props.dress,
  (newVal) => {
    localDress.value = { ...newVal };
  },
  { deep: true }
);
// Simulación de usuario para pruebas
const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

// Estado del modal para cambiar a venta
const changeToSellModal = ref(false);
const newPrice = ref(null);

// Abrir el modal para cambiar a venta
const openChangeToSellModal = () => {
  newPrice.value = null; // Limpiar el campo de precio
  changeToSellModal.value = true;
};

// Guardar el nuevo precio y cambiar a venta
const saveNewPrice = async () => {
  if (!newPrice.value || isNaN(newPrice.value)) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, ingrese un precio válido.'
    });
    return;
  }

  try {
    await apiService.put(`/dresses/changeToSell/${localDress.value._id}`, {
      toSell: true,
      price: parseFloat(newPrice.value),
    });

    localDress.value.toSell = true;
    localDress.value.price = parseFloat(newPrice.value);
    changeToSellModal.value = false; // Cerrar el modal
    $q.notify({
      type: 'positive',
      message: 'El vestido ha sido marcado para venta.'
    });
  } catch (error) {
    console.error('Error cambiando a venta:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar el vestido a venta'
    });
  }
};

// Cambiar disponibilidad
const updateAvailability = async () => {
  try {
    await apiService.put(`/dresses/changeAvailability/${localDress.value._id}`);
    localDress.value.available = !localDress.value.available; // Actualiza el estado local
    $q.notify({
      type: 'positive',
      message: `Vestido marcado como ${localDress.value.available ? 'disponible' : 'no disponible'}`
    });
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar la disponibilidad'
    });
  }
};

// Cambiar estado de limpieza
const updateCleaning = async () => {
  try {
    await apiService.put(`/dresses/changeCleaning/${localDress.value._id}`);
    localDress.value.cleaning = !localDress.value.cleaning; // Actualiza el estado local
    $q.notify({
      type: 'positive',
      message: `Vestido marcado como ${localDress.value.cleaning ? 'en tintorería' : 'disponible'}`
    });
  } catch (error) {
    console.error('Error actualizando limpieza:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el estado de limpieza'
    });
  }
};

// Vender vestido
const sellDress = async () => {
  try {
    await new Promise((resolve, reject) => {
      $q.dialog({
        title: 'Confirmar venta',
        message: `¿Está seguro de vender el vestido "${localDress.value.name}" por $${localDress.value.price}?`,
        ok: 'Confirmar',
        cancel: 'Cancelar',
        persistent: true
      }).onOk(async () => {
        try {
          const sellData = {
            user_id: user.value._id,
            products: [
              {
                product_id: localDress.value._id,
                product_model: 'dresses',
                quantity: 1,
                price: localDress.value.price,
              },
            ],
            total: localDress.value.price,
          };

          await apiService.post('/sells', sellData);
          $q.notify({
            type: 'positive',
            message: 'Venta realizada con éxito'
          });

          localDress.value.available = false;
          resolve();
        } catch (error) {
          reject(error);
        }
      }).onCancel(() => {
        resolve();
      });
    });
  } catch (error) {
    console.error('Error realizando la venta:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al realizar la venta'
    });
  }
};
const getDressImage = () => {
  const token = localStorage.getItem('token');
  if (localDress.value.image) {
    localDress.value.image = `${url}api/images/dresses/${localDress.value.image}?token=${token}`;
  } else {
    localDress.value.image = 'https://via.placeholder.com/300';
  }
};

onMounted(() => {
  getDressImage();
  console.log('Imagen del vestido:', localDress.value.image);
});


</script>
<style scoped>
.dress-card {
  width: 100%;
  max-width: 300px;
  margin: auto;
  border-radius: 12px;
  overflow: hidden;
}

.dress-image {
  height: 250px;
  object-fit: cover;
}
</style>
