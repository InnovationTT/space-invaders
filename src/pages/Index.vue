<template>
  <Game/>
  
</template>

<script lang="ts">
import ExampleComponent from 'components/CompositionComponent.vue';
import { defineComponent, ref } from 'vue';
import Game from 'components/Game.vue'

export default defineComponent({
  components: {Game},
  setup() {
      return {}
  }

  
});
</script>
