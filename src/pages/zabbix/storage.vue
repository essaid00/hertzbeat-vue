<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import BooleanView from 'components/ui/BooleanView'
import DateView from 'components/ui/DateView'

import {
  DISK_USAGE_METRICS,
  FREE_SPACE_METRICS,
  SERVICE_RELATED_METRICS,
} from './data.ts'
// Zabbix API configuration - should be moved to environment variables in production
const ZABBIX_API_URL = 'http://110.0.53.8/zabbix/api_jsonrpc.php'
const ZABBIX_USER = 'Admin'
const ZABBIX_PASSWORD = 'zabbix'

// Reactive state
const hosts = reactive([])
const loading = ref(true)
const error = ref(null)
const authToken = ref(null)

// Constants for metric types

// Helper functions
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
    return response.data.result
  } catch (err) {
    throw new Error(
      `Authentication failed: ${
        err.response?.data?.error?.message || err.message
      }`
    )
  }
}

const parseValue = (key, value) => {
  // Handle boolean values represented as strings
  if (value === '0') return false
  if (value === '1') return true
  return value
}

const getHosts = async (token) => {
  try {
    const response = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'host.get',
      params: {
        output: ['hostid', 'name', 'status'],
        selectInterfaces: ['ip'],
      },
      id: 2,
      auth: token,
    })
    return response.data.result
  } catch (err) {
    throw new Error(
      `Failed to fetch hosts: ${
        err.response?.data?.error?.message || err.message
      }`
    )
  }
}

const getHostMetrics = async (token, hostId) => {
  try {
    const response = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'item.get',
      params: {
        hostids: hostId,
        output: 'extend',
        sortfield: 'key_',
      },
      id: 3,
      auth: token,
    })

    const metricsMap = {}

    response.data.result.forEach((item) => {
      metricsMap[item.key_] = parseValue(item.key_, item.lastvalue)
    })

    return metricsMap
  } catch (err) {
    console.error(`Error fetching metrics for host ${hostId}:`, err)
    throw new Error(`Failed to fetch metrics for host ${hostId}`)
  }
}

// Utility functions for displaying metrics
const convertToGB = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0'
  return (bytes / 1024 ** 3).toFixed(2)
}

const formatPercentage = (value) => {
  if (!value || isNaN(value)) return '0%'
  return parseFloat(value).toFixed(2) + '%'
}

const isDiskUsageMetric = (key) =>
  DISK_USAGE_METRICS.some((metric) => key === metric)

const isFreeSpaceMetric = (key) =>
  FREE_SPACE_METRICS.some((metric) => key === metric)

const isServiceMetric = (key) => {
  return SERVICE_RELATED_METRICS.some((service) => key.includes(service))
}

