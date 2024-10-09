import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

import { api } from 'boot/axios'
import { gettext } from 'boot/gettext'
import { useUiStore } from './ui'

export const useSummaryStore = defineStore('Summary', () => {
  const Summary = ref(LocalStorage.getItem('Summary')) || ref([])
  async function loadSummary() {
    const uiStore = useUiStore()

    await api
      .get('/summary', {})
      .then((response) => {
        console.log(response.data.data)
        Summary.value = response.data.data.apps
      })
      .catch((error) => {
        uiStore.notifyError(error)
      })
  }

  return {
    Summary,
    loadSummary,
  }
})
