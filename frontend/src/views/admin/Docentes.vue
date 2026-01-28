<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { auth } from "../../store/auth";
import FeedbackModal from "../../components/FeedbackModal.vue";

const docentes = ref([]);

const nome = ref("");
const email = ref("");
const password = ref("");
const role = ref("DOCENTE");

const showModal = ref(false);
const modalTitulo = ref("Sucesso");
const modalMensagem = ref("");

async function carregar() {
  docentes.value = (await api.get("/users")).data;
}

function abrirModal(msg) {
  modalMensagem.value = msg;
  showModal.value = true;
}

async function criar() {
  if (!nome.value || !email.value || !password.value) {
    abrirModal("Preencha nome, email e password.");
    return;
  }

  await api.post(
    "/users",
    { nome: nome.value, email: email.value, password: password.value, role: role.value },
    { headers: { "x-user-role": auth.user.role } }
  );

  abrirModal("Docente criado com sucesso.");
  nome.value = "";
  email.value = "";
  password.value = "";
  role.value = "DOCENTE";
  await carregar();
}

async function apagar(id) {
  if (!confirm("Deseja apagar este docente?")) return;

  await api.delete(`/users/${id}`, {
    headers: { "x-user-role": auth.user.role }
  });

  abrirModal("Docente apagado com sucesso.");
  await carregar();
}

onMounted(carregar);
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4 class="mb-0">Docentes</h4>
    <button class="btn btn-outline-secondary btn-sm" @click="carregar">Recarregar</button>
  </div>

  <div class="card mb-3 shadow-sm">
    <div class="card-header fw-bold">Adicionar Docente</div>
    <div class="card-body">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="form-label">Nome Completo</label>
          <input v-model="nome" class="form-control" placeholder="Ex: Ana Silva" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input v-model="email" class="form-control" placeholder="ex: ana@gmail.com" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="********" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Perfil</label>
          <select v-model="role" class="form-select">
            <option value="DOCENTE">DOCENTE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div class="col-12">
          <button class="btn btn-success" @click="criar">Criar</button>
        </div>
      </div>
    </div>
  </div>

  <table class="table table-bordered table-hover align-middle">
    <thead class="table-light">
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Perfil</th>
        <th style="width: 110px;">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in docentes" :key="d.id">
        <td>{{ d.nome }}</td>
        <td>{{ d.email }}</td>
        <td><span class="badge bg-secondary">{{ d.role }}</span></td>
        <td>
          <button class="btn btn-sm btn-danger" @click="apagar(d.id)">Apagar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <FeedbackModal
    :show="showModal"
    :titulo="modalTitulo"
    :mensagem="modalMensagem"
    @close="showModal = false"
  />
</template>
