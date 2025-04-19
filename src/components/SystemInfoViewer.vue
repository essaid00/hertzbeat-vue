<template>
  <q-card class="col-12 col-md-12">
    <q-card-section>
      <div class="text-h6">
        {{ systemInfo.delegation.abrvDelegation }}
      </div>
      <div class="text-subtitle2">
        Collected on: {{ formatDate(systemInfo.collectionDate) }}
      </div>
    </q-card-section>

    <!-- OS Information -->
    <q-card-section v-if="systemInfo.os" class="q-pt-none">
      <q-expansion-item
        expand-separator
        icon="computer"
        label="Operating System"
        default-opened
      >
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Name</q-item-label>
                      <q-item-label
                        >{{ systemInfo.os.name }}
                        {{ systemInfo.os.version }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Architecture</q-item-label>
                      <q-item-label>{{ systemInfo.os.arch }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-6">
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Available Processors</q-item-label>
                      <q-item-label>{{
                        systemInfo.os.availableProcessors
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>CPU Usage</q-item-label>
                      <q-item-label>{{ systemInfo.os.cpuUsage }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>

    <!-- Backup Information -->
    <q-card-section v-if="systemInfo.sauvgarde" class="q-pt-none">
      <q-expansion-item
        expand-separator
        icon="backup"
        label="Backup Information"
        default-opened
      >
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-banner
                  rounded
                  :class="
                    systemInfo.sauvgarde.found ? 'bg-positive' : 'bg-negative'
                  "
                >
                  <template #avatar>
                    <q-icon
                      :name="
                        systemInfo.sauvgarde.found ? 'check_circle' : 'error'
                      "
                      color="white"
                    />
                  </template>
                  {{ systemInfo.sauvgarde.message }}
                </q-banner>

                <q-list v-if="systemInfo.sauvgarde.found" dense class="q-mt-sm">
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Filename</q-item-label>
                      <q-item-label>{{
                        systemInfo.sauvgarde.filename
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Path</q-item-label>
                      <q-item-label class="text-wrap">{{
                        systemInfo.sauvgarde.path
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Size</q-item-label>
                      <q-item-label
                        >{{ systemInfo.sauvgarde.size }} bytes</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>

    <!-- Disk Information -->
    <q-card-section
      v-if="systemInfo.disks && systemInfo.disks.length"
      class="q-pt-none"
    >
      <q-expansion-item
        expand-separator
        icon="storage"
        label="Disk Space"
        default-opened
      >
        <q-card>
          <q-card-section>
            <div
              v-for="(disk, index) in systemInfo.disks"
              :key="index"
              class="q-mb-md"
            >
              <div class="row items-center">
                <div class="col-6 col-md-2">
                  <div class="text-subtitle2">{{ disk.drive }}</div>
                </div>

                <div class="col-12 col-md-8">
                  <q-linear-progress
                    :value="getDiskPercentage(disk.usagePercentage)"
                    :color="getDiskColor(disk.usagePercentage)"
                    size="25px"
                    track-color="grey-3"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${disk.usedSpace} / ${disk.totalSpace} (${disk.usagePercentage})`"
                      />
                    </div>
                  </q-linear-progress>
                </div>

                <div class="col-6 col-md-2 text-right">
                  <div class="text-caption">Free: {{ disk.freeSpace }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>

    <!-- Memory Information -->
    <q-card-section v-if="systemInfo.memory" class="q-pt-none">
      <q-expansion-item
        expand-separator
        icon="memory"
        label="Memory Usage"
        default-opened
      >
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>RAM Usage</q-item-label>
                    <q-linear-progress
                      :value="
                        getMemoryPercentage(
                          systemInfo.memory.ramUsagePercentage
                        )
                      "
                      color="primary"
                      size="25px"
                    >
                      <div class="absolute-full flex flex-center">
                        <q-badge
                          color="white"
                          text-color="black"
                          :label="`${systemInfo.memory.usedRAM} / ${systemInfo.memory.totalRAM} (${systemInfo.memory.ramUsagePercentage})`"
                        />
                      </div>
                    </q-linear-progress>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12 col-md-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Heap Memory</q-item-label>
                    <q-linear-progress
                      :value="getHeapPercentage(systemInfo.memory)"
                      color="secondary"
                      size="25px"
                    >
                      <div class="absolute-full flex flex-center">
                        <q-badge
                          color="white"
                          text-color="black"
                          :label="`${systemInfo.memory.heapMemoryUsage} / ${systemInfo.memory.heapMemoryMax}`"
                        />
                      </div>
                    </q-linear-progress>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12 col-md-6">
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Free RAM</q-item-label>
                      <q-item-label>{{
                        systemInfo.memory.freeRAM
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-6">
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Non-Heap Memory Usage</q-item-label>
                      <q-item-label>{{
                        systemInfo.memory.nonHeapMemoryUsage
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="Refresh" @click="$emit('refresh')" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'SystemInfoViewer',

  props: {
    systemInfo: {
      type: Object,
      required: true,
    },
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      // Assuming dateString format is "DD/MM/YYYY HH:mm:ss"
      const parts = dateString.split(' ')
      const dateParts = parts[0].split('/')
      const timeParts = parts[1].split(':')

      const dateObj = new Date(
        parseInt(dateParts[2]), // year
        parseInt(dateParts[1]) - 1, // month (0-indexed)
        parseInt(dateParts[0]), // day
        parseInt(timeParts[0]), // hour
        parseInt(timeParts[1]), // minute
        parseInt(timeParts[2]) // second
      )

      return date.formatDate(dateObj, 'MMMM D, YYYY HH:mm:ss')
    },

    getDiskPercentage(percentageStr) {
      if (!percentageStr || percentageStr === 'NaN%') return 0
      return parseFloat(percentageStr.replace(',', '.').replace('%', '')) / 100
    },

    getDiskColor(percentageStr) {
      if (!percentageStr || percentageStr === 'NaN%') return 'grey'
      const percentage = parseFloat(
        percentageStr.replace(',', '.').replace('%', '')
      )
      if (percentage < 70) return 'positive'
      if (percentage < 90) return 'warning'
      return 'negative'
    },

    getMemoryPercentage(percentageStr) {
      if (!percentageStr) return 0
      return parseFloat(percentageStr.replace(',', '.').replace('%', '')) / 100
    },

    getHeapPercentage(memory) {
      if (!memory || !memory.heapMemoryUsage || !memory.heapMemoryMax) return 0
      const used = parseInt(memory.heapMemoryUsage.replace(' MB', ''))
      const max = parseInt(memory.heapMemoryMax.replace(' MB', ''))
      return used / max
    },
  },
})
</script>

<style scoped>
.system-info-container {
  max-width: 1200px;
  margin: 0 auto;
}

.text-wrap {
  word-break: break-word;
}
</style>
