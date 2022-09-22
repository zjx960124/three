<template>
  <div class="box-container">
    <div id="box"></div>
  </div>
</template>

<script>
import { Boxs } from '../utils/box'
export default {
  name: 'Box',
  props: {
  },
  data() {
    return {
      data: null
    };
  },
  mounted() {
    new Boxs('box');
  }
}
</script>

<style scoped>
.box-container {
  width: 100vw;
  height: 100vh;
}
#tooltip {
  position: absolute;
  z-index: 2;
  background: white;
  padding: 10px;
  border-radius: 2px;
  visibility: hidden;
}
</style>