<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import FeedbackModal from "../../components/FeedbackModal.vue";

const propostas = ref([]);

const showDetalhes = ref(false);
const propostaDetalhe = ref(null);

const showModal = ref(false);
const modalTitulo = ref("Sucesso");
const modalMensagem = ref("");

async function carregar() {
  propostas.value = (await api.get("/propostas")).data;
}

function verDetalhes(p) {
  propostaDetalhe.value = p;
  showDetalhes.value = true;
}

function abrirModal(msg) {
  modalMensagem.value = msg;
  showModal.value = true;
}

onMounted(async () => {
  await carregar();
  abrirModal("Lista global de propostas carregada.");
});
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h4 class="mb-0">Propostas (visão global)</h4>
    <button class="btn btn-outline-secondary btn-sm" @click="carregar">Recarregar</button>
  </div>

  <table class="table table-striped table-hover align-middle">
    <thead class="table-light">
      <tr>
        <th>Título</th>
        <th>Orientador</th>
        <th style="width: 140px;">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in propostas" :key="p.id">
        <td>{{ p.titulo }}</td>
        <td>{{ p.orientador }}</td>
        <td>
          <button class="btn btn-sm btn-info" @click="verDetalhes(p)">
            Ver detalhes
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Modal Detalhes -->
  <div v-if="showDetalhes">
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalhes da Proposta</h5>
            <button class="btn-close" @click="showDetalhes = false"></button>
          </div>
          <div class="modal-body" v-if="propostaDetalhe">
            <p><strong>Título:</strong> {{ propostaDetalhe.titulo }}</p>
            <p><strong>Orientador:</strong> {{ propostaDetalhe.orientador }}</p>
            <hr />
            <p class="mb-1"><strong>Descrição:</strong></p>
            <p style="white-space: pre-wrap">{{ propostaDetalhe.descricao }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDetalhes = false">Fechar</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>

  <FeedbackModal
    :show="showModal"
    :titulo="modalTitulo"
    :mensagem="modalMensagem"
    @close="showModal = false"
  />
</template>
