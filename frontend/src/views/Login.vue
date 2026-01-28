<template>
  <div class="card p-4">
    <h3>Login</h3>

    <input
      v-model="email"
      class="form-control mb-2"
      placeholder="Email"
    />

    <input
      v-model="password"
      type="password"
      class="form-control mb-2"
      placeholder="Password"
    />

    <button class="btn btn-primary" @click="login">
      Entrar
    </button>

    <p v-if="error" class="text-danger mt-2">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { auth } from "../store/auth";

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

async function login() {
  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value
    });
auth.login(res.data);
router.push("/");
  
    if (auth.user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/propostas");
    }
  } catch (e) {
    error.value = "Credenciais inválidas";
  }
}
</script>
