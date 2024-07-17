import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

import { api } from 'boot/axios'
import { gettext } from 'boot/gettext'
import { useUiStore } from './ui'

export const useMennuStore = defineStore('mennu', () => {
  const mennu = ref(LocalStorage.getItem('mennu')) || ref('')
  async function loadMennu() {
    const uiStore = useUiStore()

    await api
      .get('http://localhost:1157/app.json', {})
      .then((response) => {
     // console.log(response.data.menu)
      mennu.value= response.data.menu
      })
      .catch((error) => {
        uiStore.notifyError(error)
      })
  }

  return {
    mennu,
    loadMennu
  }
})
