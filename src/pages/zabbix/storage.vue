<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import BooleanView from 'components/ui/BooleanView'
import DateView from 'components/ui/DateView'
// Zabbix API details
const ZABBIX_API_URL = 'http://110.0.53.8/zabbix/api_jsonrpc.php';
const ZABBIX_USER = 'Admin';
const ZABBIX_PASSWORD = 'zabbix';

const hosts = reactive([]);
const loading = ref(true);
const error = ref(null);

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
    });
    return response.data.result;
  } catch (err) {
    throw new Error(`Authentication failed: ${err.response?.data?.message || err.message}`);
  }
};

// Function to get all hosts
const getHosts = async (authToken) => {
  try {
    const response = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'host.get',
      params: {
        output: ['hostid', 'name'],  // Customize fields you want
      },
      id: 2,
      auth: authToken,
    });
    return response.data.result;
  } catch (err) {
    throw new Error('Failed to fetch hosts');
  }
};

// Function to get storage metrics for a host
const getStorageMetrics = async (authToken, hostId) => {
  try {

    const response2 = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'item.get',
      params: {
        hostids: hostId,
        search: {
          // key_: 'fs.fs.dependent.',  // Searches for storage-related items
        },
        output: 'extend',  // Gets the key and the latest value
      },
      id: 3,
      auth: authToken,
    });
    console.log('getStorageMetrics')
    console.log(response2.data.result)
    const result = response2.data.result.reduce((acc, obj) => {
      acc[obj.key_] = obj.lastvalue
      return acc;
    }, {});
    console.log(result)
    return result;
  } catch (err) {
    console.log(err)
    throw new Error(`Failed to fetch storage metrics for host ${hostId}`);
  }
};
const testval = (key) => {


  return ref(true)

}

