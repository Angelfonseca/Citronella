<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-tabs v-model="tab" dense class="text-primary">
        <q-tab name="usuarios" label="Gestión de Usuarios" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <!-- Gestión de Usuarios -->
        <q-tab-panel name="usuarios">
          <q-btn-group spread>
            <q-btn label="Añadir Usuario" @click="showAddUserForm" />
            <q-btn label="Eliminar Usuario" @click="showDeleteUserForm" />
            <q-btn label="Modificar Usuario" @click="showModifyUserForm" />
          </q-btn-group>

          <q-card v-if="showUserForm" class="q-mt-md">
            <q-card-section>
              <q-input v-model="userFormData.name" label="Nombre" />
              <q-input v-model="userFormData.username" label="Nombre de Usuario" />
              <q-input v-model="userFormData.password" label="Contraseña" type="password" />
                <q-select v-model="userFormData.role" :options="roles" label="Rol" />

              <q-btn label="Guardar" color="primary" @click="handleUserFormSubmit" class="q-mt-md" />
            </q-card-section>
          </q-card>

          <q-card v-if="showDeleteForm" class="q-mt-md">
            <q-card-section>
              <q-select v-model="selectedUserId" :options="users" label="Seleccionar Usuario" option-label="name"
                option-value="_id" />
              <q-btn label="Eliminar" color="negative" @click="handleDeleteUser" class="q-mt-md" />
            </q-card-section>
          </q-card>

          <q-card v-if="showModifyForm" class="q-mt-md">
            <q-card-section>
              <q-select v-model="selectedUserId" :options="users" label="Seleccionar Usuario" option-label="name"
                option-value="_id" @update:model-value="fetchUserData" />
              <q-input v-model="selectedUser.name" label="Nombre" />
              <q-input v-model="selectedUser.username" label="Nombre de Usuario" />
              <q-input v-model="selectedUser.password" label="Contraseña" type="password" />
                <q-select v-model="selectedUser.role" :options="roles" label="Rol" :option-value="rol => rol.value" />
              <q-btn label="Modificar" color="secondary" @click="handleModifyUser" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import apiService from 'src/boot/ApiServices/api.service';
import checkLoggedIn from 'src/boot/auth';

// Verificar si el usuario está autenticado
checkLoggedIn();
const user = JSON.parse(localStorage.getItem('user'));

if (user.role !== 'admin') {
  this.$router.push('/');
}
export default {
  data() {
    return {
      tab: 'usuarios',
      showUserForm: false,
      showDeleteForm: false,
      showModifyForm: false,
      users: [],
      selectedUserId: '',
      selectedUser: {},
      userFormData: { name: '', username: '', password: '', role: 'user' },
      roles: [
        { label: 'Admin', value: 'admin' },
        { label: 'Usuario', value: 'user' },
      ],
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await apiService.get('/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.$q.notify({
          color: 'negative',
          message: 'Error al cargar usuarios',
          icon: 'error'
        });
      }
    },
    async handleUserFormSubmit() {
      try {
        this.userFormData.role = this.userFormData.role.value;
        await apiService.post('/users', this.userFormData);
        this.fetchUsers();
        this.showUserForm = false;
        this.$q.notify({
          color: 'positive',
          message: 'Usuario creado exitosamente',
          icon: 'check_circle'
        });
      } catch (error) {
        console.error('Error creating user:', error);
        this.$q.notify({
          color: 'negative',
          message: 'Error al crear usuario',
          icon: 'error'
        });
      }
    },
    async handleDeleteUser() {
  try {
    await apiService.delete(`/users/${this.selectedUserId._id}`);
    this.fetchUsers();
    this.showDeleteForm = false;
    this.$q.notify({
      color: 'positive',
      message: 'Usuario eliminado exitosamente',
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    this.$q.notify({
      color: 'negative',
      message: 'Error al eliminar usuario',
      icon: 'error'
    });
  }
},
    async fetchUserData() {
      if (!this.selectedUserId) return;
      try {
        const response = await apiService.get(`/users/${this.selectedUserId._id}`);
        this.selectedUser = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.$q.notify({
          color: 'negative',
          message: 'Error al cargar datos del usuario',
          icon: 'error'
        });
      }
    },
    async handleModifyUser() {
      try {
        this.selectedUser.role = this.selectedUser.role.value;
        await apiService.put(`/users/${this.selectedUserId._id}`, this.selectedUser);
        this.fetchUsers();
        this.showModifyForm = false;
        this.$q.notify({
          color: 'positive',
          message: 'Usuario modificado exitosamente',
          icon: 'check_circle'
        });
      } catch (error) {
        console.error('Error modifying user:', error);
        this.$q.notify({
          color: 'negative',
          message: 'Error al modificar usuario',
          icon: 'error'
        });
      }
    },
    showAddUserForm() {
      this.showUserForm = true;
      this.showDeleteForm = this.showModifyForm = false;
    },
    showDeleteUserForm() {
      this.showDeleteForm = true;
      this.showUserForm = this.showModifyForm = false;
      this.fetchUsers();
    },
    showModifyUserForm() {
      this.showModifyForm = true;
      this.showUserForm = this.showDeleteForm = false;
      this.fetchUsers();
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>
