<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Navbar />

  <div class="container mt-4" style="min-height: 90vh;">
    <router-view />
  </div>

  <Footer />
</template>
