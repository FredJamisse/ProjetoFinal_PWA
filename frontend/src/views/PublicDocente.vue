<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const route = useRoute();
const router = useRouter();

const docente = ref({});
const propostas = ref([]);

const showDetalhes = ref(false);
const detalhes = ref(null);


async function carregar() {
  docente.value = (await api.get(`/public/docentes/${route.params.id}`)).data;
  propostas.value = (await api.get(`/public/docentes/${route.params.id}/propostas`)).data;
}

async function verDetalhes(p) {
  const res = await api.get(`/public/propostas/${p.id}/detalhes`);
  detalhes.value = res.data;
  showDetalhes.value = true;
}

function voltar() {
  router.push("/");
}

onMounted(carregar);
</script>

<template>
  <!-- CABEÇALHO DO DOCENTE -->
<div class="mb-4">

  <!-- Voltar -->
  <router-link
    to="/"
    class="btn btn-link p-0 mb-2"
  >
    ← Voltar às Propostas
  </router-link>

  <!-- Nome do docente -->
  <h3 class="mb-1">
    {{ docente.nome }}
  </h3>

  <!-- Subtítulo -->
  <p class="text-muted mb-2">
    Propostas de Projeto Final
  </p>

  <!-- Contador -->
  <span class="badge bg-secondary">
    {{ propostas.length }} proposta<span v-if="propostas.length !== 1">s</span>
  </span>
</div>

<hr />


  <!-- Propostas -->
  <h5 class="mb-3">Propostas disponíveis</h5>

<table class="table table-hover align-middle">
  <thead class="table-light">
    <tr>
      <th>Título da Proposta</th>
      <th style="width: 160px;">Data</th>
      <th style="width: 160px;">Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="p in propostas" :key="p.id">
      <td>{{ p.titulo }}</td>
      <td class="text-muted">
        {{ new Date(p.created_at).toLocaleDateString() }}
      </td>
      <td>
        <button class="btn btn-outline-primary btn-sm" @click="verDetalhes(p)">
          Ver detalhes
        </button>
      </td>
    </tr>

    <tr v-if="propostas.length === 0">
      <td colspan="3" class="text-center text-muted py-4">
        Este docente ainda não possui propostas públicas.
      </td>
    </tr>
  </tbody>
</table>


  <!-- Modal Detalhes -->
  <div v-if="showDetalhes">
    <div class="modal fade show d-block">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ detalhes.titulo }}</h5>
            <button class="btn-close" @click="showDetalhes = false"></button>
          </div>

          <div class="modal-body">
            <p>
              <strong>Orientador:</strong>
              {{ detalhes.orientador }}
            </p>

            <hr />

<div class="mb-3">
  <div class="fw-bold">Coorientadores</div>

  <ul class="mb-0" v-if="detalhes.coorientadores?.length">
    <li v-for="c in detalhes.coorientadores" :key="c.id">
      {{ c.nome }}
      <span class="text-muted">({{ c.email }})</span>
    </li>
  </ul>

  <div class="text-muted" v-else>
    Sem coorientadores associados.
  </div>
</div>


            <hr />

            <p class="fw-bold mb-1">Descrição e Objetivos</p>
            <p style="white-space: pre-wrap">{{ detalhes.descricao }}</p>

            <hr />

            <div>
              <strong>Palavras-chave</strong>
              <div class="mt-1">
                <span
                  v-for="p in detalhes.palavras"
                  :key="p.termo"
                  class="badge bg-secondary me-1"
                >
                  {{ p.termo }}
                </span>

                <span v-if="!detalhes.palavras.length" class="text-muted">
                  Sem palavras-chave associadas.
                </span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDetalhes = false">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>
