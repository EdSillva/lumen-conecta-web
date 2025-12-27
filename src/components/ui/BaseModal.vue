<template>
  <dialog id="modal_component" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button
          for="modal_component"
          class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 rounded-full"
        >
          <CloseIcon class="text-[#637381]" />
        </button>
      </form>
      <h2 class="pb-4 text-lg font-medium">{{ title }}</h2>

      <slot name="content" />

      <template v-if="$slots.footer">
        <hr class="my-4 h-px to-transparent text-[#DFE4EA]" />

        <slot name="footer" />
      </template>
    </div>
  </dialog>
</template>

<script setup lang="ts">

defineProps({
  title: {
    type: String,
    required: true,
  },
})

function openModal() {
  const modal = document.getElementById('modal_component') as HTMLDialogElement
  if (modal) {
    modal.showModal()
  }
}

function closeModal() {
  const modal = document.getElementById('modal_component') as HTMLDialogElement
  if (modal) {
    modal.close()
  }
}

defineExpose({
  openModal,
  closeModal,
})
</script>
