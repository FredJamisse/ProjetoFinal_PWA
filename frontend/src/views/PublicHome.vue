<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const docentes = ref([]);
const palavras = ref([]);

const pesquisa = ref("");
const palavraSelecionada = ref("");

async function carregar() {
  docentes.value = (await api.get("/public/docentes")).data;
  palavras.value = (await api.get("/public/palavras-chave")).data;
}

function verDocente(d) {
  router.push(`/docentes/${d.id}`);
}

/* 🔎 Filtro combinado */
const docentesFiltrados = computed(() => {
  return docentes.value.filter(d => {
    const matchPesquisa =
      d.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
      d.email.toLowerCase().includes(pesquisa.value.toLowerCase());

    const matchPalavra =
      !palavraSelecionada.value ||
      d.palavrasChave?.includes(palavraSelecionada.value);

    return matchPesquisa && matchPalavra;
  });
});

onMounted(carregar);
</script>

<template>
  <div>
  <h3 class="mb-3">Propostas de Projeto Final</h3>
  <p class="text-muted">
    Consulte os docentes com propostas disponíveis e explore os temas sugeridos.
  </p>

  <!-- Filtros -->
  <div class="card mb-4 shadow-sm">
    <div class="card-body row g-3">
      <div class="col-md-6">
        <label class="form-label">Pesquisar docente</label>
        <input
          v-model="pesquisa"
          class="form-control"
          placeholder="Nome ou email do docente"
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Filtrar por palavra-chave</label>
        <select v-model="palavraSelecionada" class="form-select">
          <option value="">Todas</option>
          <option v-for="p in palavras" :key="p.id" :value="p.termo">
            {{ p.termo }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <!-- Tabela -->
  <table class="table table-hover align-middle">
    <thead class="table-light">
      <tr>
        <th>Docente</th>
        <th>Email</th>
        <th>Nº de Propostas</th>
        <th style="width: 160px;">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in docentesFiltrados" :key="d.id">
        <td>{{ d.nome }}</td>
        <td class="text-muted">{{ d.email }}</td>
        <td>
          <span class="badge bg-primary">
            {{ d.totalPropostas }}
          </span>
        </td>
        <td>
          <button class="btn btn-outline-primary btn-sm" @click="verDocente(d)">
            Ver propostas
          </button>
        </td>
      </tr>

      <tr v-if="docentesFiltrados.length === 0">
        <td colspan="4" class="text-center text-muted py-4">
          Nenhum docente encontrado com os critérios selecionados.
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>
