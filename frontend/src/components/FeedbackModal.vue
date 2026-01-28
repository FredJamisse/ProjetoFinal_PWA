<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="show">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ titulo }}</h5>
          <button type="button" class="btn-close" @click="fechar"></button>
        </div>
        <div class="modal-body">
          <p>{{ mensagem }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="fechar">OK</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
defineProps({
  show: Boolean,
  titulo: String,
  mensagem: String
});

const emit = defineEmits(["close"]);

function fechar() {
  emit("close");
}
</script>
