<template>
  <q-page padding>
    <Breadcrumbs :items="breadcrumbs" />
    <div>
      <zabbix></zabbix>
      <traking></traking>
    </div>
    <div class="row">
      <div class="col">
        <div>
          <h1>Zabbix API Data</h1>
          <li v-for="host in hostData" :key="host.hostid">{{ host.name }}</li>
          <div v-if="loading">Loading...</div>
          <div v-else>
            <div v-if="error">{{ error }}</div>
            ss {{ hostData }}
            <ul v-if="hostData">
              <li v-for="host in hostData" :key="host.hostid">
                {{ host.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'
import Carousel from 'components/ui/carousel.vue'
import { useMeta } from 'quasar'
import { useRouter } from 'vue-router'
import Breadcrumbs from 'components/ui/Breadcrumbs'
import Header from 'components/ui/Header'
import SearchFilter from 'components/ui/SearchFilter'
import traking from 'pages/zabbix/traking.vue'
import zabbix from 'pages/zabbix/storage.vue'
import { appIcon, modelIcon } from 'composables/element'

export default {
  components: {
    Breadcrumbs,
    zabbix,
    traking,
  },
  setup() {
    // Zabbix API details
    const ZABBIX_API_URL = 'http://110.0.53.8/zabbix/api_jsonrpc.php'
    const ZABBIX_USER = 'Admin'
    const ZABBIX_PASSWORD = 'zabbix'

    // State management
    const hostData = ref([])
    const loading = ref(true)
    const error = ref(null)

    // Function to authenticate with Zabbix API
    const authenticate = async () => {
      try {
        const response = await axios.post(ZABBIX_API_URL, {
          jsonrpc: '2.0',
          method: 'user.login',
          params: {
            username: ZABBIX_USER,
            password: ZABBIX_PASSWORD,
          },
          id: 1,
          auth: null,
        })
        return response.data.result // Return the authentication token
      } catch (err) {
        throw new Error('Authentication failed')
      }
    }

    // Function to get hosts from Zabbix
    const getHosts = async (authToken) => {
      try {
        const response = await axios.post(ZABBIX_API_URL, {
          jsonrpc: '2.0',
          method: 'host.get',
          params: {
            output: ['hostid', 'name'], // Customize the fields you want
          },
          id: 2,
          auth: authToken,
        })
        return response.data.result
      } catch (err) {
        throw new Error('Failed to fetch hosts')
      }
    }

    // Fetch Zabbix data when the component is mounted
    onMounted(async () => {
      try {
        const authToken = await authenticate() // Get the API token
        const hosts = await getHosts(authToken) // Fetch hosts using the token
        console.log(hosts)
        hostData.value = hosts
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    })
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
          })
        )
      }
    }

    const search = (value) => {
      router.push(Object.assign(url, { query: { search: value } }))
    }

    return {
      hostData,
      loading,
      title,
      titleIcon,
      breadcrumbs,
      url,
      goTo,
      error,
    }
  },
}
</script>
