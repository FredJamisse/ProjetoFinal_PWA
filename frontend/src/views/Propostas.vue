<template>
  <h3>{{ modoEdicao ? "Editar Proposta" : "Nova Proposta" }}</h3>

  <div class="card mb-4">
    <div class="card-body">
      <label class="form-label">Título</label>
      <input v-model="titulo" class="form-control mb-2" />

      <label class="form-label">Descrição e Objetivos</label>
      <textarea v-model="descricao" class="form-control mb-3" rows="4" />

      <div class="row">
        <div class="col-md-4">
          <label>Coorientadores</label>
          <select v-model="coorientadores" multiple class="form-select">
            <option v-for="d in docentes" :value="d.id">{{ d.nome }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label>Alunos</label>
          <select v-model="alunos" multiple class="form-select">
            <option v-for="a in alunosList" :value="a.id">{{ a.nome }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label>Palavras-chave</label>
          <select v-model="palavrasChave" multiple class="form-select">
            <option v-for="p in palavras" :value="p.id">{{ p.termo }}</option>
          </select>
        </div>
      </div>

      <div class="mt-3">
        <button
  type="button"
  class="btn btn-primary me-2"
  @click="guardar"
>
  {{ modoEdicao ? "Atualizar" : "Criar" }}
</button>

        <button
  type="button"
  v-if="modoEdicao"
  class="btn btn-secondary"
  @click="limparFormulario"
>
  Cancelar
</button>
      </div>
    </div>
  </div>

  <h4>Minhas Propostas</h4>
  <ul class="list-group">
    <li v-for="p in propostas" :key="p.id"
        class="list-group-item d-flex justify-content-between">
      {{ p.titulo }}
      <div>
        <button class="btn btn-info btn-sm me-2" @click="verDetalhes(p)">Ver detalhes</button>
        <button class="btn btn-warning btn-sm me-2" @click="editar(p)">Editar</button>
        <button class="btn btn-danger btn-sm" @click="confirmarApagar(p)">
  Apagar
</button>

      </div>
    </li>
  </ul>

  <!-- Modal Detalhes -->
  <div v-if="showDetalhes">
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalhes da Proposta</h5>
          <button class="btn-close" @click="showDetalhes = false"></button>
        </div>

        <div class="modal-body" v-if="detalhes">
          <div class="mb-2">
            <div class="fw-bold">Título</div>
            <div>{{ detalhes.titulo }}</div>
          </div>

          <div class="mb-3">
            <div class="fw-bold">Orientador</div>
            <div>{{ detalhes.orientador }}</div>
          </div>

          <div class="mb-3">
            <div class="fw-bold">Descrição e Objetivos</div>
            <div style="white-space: pre-wrap">{{ detalhes.descricao }}</div>
          </div>

          <hr />

          <div class="row g-3">
            <div class="col-md-6">
              <div class="fw-bold">Coorientadores</div>
              <ul class="mb-0" v-if="detalhes.coorientadores?.length">
                <li v-for="c in detalhes.coorientadores" :key="c.id">
                  {{ c.nome }} <span class="text-muted">({{ c.email }})</span>
                </li>
              </ul>
              <div class="text-muted" v-else>Sem coorientadores.</div>
            </div>

            <div class="col-md-6">
              <div class="fw-bold">Alunos</div>
              <ul class="mb-0" v-if="detalhes.alunos?.length">
                <li v-for="a in detalhes.alunos" :key="a.id">
                  {{ a.nome }} <span class="text-muted">({{ a.email }})</span>
                </li>
              </ul>
              <div class="text-muted" v-else>Sem alunos associados.</div>
            </div>

            <div class="col-12">
              <div class="fw-bold">Palavras-chave</div>
              <div v-if="detalhes.palavrasChave?.length">
                <span
                  v-for="p in detalhes.palavrasChave"
                  :key="p.id"
                  class="badge bg-secondary me-1"
                >
                  {{ p.termo }}
                </span>
              </div>
              <div class="text-muted" v-else>Sem palavras-chave.</div>
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

<div v-if="showConfirmDelete">
  <div class="modal fade show d-block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar remoção</h5>
          <button class="btn-close" @click="showConfirmDelete = false"></button>
        </div>

        <div class="modal-body">
          Tem a certeza que deseja apagar a proposta
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


  <FeedbackModal
    :show="showModal"
    :titulo="modalTitulo"
    :mensagem="modalMensagem"
    @close="showModal = false"
  />


</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { auth } from "../store/auth";
import FeedbackModal from "../components/FeedbackModal.vue";

const titulo = ref("");
const descricao = ref("");
const coorientadores = ref([]);
const alunos = ref([]);
const palavrasChave = ref([]);

const docentes = ref([]);
const alunosList = ref([]);
const palavras = ref([]);
const propostas = ref([]);

const modoEdicao = ref(false);
const propostaId = ref(null);

const showConfirmDelete = ref(false);
const propostaParaApagar = ref(null);

const showModal = ref(false);
const modalTitulo = ref("");
const modalMensagem = ref("");

// 🔹 DETALHES (versão FINAL)
const showDetalhes = ref(false);
const detalhes = ref(null);

async function carregarDados() {
  docentes.value = (await api.get("/users")).data.filter(
    u => u.role === "DOCENTE" && u.id !== auth.user.id
  );
  alunosList.value = (await api.get("/alunos")).data;
  palavras.value = (await api.get("/palavras-chave")).data;
  propostas.value = (await api.get(`/propostas/docente/${auth.user.id}`)).data;
}

async function guardar() {
  if (modoEdicao.value) {
    await api.put(`/propostas/${propostaId.value}`, {
      titulo: titulo.value,
      descricao: descricao.value,
      coorientadores: coorientadores.value,
      alunos: alunos.value,
      palavrasChave: palavrasChave.value
    });
    modalMensagem.value = "Proposta atualizada com sucesso.";
  } else {
    await api.post("/propostas", {
      titulo: titulo.value,
      descricao: descricao.value,
      orientadorId: auth.user.id,
      coorientadores: coorientadores.value,
      alunos: alunos.value,
      palavrasChave: palavrasChave.value
    });
    modalMensagem.value = "Proposta criada com sucesso.";
  }

  modalTitulo.value = "Sucesso";
  showModal.value = true;
  limparFormulario();
  carregarDados();
}

function editar(p) {
  modoEdicao.value = true;
  propostaId.value = p.id;
  titulo.value = p.titulo;
  descricao.value = p.descricao;
}

async function apagar(id) {
  if (!confirm("Deseja apagar esta proposta?")) return;
  await api.delete(`/propostas/${id}`);
  modalTitulo.value = "Sucesso";
  modalMensagem.value = "Proposta apagada com sucesso.";
  showModal.value = true;
  carregarDados();
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

async function verDetalhes(p) {
  const res = await api.get(`/propostas/${p.id}/detalhes`);
  detalhes.value = res.data;
  showDetalhes.value = true;
}

function limparFormulario() {
  titulo.value = "";
  descricao.value = "";
  coorientadores.value = [];
  alunos.value = [];
  palavrasChave.value = [];
  modoEdicao.value = false;
  propostaId.value = null;
}

onMounted(carregarDados);
</script>
