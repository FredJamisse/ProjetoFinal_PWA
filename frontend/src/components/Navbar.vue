<script setup>
import { auth } from "../store/auth";
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
  auth.logout();
  router.push("/");
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">

      <!--  Branding -->
      <router-link
        to="/"
        class="navbar-brand fw-semibold"
      >
        Propostas de Projeto Final
      </router-link>

      <!--  Navegação -->
      <div class="navbar-nav me-auto ms-3 align-items-center">

  <!-- Docente -->
  <router-link
    v-if="auth.user?.role === 'DOCENTE'"
    to="/propostas"
    class="nav-link"
  >
    Gerir Minhas Propostas
  </router-link>

  <!-- Admin -->
  <router-link
    v-if="auth.user?.role === 'ADMIN'"
    to="/admin"
    class="nav-link"
  >
    Administração
  </router-link>
</div>

      

      <!--  Área do utilizador -->
      <div class="d-flex align-items-center gap-3">

        <!-- Nome do utilizador -->
        <span
          v-if="auth.user"
          class="text-light small fst-italic"
        >
          {{ auth.user.nome }}
        </span>

        <!-- Login -->
        <router-link
          v-if="!auth.user"
          to="/login"
          class="btn btn-outline-light btn-sm"
        >
          Login
        </router-link>

        <!-- Logout -->
        <button
          v-else
          class="btn btn-outline-warning btn-sm"
          @click="logout"
        >
          Logout
        </button>
      </div>

    </div>
  </nav>
</template>
