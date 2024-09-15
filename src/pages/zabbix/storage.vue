<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Zabbix API details
const ZABBIX_API_URL = 'http://110.0.53.100/zabbix/api_jsonrpc.php';
const ZABBIX_USER = 'Admin';
const ZABBIX_PASSWORD = 'zabbix';

const hosts = ref([]);
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
    const response = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'item.get',
      params: {
        hostids: [hostId],
        search: {
          key_: 'vfs.fs.size',  // Searches for storage-related items
        },
        output: ['key_', 'lastvalue'],  // Gets the key and the latest value
      },
      id: 3,
      auth: authToken,
    });
    return response.data.result;
  } catch (err) {
    throw new Error(`Failed to fetch storage metrics for host ${hostId}`);
  }
};

// Fetch data when component mounts
onMounted(async () => {
  try {
    const authToken = await authenticate();  // Authenticate and get token
    const hostList = await getHosts(authToken);  // Get all hosts

    // Loop through all hosts to get storage metrics
    for (const host of hostList) {
      const metrics = await getStorageMetrics(authToken, host.hostid);
      hosts.value.push({
        name: host.name,
        hostid: host.hostid,
        storage: metrics,  // Add storage metrics to the host object
      });
    }
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
          <h3>{{ host.name }}</h3>
          <ul>
            <li v-for="metric in host.storage" :key="metric.itemid">
              {{ metric.key_ }}: {{ metric.lastvalue }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
