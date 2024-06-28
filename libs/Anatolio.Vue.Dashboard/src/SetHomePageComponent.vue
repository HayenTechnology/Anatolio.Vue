<template>
    <Dialog header="Set Home Page" :visible="dialogVisible" :modal="true" :style="{width: '350px'}" @hide="hideDialog">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem;"></i>
            <span>{{ confirmationMessage }}</span>
            <p class="text-center text-primary">{{ model.Name }}</p>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="setHomePage" />
        </template>
    </Dialog>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { Dialog } from 'primevue/dialog'
import { Button } from 'primevue/button'

export default {
  components: {
    Dialog,
    Button
  },
  setup() {
    const dialogVisible = ref(false)
    const model = reactive({ Name: '' })
    const confirmationMessage = ref('Are you sure want to set this dashboard as home page?')

    onMounted(() => {
      Object.assign(model, JSON.parse(document.getElementById('app').dataset.model))
    })

    const showDialog = () => {
      dialogVisible.value = true
    }

    const hideDialog = () => {
      dialogVisible.value = false
    }

    const setHomePage = () => {
      post('/DashboardApi/SetHomePage', { id: model.Id }, result => {
        console.log(result)
        hideDialog()
        // Additional logic after setting home page, e.g., updating parent component
      })
    }

    const post = (url, data, successCallback) => {
      // HTTP POST logic
    }

    return {
      dialogVisible,
      model,
      confirmationMessage,
      showDialog,
      hideDialog,
      setHomePage,
      post
    }
  }
}
</script>

<style scoped>
    .confirmation-content {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
