<script>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue'
import { useUiStore } from 'stores/ui'
import { useSummaryStore } from 'stores/Summary';
import DataDisplay from './carouselComp/DataDisplay.vue';
export default {
  name: 'Carousel',
  components: { DataDisplay },
  props: {

  },
  setup() {


    const bannerIndex = ref(0)
    const bannerData = ref([])
    const loading = ref(false)
    const uiStore = useUiStore()
    const SummaryStore = useSummaryStore()
    const displayedAsset = ref(1)
    const step_1 = ref('Upload multiple csv files to run sql queries')
    const step_2 = ref("Smart editor to write SQL queries")
    const step_3 = ref("Run SQL queries to analyze data")
    const step_4 = ref("Download the query result in csv format")
    onMounted(async () => {
      SummaryStore.loadSummary().then(() => {
        bannerData.value = (SummaryStore.Summary)
      })

      // console.log(bannerData)

    })
    const getStarted = () => {
      // console.log(bannerData.value)
      // console.log(SummaryStore.Summary)
      // bannerData.value = (SummaryStore.Summary)
    }



    return {
      bannerData, getStarted, displayedAsset,
    }
  },
}
</script>
<template>

  <q-card>


    <q-card-section class="tw-text-primarytext q-pt-4 q-mt-2">
      <div class="bg-green">
        <q-carousel
v-model="displayedAsset" transition-prev="slide-right" transition-next="slide-left" animated
          infinite arrows :autoplay="6000" vertical swipeable control-color="white" height="450px"
          navigation-icon="radio_button_unchecked" navigation padding
          class="bg-purple text-white shadow-1 rounded-borders">



          <q-carousel-slide v-for="(asset, index) in bannerData" :key="index" :name="index" class="">
            <DataDisplay :data="asset" />

          </q-carousel-slide>
        </q-carousel>

      </div>

    </q-card-section>

  </q-card>


</template>
<style lang="scss" scoped></style>
