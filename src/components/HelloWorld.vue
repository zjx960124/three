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
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  visibility: hidden;
  color: #ffffff;
  font-size: 14px;
  width: 88px;
  height: 32px;
  text-align: center;
  line-height: 32px;
}
#cityTitles {
  z-index: 2;
  visibility: visible;
  color: #ffffff;
  font-size: 14px;
  width: 88px;
  height: 32px;
  text-align: center;
  line-height: 32px;
}
</style>
