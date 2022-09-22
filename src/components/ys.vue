<template>
  <div class="ys-view">
    <div class="wish-buttons-wrapper" style="display: none">
      <div class="wish-buttons">
        <div class="wish-button" onclick="wish(1)">祈愿 * 1</div>
        <div class="wish-button" onclick="wish(10)">祈愿 * 10</div>
      </div>
    </div>
    <div class="wish-result" style="display: none">
      <div class="single-result opacity10"></div>
      <div class="multiple-result opacity10"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  mounted() { },
  methods: {},
}
</script>
<style lang="scss" scoped>
@import url("../ys/css/index.css");
@import url("../ys/css/result.css");
.ys-view {
  width: 100vw;
  height: 100vh;
}
</style>
