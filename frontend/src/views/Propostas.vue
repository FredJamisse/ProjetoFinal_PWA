<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { auth } from "../store/auth";
import FeedbackModal from "../components/FeedbackModal.vue";

/* ======================
   Estado geral
====================== */
const propostas = ref([]);
const docentes = ref([]);
const alunosList = ref([]);
const palavras = ref([]);

/* ======================
   Estado da vista
====================== */
const modoFormulario = ref(false); // false = lista | true = form
const modoEdicao = ref(false);
const propostaId = ref(null);
const erroFormulario = ref("");


/* ======================
   Campos do formulário
====================== */
const titulo = ref("");
const descricao = ref("");
const coorientadores = ref([]);
const alunos = ref([]);
const palavrasChave = ref([]);

/* ======================
   Modal feedback
====================== */
const showModal = ref(false);
const modalTitulo = ref("");
const modalMensagem = ref("");

/* ======================
   Modal detalhes
====================== */
const showDetalhes = ref(false);
const detalhes = ref(null);

/* ======================
   Modal apagar
====================== */
const showConfirmDelete = ref(false);
const propostaParaApagar = ref(null);

/* ======================
   Carregar dados
====================== */
async function carregarDados() {
  propostas.value = (await api.get(`/propostas/docente/${auth.user.id}`)).data;
  docentes.value = (await api.get("/users")).data.filter(
    u => u.role === "DOCENTE" && u.id !== auth.user.id
  );
  alunosList.value = (await api.get("/alunos")).data;
  palavras.value = (await api.get("/palavras-chave")).data;
}

/* ======================
   Navegação
====================== */
function abrirCriacao() {
  limparFormulario();
  modoFormulario.value = true;
  modoEdicao.value = false;
}

function voltarLista() {
  modoFormulario.value = false;
  modoEdicao.value = false;
  limparFormulario();
}

/* ======================
   CRUD
====================== */
async function guardar() {
  erroFormulario.value = "";

  // VALIDAÇÃO
  if (!titulo.value.trim() || !descricao.value.trim()) {
    erroFormulario.value =
      "Por favor, preencha o título e a descrição da proposta.";
    return; // BLOQUEIA submissão
  }
  const payload = {
    titulo: titulo.value,
    descricao: descricao.value,
    orientadorId: auth.user.id,
    coorientadores: coorientadores.value,
    alunos: alunos.value,
    palavrasChave: palavrasChave.value
  };

  if (modoEdicao.value) {
    await api.put(`/propostas/${propostaId.value}`, payload);
    modalMensagem.value = "Proposta atualizada com sucesso.";
  } else {
    await api.post("/propostas", payload);
    modalMensagem.value = "Proposta criada com sucesso.";
  }

  modalTitulo.value = "Sucesso";
  showModal.value = true;

  await carregarDados();
  voltarLista();
}

function editar(p) {
  modoFormulario.value = true;
  modoEdicao.value = true;
  propostaId.value = p.id;

  titulo.value = p.titulo;
  descricao.value = p.descricao;
}

async function verDetalhes(p) {
  const res = await api.get(`/propostas/${p.id}/detalhes`);
  detalhes.value = res.data;
  showDetalhes.value = true;
}

function confirmarApagar(p) {
  propostaParaApagar.value = p;
  showConfirmDelete.value = true;
}

async function apagarConfirmado() {
  await api.delete(`/propostas/${propostaParaApagar.value.id}`);

  modalTitulo.value = "Sucesso";
  modalMensagem.value = "Proposta apagada com sucesso.";
  showModal.value = true;

  showConfirmDelete.value = false;
  propostaParaApagar.value = null;

  carregarDados();
}

/* ======================
   Utilitários
====================== */
function limparFormulario() {
  titulo.value = "";
  descricao.value = "";
  coorientadores.value = [];
  alunos.value = [];
  palavrasChave.value = [];
  propostaId.value = null;
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-PT");
}

onMounted(carregarDados);
</script>

<template>
  <!-- CABEÇALHO -->
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>Gerir Minhas Propostas</h3>

    <button
      v-if="!modoFormulario"
      class="btn btn-success"
      @click="abrirCriacao"
    >
      + Adicionar Nova Proposta
    </button>
  </div>

  <!-- LISTA -->
  <div v-if="!modoFormulario">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Título</th>
          <th>Data</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in propostas" :key="p.id">
          <td>{{ p.titulo }}</td>
          <td>{{ formatarData(p.created_at) }}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
  <button
    class="btn btn-outline-primary"
    title="Ver detalhes"
    @click="verDetalhes(p)"
  >
    <i class="bi bi-eye"></i>
  </button>

  <button
    class="btn btn-outline-warning"
    title="Editar proposta"
    @click="editar(p)"
  >
    <i class="bi bi-pencil"></i>
  </button>

  <button
    class="btn btn-outline-danger"
    title="Apagar proposta"
    @click="confirmarApagar(p)"
  >
    <i class="bi bi-trash"></i>
  </button>
