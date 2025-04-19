<template>
  <div class="row q-col-gutter-md">
    <q-list v-for="(item, index) in systemInfo" :key="index" dense>
      <q-item>
        <system-info-viewer :system-info="item" @refresh="fetchSystemInfo" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import SystemInfoViewer from 'components/SystemInfoViewer.vue'
import { api } from 'boot/axios'
export default defineComponent({
  name: 'SystemInfoPage',

  components: {
    SystemInfoViewer,
  },

  setup() {
    const systemInfo = ref({})
    const response = ref({})
    const fetchSystemInfo = async () => {
      try {
        await api
          .get('/api/system-info', {})
          .then((response2) => {
            response.value = response2.data
          })
          .catch((error) => {
            uiStore.notifyError(error)
          })
        systemInfo.value = response.value
      } catch (error) {
        console.error('Error fetching system information:', error)
      }
    }

    onMounted(() => {
      fetchSystemInfo()
    })

    return {
      systemInfo,
      fetchSystemInfo,
    }
  },
})
</script>
