<template>
  <div class="row g-3">
    <div class="col-md-3">
      <div class="list-group shadow-sm">
        <router-link class="list-group-item list-group-item-action" to="/admin/docentes">
          Docentes
        </router-link>
        <router-link class="list-group-item list-group-item-action" to="/admin/alunos">
          Alunos
        </router-link>
        <router-link class="list-group-item list-group-item-action" to="/admin/palavras-chave">
          Palavras-chave
        </router-link>
        <router-link class="list-group-item list-group-item-action" to="/admin/propostas">
          Propostas
        </router-link>
      </div>

      <div class="card mt-3">
        <div class="card-body">
          <div class="fw-bold">Admin</div>
          <div class="text-muted small">Gestão do sistema</div>
        </div>
      </div>
    </div>

    <div class="col-md-9">
      <router-view />
    </div>
  </div>
</template>
