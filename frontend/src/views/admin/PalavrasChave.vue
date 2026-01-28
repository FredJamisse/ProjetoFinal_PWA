<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { auth } from "../../store/auth";
import FeedbackModal from "../../components/FeedbackModal.vue";

const palavras = ref([]);

const termo = ref("");

const showModal = ref(false);
const modalTitulo = ref("Sucesso");
const modalMensagem = ref("");

async function carregar() {
  palavras.value = (await api.get("/palavras-chave")).data;
}

function abrirModal(msg) {
  modalMensagem.value = msg;
  showModal.value = true;
}

async function criar() {
  if (!termo.value) {
    abrirModal("Digite o termo da palavra-chave.");
    return;
  }

  await api.post(
    "/palavras-chave",
    { termo: termo.value },
    { headers: { "x-user-role": auth.user.role } }
  );

  abrirModal("Palavra-chave criada com sucesso.");
  termo.value = "";
  await carregar();
}

async function apagar(id) {
  if (!confirm("Deseja apagar esta palavra-chave?")) return;

  await api.delete(`/palavras-chave/${id}`, {
    headers: { "x-user-role": auth.user.role }
  });

  abrirModal("Palavra-chave apagada com sucesso.");
  await carregar();
}

onMounted(carregar);
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4 class="mb-0">Palavras-chave</h4>
    <button class="btn btn-outline-secondary btn-sm" @click="carregar">Recarregar</button>
  </div>

  <div class="card mb-3 shadow-sm">
    <div class="card-header fw-bold">Adicionar Palavra-chave</div>
    <div class="card-body">
      <div class="row g-2">
        <div class="col-md-8">
          <label class="form-label">Termo</label>
          <input v-model="termo" class="form-control" placeholder="Ex: Sistemas Web" />
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-success w-100" @click="criar">Criar</button>
        </div>
      </div>
    </div>
  </div>

  <table class="table table-bordered table-hover align-middle">
    <thead class="table-light">
      <tr>
        <th>Termo</th>
        <th style="width: 110px;">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in palavras" :key="p.id">
        <td>{{ p.termo }}</td>
        <td>
          <button class="btn btn-sm btn-danger" @click="apagar(p.id)">Apagar</button>
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