const getDriveLabel = (key) => {
  const match = key.match(/\[(.*?),/)
  if (match && match[1]) {
    return match[1]
  }

  const numMatch = key.match(/\[(\d+)\]/)
  if (numMatch && numMatch[1]) {
    return `Drive ${numMatch[1]}`
  }

  return 'Drive'
}

const getServiceName = (key) => {
  // Extract a friendly service name from the key
  const parts = key.split('.')
  return parts[parts.length - 1] || key
}

// Fetch and process data
const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    // Get authentication token
    authToken.value = await authenticate()

    // Get list of hosts
    const hostList = await getHosts(authToken.value)

    // Clear hosts array
    hosts.splice(0, hosts.length)

    // Fetch metrics for each host
    for (const host of hostList) {
      const metrics = await getHostMetrics(authToken.value, host.hostid)

      // Group metrics into categories for easier display
      const categorizedMetrics = {
        system: {},
        storage: {},
        services: {},
      }

      Object.entries(metrics).forEach(([key, value]) => {
        if (key.startsWith('system.')) {
          categorizedMetrics.system[key] = value
        } else if (isDiskUsageMetric(key) || isFreeSpaceMetric(key)) {
          categorizedMetrics.storage[key] = value
        } else if (isServiceMetric(key)) {
          categorizedMetrics.services[key] = value
        } else {
          // Default category for other metrics
          if (key === 'agent.ping') {
            categorizedMetrics.system[key] = value
          }
        }
      })

      hosts.push({
        name: host.name,
        hostid: host.hostid,
        ip: host.interfaces?.[0]?.ip || 'Unknown',
        available: metrics,
        rawMetrics: metrics,
        metrics: categorizedMetrics,
        activeTab: 'storage',
      })
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="">
    <h1 class="text-h4 q-mb-md">Zabbix Hosts Monitoring Dashboard</h1>

    <q-btn
      v-if="!loading"
      color="primary"
      icon="refresh"
      label="Refresh Data"
      class="q-mb-md"
      @click="fetchData"
    />

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner size="3em" color="primary" />
      <div class="text-h6 q-mt-md">Loading host data...</div>
    </div>

    <div v-else-if="error" class="error-container">
      <q-banner class="bg-negative text-white" rounded>
        <template #avatar>
          <q-icon name="error" />
        </template>
        <div class="text-h6">Error</div>
        <div>{{ error }}</div>
        <template #action>
          <q-btn flat color="white" label="Retry" @click="fetchData" />
        </template>
      </q-banner>
    </div>

    <div v-else-if="hosts.length === 0" class="text-center q-pa-xl">
      <q-icon name="info" size="3em" color="grey" />
      <div class="text-h6 q-mt-md">No hosts found</div>
    </div>

    <div v-else class="host-list">
      <div class="row">
        <div v-for="host in hosts" :key="host.hostid" class="col-3">
          <q-card class="col-6" flat bordered>
            <q-card-section
              :class="
                host.rawMetrics['zabbix[host,agent,available]']
                  ? 'bg-green text-white'
                  : 'bg-warning text-white'
              "
            >
              <div class="text-h5">
                {{ host.name }}<span class="q-ma-md">IP: {{ host.ip }}</span>
              </div>

              <q-item-section avatar>
                <q-icon
                  name="network_check"
                  :color="
                    host.rawMetrics['zabbix[host,agent,available]']
                      ? 'positive'
                      : 'negative'
                  "
                />
              </q-item-section>
            </q-card-section>

            <q-tabs
              v-model="host.activeTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="system" label="System" icon="computer" />
              <q-tab name="storage" label="Storage" icon="storage" />
              <q-tab
                name="services"
                label="Services"
                icon="miscellaneous_services"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="host.activeTab" animated>
              <!-- System Tab -->
              {{ host.activeTab }}
              <q-tab-panel name="system">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-list bordered separator>
                      <q-item v-if="host.rawMetrics['agent.ping']">
                        <q-item-section avatar>
                          <q-icon name="network_check" color="positive" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Agent Status</q-item-label>
                          <q-item-label caption
                            >Connection to Zabbix agent</q-item-label
                          >
                        </q-item-section>
                        <q-item-section side>
                          <BooleanView
                            :value="
                              host.rawMetrics['zabbix[host,agent,available]']
                            "
                          />
                        </q-item-section>
                      </q-item>

                      <q-item v-if="host.rawMetrics['system.uname']">
                        <q-item-section avatar>
                          <q-icon name="info" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>System Info</q-item-label>
                          <q-item-label caption>{{
                            host.rawMetrics['system.uname']
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="host.rawMetrics['system.uptime']">
                        <q-item-section avatar>
                          <q-icon name="timer" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>System Uptime</q-item-label>
                          <q-item-label caption>
                            <DateView
                              :value="host.rawMetrics['system.uptime']"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="host.rawMetrics['system.sw.os']">
                        <q-item-section avatar>
                          <q-icon name="desktop_windows" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Operating System</q-item-label>
                          <q-item-label caption>{{
                            host.rawMetrics['system.sw.os']
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Storage Tab -->
              <q-tab-panel name="storage">
                <div class="row q-col-gutter-md">
                  <!-- Disk Usage Section -->
                  <template v-for="(value, key) in host.rawMetrics" :key="key">
                    <div
                      v-if="isDiskUsageMetric(key)"
                      class="col-12 col-md-6 col-lg-4"
                    >
                      <q-card flat bordered>
                        <q-card-section>
                          <div class="text-h6">
                            {{ getDriveLabel(key) }} Usage
                          </div>

                          <q-linear-progress
                            size="25px"
                            :value="parseFloat(value) / 100"
                            :color="
                              parseFloat(value) > 85
                                ? 'negative'
                                : parseFloat(value) > 70
                                ? 'warning'
                                : 'positive'
                            "
                          >
                            <div class="absolute-full flex flex-center">
                              <q-badge
                                :color="
                                  parseFloat(value) > 85
                                    ? 'negative'
                                    : parseFloat(value) > 70
                                    ? 'warning'
                                    : 'positive'
                                "
                              >
                                {{ formatPercentage(value) }}
                              </q-badge>
                            </div>
                          </q-linear-progress>

                          <div
                            v-if="host.rawMetrics[key.replace('pused', 'free')]"
                            class="q-mt-sm"
                          >
                            Free Space:
                            {{
                              convertToGB(
                                host.rawMetrics[key.replace('pused', 'free')]
                              )
                            }}
                            GB
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
                </div>
              </q-tab-panel>

              <!-- Services Tab -->
              <q-tab-panel name="services">
                <div class="row q-col-gutter-md">
                  <template v-for="(value, key) in host.rawMetrics" :key="key">
                    <div
                      v-if="isServiceMetric(key)"
                      class="col-12 col-md-12 col-lg-12"
                    >
                      <q-item>
                        <q-item-section avatar>
                          <q-icon
                            :name="!value ? 'check_circle' : 'error'"
                            :color="!value ? 'positive' : 'negative'"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ getServiceName(key) }}</q-item-label>
                          <q-item-label caption>Service status</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <BooleanView :value="!value" />
                        </q-item-section>
                      </q-item>
                    </div>
                  </template>

                  <!-- Add a check for agent.ping if no other services are found -->
                  <div
                    v-if="!Object.keys(host.rawMetrics).some(isServiceMetric)"
                    class="col-12"
                  >
                    <q-banner>
                      No service monitoring metrics available for this host.
                    </q-banner>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zabbix-monitor {
  max-width: 1400px;
  margin: 0 auto;
}

.host-card {
  transition: all 0.3s ease;
}

.host-card:hover {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
