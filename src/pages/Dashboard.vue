<template>
  <q-page padding>
    <Breadcrumbs :items="breadcrumbs" />
    <div class="row">
      <div class="col-12" bordered>
        <p>ss</p>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'
import { useRouter } from 'vue-router'
import { useMeta } from 'quasar'
import { useUiStore } from 'stores/ui'
import { api } from 'boot/axios'
import { EVENTS_HISTORY_HOURS } from 'config/app.conf'



import { appIcon } from 'composables/element'

export default defineComponent({
  name: 'Dashboard',

  components: {},

  setup() {
    const { $gettext } = useGettext()

    const titleIcon = appIcon('home')
    const title = $gettext('Dashboard')
    useMeta({ title })





    onMounted(async () => {
      //await loadProjects()
    })

    return {

    }
  },
})
</script>
