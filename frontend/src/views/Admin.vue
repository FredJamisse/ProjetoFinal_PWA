<template>
  <div>
  <h3>Administração</h3>

  <div class="card mb-4">
    <div class="card-header fw-bold">Criar Docente</div>
    <div class="card-body row g-2">
      <div class="col-md-6">
        <label class="form-label">Nome</label>
        <input v-model="nome" class="form-control" />
      </div>
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input v-model="email" class="form-control" />
      </div>
      <div class="col-md-6">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" />
      </div>
      <div class="col-md-6">
        <label class="form-label">Perfil</label>
        <select v-model="role" class="form-select">
          <option value="DOCENTE">Docente</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <div class="col-12">
        <button class="btn btn-success" @click="addUser">Criar Docente</button>
      </div>
    </div>
  </div>

  <FeedbackModal
    :show="showModal"
    :titulo="modalTitulo"
    :mensagem="modalMensagem"
    @close="showModal = false"
  />
  </div>
</template>


<script setup>
import { ref } from "vue";
import api from "../services/api";
import { auth } from "../store/auth";
import FeedbackModal from "../components/FeedbackModal.vue";

const nome = ref("");
const email = ref("");
const password = ref("");
const role = ref("DOCENTE");

const showModal = ref(false);
const modalTitulo = ref("");
const modalMensagem = ref("");

async function addUser() {
  await api.post(
    "/users",
    { nome: nome.value, email: email.value, password: password.value, role: role.value },
    { headers: { "x-user-role": auth.user.role } }
  );

  modalTitulo.value = "Sucesso";
  modalMensagem.value = "Docente criado com sucesso.";
  showModal.value = true;

  nome.value = email.value = password.value = "";
}

</script>
