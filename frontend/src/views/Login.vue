<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { auth } from "../store/auth";

const email = ref("");
const password = ref("");
const erro = ref("");
const loading = ref(false);

const router = useRouter();

async function login() {
  erro.value = "";
  loading.value = true;

  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value
    });

    auth.login(res.data);

if (res.data.role === "ADMIN") {
  router.push("/admin");
} else if (res.data.role === "DOCENTE") {
  router.push("/propostas");
} else {
  router.push("/");
}

  } catch (e) {
    erro.value = "Email ou palavra-passe inválidos.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card shadow-sm" style="width: 100%; max-width: 420px; background-color: #212529;">
      <div class="card-body">

        <!-- TÍTULO -->
        <h4 class="text-center mb-1 text-white">Propostas de Projeto</h4>
        <p class="text-center text-white mb-4">
          Acesso ao Sistema
        </p>

        <!-- FORM -->
        <div class="mb-3">
          <label class="form-label text-white">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="exemplo@gmail.com"
          />
        </div>

        <div class="mb-3">
          <label class="form-label text-white">Palavra-passe</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
          />
        </div>

        <!-- ERRO -->
        <div v-if="erro" class="alert alert-danger py-2">
          {{ erro }}
        </div>

        <!-- BOTÃO -->
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="login"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Entrar
        </button>

      </div>
    </div>
  </div>
</template>