const testbooleen = (key) => {

  if (
    key.includes('OracleOraDb')
    || key.includes('Eaton')
    || key.includes('TeamViewer')
    || key.includes('uvnc_service')



  ) {
    return true
  } else {
    return false
  }
}
const converttoGbate = (key) => {
  console.log('converttoGbateconverttoGbateconverttoGbateconverttoGbateconverttoGbate')
  console.log(key)
  return (key / 1024 ** 3)
    .toFixed(2)
}
const testcontain = (key) => {

  console.log(key)
  if (key.includes('vfs.fs.dependent.size[D:,pused]')
    || key.includes('vfs.fs.dependent.size[C:,pused]')
    || key.includes('vfs.fs.dependent.size[S:,pused]')
    || key.includes('vfs.fs.dependent.size[F:,pused]')
    || key.includes('vfs.fs.dependent.size[E:,pused]')
    || key.includes('vfs.fs.pused[4]')
    || key.includes('vfs.fs.pused[1]')
    || key.includes('vfs.fs.pused[2]')
    || key.includes('vfs.fs.pused[3]')
    || key.includes('vfs.fs.dependent.size[C:,free]')
  ) {
    return true
  } else {
    return false
  }
}
const link = (data) => {
  return ((parseFloat(data))).toFixed(2) + "%"

}
// Fetch data when component mounts
onMounted(async () => {
  try {
    const authToken = await authenticate();  // Authenticate and get token
    const hostList = await getHosts(authToken);  // Get all hosts

    // Loop through all hosts to get storage metrics
    for (const host of hostList) {
      console.log('rrrrrrrrrrrrrrrrrrrrr')
      const metrics = await getStorageMetrics(authToken, host.hostid);
      console.log(metrics)
      const groupByKey = metrics
      hosts.push({
        name: host.name,
        hostid: host.hostid,
        storage: groupByKey,  // Add storage metrics to the host object
      });
    }
    console.log(hosts)
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }

});
</script>
<template>
  <div>
    <h1>Zabbix Hosts with Storage Availability</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="error">{{ error }}</div>
      <ul v-if="hosts.length > 0">
        <li v-for="host in hosts" :key="host.hostid">
          <h3 class="text-h2 q-ma-md">{{ host.name }}</h3>


          <div class="row q-pa-md q-gutter-md">



            <div class="col-6 col-md col-sm">
              <h6 class="text-h6 q-ma-md ">storage</h6>
              <template v-for="(serie, index) in host.storage" :key="index">
                {{ serie }}
                {{ index }}
                <p v-if="index == 'vfs.fs.dependent.size[C:,free]'">Espace : {{ converttoGbate(serie) }}GB</p>
                <p v-if="index == 'system.uname'">SYSTEM : : {{ serie }}</p>

                <q-linear-progress v-if="index == 'vfs.fs.dependent.size[C:,pused]'" size="25px" :value="(serie) / 100"
                  color="accent">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.dependent.size[D:,pused]'" size="25px" :value="(serie) / 100"
                  color="accent">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.dependent.size[E:,pused]'" size="25px" :value="(serie) / 100"
                  color="accent">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.dependent.size[S:,pused]'" size="25px" :value="(serie) / 100"
                  color="accent">
                  <div class="absolute-full flex flex- flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.pused[1]'" size="25px" :value="(serie) / 100" color="accent">
                  <div class="absolute-full flex flex- flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.pused[5]'" size="25px" :value="(serie) / 100" color="accent">
                  <div class="absolute-full flex flex- flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>

                <span v-if="index == 'system.uptime'">
                  <BooleanView :value="true" />
                </span>
                <span v-if="index == 'system.uptime'">
                  <BooleanView :value="false" />
                </span>
                <span v-if="index == 'system.uptime'">
                  <DateView :value="serie" />
                </span>
                <q-linear-progress v-if="index == 'vfs.fs.pused[2]'" size="25px" :value="(serie) / 100" color="accent">
                  <div class="absolute-full flex flex- flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.pused[3]'" size="25px" :value="(serie) / 100" color="accent">
                  <div class="absolute-full flex flex- flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
                <q-linear-progress v-if="index == 'vfs.fs.pused[4]'" size="25px" :value="(serie) / 100" color="accent">
                  <div class="absolute-full flex flex- flex-center">
                    <q-badge color="green " text-color="accent" :label="link(serie)">

                    </q-badge>
                  </div>
                </q-linear-progress>
              </template>
            </div>






            <div class="col-6 col-md col-sm">

              <h6 class="text-h6 q-ma-md ">Service</h6>
              <q-card flat bordered>
                <q-card-section>
                  <template v-for="(serie, index) in host.storage" :key="index">


                    <div class="row">
                      <div class="col">
                        <div v-translate class="text-h5">General</div>
                      </div>
                    </div>

                    <div class="row q-py-sm">
                      <div class="col-6 col-md col-sm">
                        <q-icon name="mdi-ip-network" size="sm" class="vertical-middle" />
                        <span class="vertical-middle">
                          <p v-if="index == 'vfs.fs.dependent.size[C:,free]'">Espace : {{ converttoGbate(serie) }}GB</p>
                          <q-tooltip>
                            <translate>ip address</translate>
                          </q-tooltip>
                        </span>
                        <q-btn v-if="'vfs.fs.dependent.size[C:, free]'" flat icon="mdi-content-copy" size="sm"
                          color="primary" @click.stop="converttoGbate(serie)"><q-tooltip>{{ converttoGbate(serie)
                            }}</q-tooltip></q-btn>
                      </div>

                      <div class="col-6 col-md col-sm">
                        <q-icon name="mdi-ip" size="sm" class="vertical-middle" />
                        <span class="vertical-middle">
                          converttoGbate(serie)
                          <q-tooltip>
                            <translate>forwarded ip address</translate>
                          </q-tooltip>
                        </span>

                      </div>
                    </div>

                  </template>
                </q-card-section>
              </q-card>
            </div>


          </div>



        </li>
      </ul>
    </div>
  </div>
</template>
