<template>
  <q-page padding>
    <Breadcrumbs :items="breadcrumbs" />

    <div class="row">
      <div class="col">
        <PieChart :title="$gettext('Attributes / Formula')" end-point="/summary/v1" :url="url" @get-link="goTo" />
      </div>
      <div class="col">
        <Carousel></Carousel>
      </div>
      <div class="col">
        <PieChart :title="$gettext('Attributes / Formula')" end-point="/summary/v1" :url="url" @get-link="goTo" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <list />
      </div>


    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'
import { useGettext } from 'vue3-gettext'
import Carousel from 'components/ui/carousel.vue'
import { useMeta } from 'quasar'
import { useRouter } from 'vue-router'
import Breadcrumbs from 'components/ui/Breadcrumbs'
import list from 'pages/heartz/list.vue'
import PieChart from 'components/chart/Pie'
import { appIcon, modelIcon } from 'composables/element'

export default {
  components: {
    Breadcrumbs,
    PieChart,
    list,
    Carousel,
  },
  setup() {
    const router = useRouter()
    const { $gettext } = useGettext()

    const titleIcon = modelIcon('attributes')
    const title = $gettext('Attributes')
    useMeta({ title })

    const searchText = ref('')

    const breadcrumbs = reactive([
      {
        text: $gettext('Dashboard'),
        icon: appIcon('home'),
        to: 'home',
      },
      {
        text: $gettext('Data'),
        icon: appIcon('data'),
      },
      {
        text: title,
        icon: titleIcon,
      },
    ])

    const url = { name: 'attributes-list' }

    const goTo = (params) => {
      if (params.data.property_att_id) {
        router.push(
          Object.assign(url, {
            query: { property_id: params.data.property_att_id },
          }),
        )
      }
    }

    const search = (value) => {
      router.push(Object.assign(url, { query: { search: value } }))
    }

    return {
      title,
      titleIcon,
      breadcrumbs,
      url,
      goTo,

    }
  },
}
</script>
