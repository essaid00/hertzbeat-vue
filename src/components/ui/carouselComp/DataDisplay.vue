<template>

  <q-card :bordered="true" flat>
    <q-card-section>
      <q-list class="bg-green">
        <q-item>
          <q-item-section>
            <q-item-label>Category</q-item-label>
            <q-item-label caption>{{ formattedData.category }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>App</q-item-label>
            <q-item-label caption>{{ formattedData.app }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Size</q-item-label>
            <q-item-label caption>{{ formattedData.size }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Available Size</q-item-label>
            <q-item-label caption>{{ formattedData.availableSize }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Unmanaged Size</q-item-label>
            <q-item-label caption>{{ formattedData.unManageSize }}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- Add other fields as needed -->
      </q-list>
    </q-card-section>
  </q-card>
</template>


<script>
import { computed } from 'vue';

export default {
  name: 'DataDisplay',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {


    const formattedData = computed(() => {
      return props.data
    });

    return {
      formattedData,

    };
  }
}
</script>

<style scoped>
.q-card {
  max-width: 400px;
  margin: auto;
}

.q-item-section {
  display: flex;
  justify-content: space-between;
}

.text-subtitle2 {
  font-weight: bold;
}

.text-negative {
  color: red;
}

.text-positive {
  color: green;
}

.text-body1 {
  font-size: 16px;
}
</style>
