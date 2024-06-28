<template>
    <Dialog header="Set Page Dashboard Rules" :visible="dialogVisible" :modal="true" :style="{width: '350px'}" @hide="hideDialog">
        <div class="confirmation-content">
            <!-- Ýçeriði buraya ekleyebilirsiniz -->
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="saveRules" />
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
    const confirmationMessage = ref('Are you sure you want to set the rules for this page dashboard?')

    onMounted(() => {
      Object.assign(model, JSON.parse(document.getElementById('app').dataset.model))
    })

    const showDialog = () => {
      dialogVisible.value = true
    }

    const hideDialog = () => {
      dialogVisible.value = false
    }

    const saveRules = () => {
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
      saveRules,
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
