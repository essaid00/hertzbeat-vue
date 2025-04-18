<template>
  <div>
    <p>kkk</p>
    <system-info-viewer :system-info="systemInfo" @refresh="fetchSystemInfo" />
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
            console.log(response2)
            console.log('--------------------------------')
            response.value = response2.data.menu
          })
          .catch((error) => {
            uiStore.notifyError(error)
          })
        systemInfo.value = response
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
