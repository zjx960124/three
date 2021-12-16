<template>
  <div class="hello">
    <canvas id="canvas" width="1000" height="1000"></canvas>
    <div id="tooltip"></div>
  </div>
</template>

<script>
  import { Map } from "../utils/mapClass";
  export default {
    name: 'HelloWorld',
    props: {
    },
    data() {
      return {
        data: null
      };
    },
    mounted() {
      new Map().init();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #tooltip {
    position: absolute;
    z-index: 2;
    background: white;
    padding: 10px;
    border-radius: 2px;
    visibility: hidden;
  }
</style>
