<template>

  <q-table v-if="detailInfo.content.length > 0" class="q-ma-md" :rows="detailInfo.content" :columns="columnsCapability"
    row-key="name" :pagination="{ rowsPerPage: 0 }" hide-pagination flat bordered />
  <q-banner v-else class="text-white bg-info q-ma-md">
    <translate>No information</translate>
  </q-banner>

</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'
import { useMeta } from 'quasar'
import { api } from 'boot/axios'
import { useUiStore } from 'stores/ui'
export default {
  components: {

  },
  setup() {
    const { $gettext } = useGettext()

    useMeta({ title: $gettext('Groups List') })
    const uiStore = useUiStore()
    const details = ref(true)
    const loading = ref(false)
    onMounted(async () => {
      loading.value = true
      showDetails().then(() => {
        loading.value = false
      })
    })
    const showDetails = async (id) => {
      await api
        .get(`/monitors`)
        .then((response) => {
          console.log(response.data.data.content)
          Object.assign(detailInfo.content, response.data.data.content)
          details.value = true
        })
        .catch((error) => {
          console.log(error)
          uiStore.notifyError(error)
        })
    }



    const title = ref($gettext('Groups'))
    const columnsCapability = [
      {
        name: 'id',
        field: 'id',
        label: 'Name',
        align: 'left',
      },
      {
        name: 'jobId',
        field: 'jobId',
        label: 'jobId',
        align: 'left',
      },
      {
        name: 'app',
        field: 'app',
        label: 'app',
        align: 'left',
      },
      {
        name: 'name',
        field: 'name',
        label: 'jobId',
        align: 'name',
      },
      {
        name: 'gmtUpdate',
        field: 'gmtUpdate',
        label: 'gmtUpdate',
        align: 'left',
      },
      {
        name: 'host',
        field: 'host',
        label: 'host',
        align: 'left',
      }, {
        name: 'status',
        field: 'status',
        label: 'status',
        align: 'left',
      },
    ]

    const detailInfo = reactive({
      content: [],
      logical_name: [],
      configuration: [],
    })


    return { title, columnsCapability, detailInfo, showDetails }
  },
}
</script>
