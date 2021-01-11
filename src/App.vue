<template>
  <div id="app">
    <header class="title">
      <h1>Currency Conversor</h1>
    </header>
    <main class="content">
      <Conversor />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Conversor from "./components/conversor/conversor.vue";

@Component({
  components: {
    Conversor,
  }
})
export default class App extends Vue {

}
</script>

<style lang="scss" scoped>
@import './colors.scss';

.title {
  height: 40px;
  padding: 10px;
  text-align: center;
  background-color: $primary;
}

.content {
  margin: 20px auto;
  padding: 10px 3%;
  max-width: 1200px;
}
</style>