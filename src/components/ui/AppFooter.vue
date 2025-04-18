<template>
  <q-footer>
    <q-toolbar>
      &copy; {{ HertzBeat_MIN_YEAR }}-{{ new Date().getFullYear() }}
      <q-btn stretch flat label="HertzBeat" type="a" href="http://www.HertzBeat.org/" no-caps size="16px"><q-tooltip>
          <translate>Website</translate>
        </q-tooltip></q-btn>
      <q-btn stretch flat label="GPLv3" type="a" href="http://www.gnu.org/licenses/gpl.html" no-caps
        size="16px"><q-tooltip>
          <translate>License</translate>
        </q-tooltip></q-btn>
      <q-btn-dropdown flat stretch>
        <template #label>
          <q-icon name="mdi-github" />

          <q-tooltip>
            <translate>Source code</translate>
          </q-tooltip>
        </template>

        <q-list>
          <q-item v-close-popup clickable href="https://github.com/HertzBeat/HertzBeat-frontend">
            <q-item-section>
              <q-item-label>Frontend</q-item-label>
              <q-item-label caption>{{ appVersion }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-close-popup clickable href="https://github.com/HertzBeat/HertzBeat-backend">
            <q-item-section>
              <q-item-label>Backend</q-item-label>
              <q-item-label caption>{{ serverVersion }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-space />

      <q-btn stretch flat icon="mdi-api" type="a" :href="apiLink">
        <q-tooltip>
          <translate>API Rest Info</translate>
        </q-tooltip></q-btn>

      <q-btn stretch flat icon="mdi-text-box-multiple" type="a" href="http://fun-with-HertzBeat.readthedocs.io/">
        <q-tooltip anchor="top middle" self="bottom right">
          <translate>HertzBeat documentation</translate>
        </q-tooltip></q-btn>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { computed } from 'vue'

import { api } from 'boot/axios'
import { useAuthStore } from 'stores/auth'
import { HertzBeat_MIN_YEAR } from 'config/app.conf'

const app = require('../../../package.json')

export default {
  setup() {
    const authStore = useAuthStore()
    const apiLink = `${api.defaults.baseURL}/docs/`

    const serverVersion = computed(() => {
      return authStore.server.version
    })

    return {
      apiLink,
      serverVersion,
      appVersion: app.version,
      HertzBeat_MIN_YEAR,
    }
  },
}
</script>
