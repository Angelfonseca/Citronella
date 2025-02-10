<template>
    <q-page padding>
      <q-card class="q-pa-md">
        <q-tabs v-model="tab" dense class="text-primary">
          <q-tab name="usuarios" label="Gestión de Usuarios" />
          <q-tab name="ventas" label="Total de Rentas por Mes" />
          <q-tab name="listaNegra" label="Lista Negra" />
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
                <q-select v-model="selectedUserId" :options="users" label="Seleccionar Usuario" option-label="name" option-value="_id" />
                <q-btn label="Eliminar" color="negative" @click="handleDeleteUser" class="q-mt-md" />
              </q-card-section>
            </q-card>
            <q-card v-if="showModifyForm" class="q-mt-md">
              <q-card-section>
                <q-select v-model="selectedUserId" :options="users" label="Seleccionar Usuario" option-label="name" option-value="_id" @update:model-value="fetchUserData" />
                <q-input v-model="selectedUser.name" label="Nombre" />
                <q-input v-model="selectedUser.username" label="Nombre de Usuario" />
                <q-input v-model="selectedUser.password" label="Contraseña" type="password" />
                <q-select v-model="selectedUser.role" :options="roles" label="Rol" />
                <q-btn label="Modificar" color="secondary" @click="handleModifyUser" class="q-mt-md" />
              </q-card-section>
            </q-card>
          </q-tab-panel>
  
          <!-- Total de Rentas por Mes -->
          <q-tab-panel name="ventas">
            <q-input filled v-model="selectedMonthYear" type="month" label="Selecciona Mes y Año" class="q-mb-md" />
            <q-btn label="Consultar Rentas" color="primary" @click="handleSalesFormSubmit" />
            <q-table
              v-if="showAdminTable"
              :rows="sells"
              :columns="columns"
              row-key="_id"
            />
            <p v-if="showAdminTable">Total Sales Amount: {{ totalSalesAmount }}</p>
            <q-table
              v-if="showAdminTable"
              :rows="jewsells"
              :columns="columns"
              row-key="_id"
            />
            <p v-if="showAdminTable">Total Jewelry Sales Amount: {{ totalJewelrySalesAmount }}</p>
          </q-tab-panel>
  
          <!-- Lista Negra -->
          <q-tab-panel name="listaNegra">
            <q-input v-model="blacklistName" label="Nombre" class="q-mb-md" />
            <q-input v-model="blacklistDescription" label="Descripción" class="q-mb-md" />
            <q-btn label="Añadir" color="negative" @click="addToBlacklist" />
            <q-list bordered separator class="q-mt-md">
              <q-item v-for="buyer in blacklist" :key="buyer._id">
                <q-item-section>
                  <q-item-label>{{ buyer.name }}</q-item-label>
                  <q-item-label caption>{{ buyer.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="delete" color="negative" dense @click="removeFromBlacklist(buyer._id)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-page>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tab: 'usuarios',
        showUserForm: false,
        showDeleteForm: false,
        showModifyForm: false,
        showAdminTable: false,
        userFormData: { name: '', username: '', password: '', role: 'user' },
        users: [
          { _id: '1', name: 'Juan Pérez', username: 'juanp', role: 'user' },
          { _id: '2', name: 'Ana Gómez', username: 'anag', role: 'admin' }
        ],
        selectedUserId: '',
        selectedUser: null,
        selectedMonthYear: '',
        sells: [
          { _id: '1', user_id: '1', dress_id: '1', total: 100, rentalDate: '2023-01-01', returnDate: '2023-01-10' }
        ],
        jewsells: [
          { _id: '1', user_id: '2', dress_id: '2', total: 200, rentalDate: '2023-02-01', returnDate: '2023-02-10' }
        ],
        totalSalesAmount: 100,
        totalJewelrySalesAmount: 200,
        blacklistName: '',
        blacklistDescription: '',
        blacklist: [
          { _id: '1', name: 'Carlos Ruiz', description: 'No devolvió el vestido a tiempo' }
        ],
        roles: [ { label: 'Admin', value: 'admin' }, { label: 'Usuario', value: 'user' } ],
        columns: [
          { name: '_id', label: 'ID', field: '_id' },
          { name: 'user_id', label: 'User ID', field: 'user_id' },
          { name: 'dress_id', label: 'Dress ID', field: 'dress_id' },
          { name: 'total', label: 'Total', field: 'total' },
          { name: 'rentalDate', label: 'Rental Date', field: 'rentalDate' },
          { name: 'returnDate', label: 'Return Date', field: 'returnDate' }
        ]
      };
    },
    methods: {
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
      },
      fetchUsers() {
        // Simulación de llamada al backend
        console.log('Fetching users...');
      },
      fetchUserData() {
        this.selectedUser = this.users.find(user => user._id === this.selectedUserId);
      },
      handleUserFormSubmit() {
        // Simulación de llamada al backend
        console.log('User saved:', this.userFormData);
      },
      handleDeleteUser() {
        // Simulación de llamada al backend
        console.log('User deleted:', this.selectedUserId);
      },
      handleModifyUser() {
        // Simulación de llamada al backend
        console.log('User modified:', this.selectedUser);
      },
      handleSalesFormSubmit() {
        this.showAdminTable = true;
      },
      addToBlacklist() {
        // Simulación de llamada al backend
        console.log('Added to blacklist:', this.blacklistName, this.blacklistDescription);
      },
      removeFromBlacklist(id) {
        // Simulación de llamada al backend
        console.log('Removed from blacklist:', id);
      }
    }
  };
  </script>