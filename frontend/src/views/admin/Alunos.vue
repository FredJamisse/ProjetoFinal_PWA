<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { auth } from "../../store/auth";
import FeedbackModal from "../../components/FeedbackModal.vue";

const alunos = ref([]);

const nome = ref("");
const email = ref("");

const showModal = ref(false);
const modalTitulo = ref("Sucesso");
const modalMensagem = ref("");

async function carregar() {
  alunos.value = (await api.get("/alunos")).data;
}

function abrirModal(msg) {
  modalMensagem.value = msg;
  showModal.value = true;
}

async function criar() {
  if (!nome.value || !email.value) {
    abrirModal("Preencha nome e email do aluno.");
    return;
  }

  await api.post(
    "/alunos",
    { nome: nome.value, email: email.value },
    { headers: { "x-user-role": auth.user.role } }
  );

  abrirModal("Aluno criado com sucesso.");
  nome.value = "";
  email.value = "";
  await carregar();
}

async function apagar(id) {
  if (!confirm("Deseja apagar este aluno?")) return;

  await api.delete(`/alunos/${id}`, {
    headers: { "x-user-role": auth.user.role }
  });

  abrirModal("Aluno apagado com sucesso.");
  await carregar();
}

onMounted(carregar);
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4 class="mb-0">Alunos</h4>
    <button class="btn btn-outline-secondary btn-sm" @click="carregar">Recarregar</button>
  </div>

  <div class="card mb-3 shadow-sm">
    <div class="card-header fw-bold">Adicionar Aluno</div>
    <div class="card-body">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="form-label">Nome</label>
          <input v-model="nome" class="form-control" placeholder="Ex: João Matola" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input v-model="email" class="form-control" placeholder="ex: joao@estudante.mz" />
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
        <th style="width: 110px;">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="a in alunos" :key="a.id">
        <td>{{ a.nome }}</td>
        <td>{{ a.email }}</td>
        <td>
          <button class="btn btn-sm btn-danger" @click="apagar(a.id)">Apagar</button>
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