</div>

          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- FORMULÁRIO -->
  <div v-else>
    <button class="btn btn-link mb-3" @click="voltarLista">
      ← Voltar à lista
    </button>

    <h4>{{ modoEdicao ? "Editar Proposta" : "Nova Proposta" }}</h4>

    <div class="card">
      <div class="card-body">
        <label class="form-label">Título</label>
        <input v-model="titulo" class="form-control mb-3"
        :class="{ 'is-invalid': erroFormulario && !titulo.trim() }"
        />

        <label class="form-label">Descrição e Objetivos</label>
        <textarea v-model="descricao" class="form-control mb-3" rows="4"
        :class="{ 'is-invalid': erroFormulario && !descricao.trim() }"
        />

        <div class="row">
          <div class="col-md-4">
            <label>Coorientadores</label>
            <select v-model="coorientadores" multiple class="form-select">
              <option v-for="d in docentes" :key="d.id" :value="d.id">
                {{ d.nome }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label>Alunos</label>
            <select v-model="alunos" multiple class="form-select">
              <option v-for="a in alunosList" :key="a.id" :value="a.id">
                {{ a.nome }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label>Palavras-chave</label>
            <select v-model="palavrasChave" multiple class="form-select">
              <option v-for="p in palavras" :key="p.id" :value="p.id">
                {{ p.termo }}
              </option>
            </select>
          </div>
        </div>
          <div v-if="erroFormulario" class="alert alert-warning">
            {{ erroFormulario }}
          </div>

        <button class="btn btn-primary mt-3" @click="guardar">
          {{ modoEdicao ? "Atualizar" : "Criar" }}
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL DETALHES -->
  <div v-if="showDetalhes">
    <div class="modal fade show d-block">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalhes da Proposta</h5>
            <button class="btn-close" @click="showDetalhes = false"></button>
          </div>
          <div class="modal-body" v-if="detalhes">
            <div class="modal-body" v-if="detalhes">
  <!-- TÍTULO -->
  <h5 class="mb-2">{{ detalhes.titulo }}</h5>

  <!-- DATA -->
  <p class="text-muted small">
    Criada em: {{ formatarData(detalhes.created_at) }}
  </p>

  <hr />

  <!-- ORIENTADOR -->
  <div class="mb-3">
    <strong>Orientador</strong>
    <div>
      {{ detalhes.orientador.nome }}
      <span class="text-muted">
        ({{ detalhes.orientador.email }})
      </span>
    </div>
  </div>

  <!-- DESCRIÇÃO -->
  <div class="mb-3">
    <strong>Descrição e Objetivos</strong>
    <p style="white-space: pre-wrap">
      {{ detalhes.descricao }}
    </p>
  </div>

  <div class="row">
    <!-- COORIENTADORES -->
    <div class="col-md-6 mb-3">
      <strong>Coorientadores</strong>
      <ul v-if="detalhes.coorientadores.length" class="mb-0">
        <li v-for="c in detalhes.coorientadores" :key="c.id">
          {{ c.nome }}
          <span class="text-muted">({{ c.email }})</span>
        </li>
      </ul>
      <div v-else class="text-muted">Nenhum coorientador</div>
    </div>

    <!-- ALUNOS -->
    <div class="col-md-6 mb-3">
      <strong>Alunos</strong>
      <ul v-if="detalhes.alunos.length" class="mb-0">
        <li v-for="a in detalhes.alunos" :key="a.id">
          {{ a.nome }}
          <span class="text-muted">({{ a.email }})</span>
        </li>
      </ul>
      <div v-else class="text-muted">Nenhum aluno associado</div>
    </div>
  </div>

  <!-- PALAVRAS-CHAVE -->
  <div>
    <strong>Palavras-chave</strong>
    <div v-if="detalhes.palavrasChave.length">
      <span
        v-for="p in detalhes.palavrasChave"
        :key="p.id"
        class="badge bg-secondary me-1"
      >
        {{ p.termo }}
      </span>
    </div>
    <div v-else class="text-muted">Sem palavras-chave</div>
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

  <!-- MODAL CONFIRMAR DELETE -->
  <div v-if="showConfirmDelete">
    <div class="modal fade show d-block">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar remoção</h5>
            <button class="btn-close" @click="showConfirmDelete = false"></button>
          </div>
          <div class="modal-body">
            Deseja apagar a proposta
            <strong>{{ propostaParaApagar.titulo }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showConfirmDelete = false">
              Cancelar
            </button>
            <button class="btn btn-danger" @click="apagarConfirmado">
              Apagar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>

  <!-- FEEDBACK -->
  <FeedbackModal
    :show="showModal"
    :titulo="modalTitulo"
    :mensagem="modalMensagem"
    @close="showModal = false"
  />
</template>