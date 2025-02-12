<template>
  <q-layout view="lHh Lpr lFf">
    <Sidebar :isActive="isActive" :toggleSidebar="toggleSidebar" />
    <q-btn flat round dense @click="toggleSidebar" class="toggle-btn bg-white text-primary shadow-2"
      style="position: fixed; top: 10px; left: 10px; z-index: 9999;" :aria-label="$t('components.lateralNavigation.toggleSidebar')">
      <q-icon :name="isActive ? 'chevron_left' : 'chevron_right'" />
    </q-btn>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from 'src/components/LateralNavigation.vue';



const isActive = ref(false);

const toggleSidebar = () => {
  isActive.value = !isActive.value;
};
</script>