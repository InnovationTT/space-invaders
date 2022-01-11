<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { initializeApp } from "firebase/app";
import Game from 'components/Game.vue';

export default defineComponent({
  name: 'App',
  components: {
    Game,
  },
  setup(){
    const firebaseConfig = {
      apiKey: "AIzaSyD67vZOxu2ssGYEpViZx3V6F0v8dQIZlqg",
      authDomain: "space-invaders-8e9d9.firebaseapp.com",
      projectId: "space-invaders-8e9d9",
      storageBucket: "space-invaders-8e9d9.appspot.com",
      messagingSenderId: "952290141043",
      appId: "1:952290141043:web:471134ec4c99addc0fdb06"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
  }
})
</script>
