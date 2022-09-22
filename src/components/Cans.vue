<template>
  <div class="cans-view">
    <div class="bnt-view">
      <div class="btn" @click="handle">线</div>
      <div class="btn" @click="handleShan">扇形</div>
    </div>
    <canvas id="mycanvas" width="800" height="800"></canvas>
  </div>
</template>
<script>
export default {
  name: 'Cans',
  data() {
    return {}
  },
  mounted() { },
  methods: {
    handle() {
      const canvas = document.querySelector('#mycanvas');
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'rgba(81, 160, 255,1)'
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';

      //初始值
      const startX = 100;
      const startY = 100;
      const endX = 700;
      const endY = 700;
      let prex = startX;
      let preY = startY;
      let nextX;
      let nextY;

      let startTime;

      const duration = 1000;

      const step = (currentTime) => {
        !startTime && (startTime = currentTime);
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const draw = () => {
          ctx.beginPath();
          ctx.moveTo(prex, preY);
          prex = nextX = startX + (endX - startX) * progress;
          preY = nextY = startY + (endY - startY) * progress;
          ctx.lineTo(nextX, nextY);
          ctx.strokeStyle = `rgba(${81}, ${160}, ${255},${0.25})`;
          ctx.stroke();
        }
        draw();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          console.log('执行完毕');
        }
      }
      requestAnimationFrame(step)
    },
    handleShan() {
      const canvas = document.querySelector('#mycanvas');
      const ctx = canvas.getContext('2d');

      ctx.lineWidth = 4;
      ctx.save();
      ctx.translate(30, 30);
      ctx.save();
      ctx.arc(0, 0, 30, 0, 45 * Math.PI / 180);
      ctx.restore();
      ctx.moveTo(0, 0);
      ctx.lineTo(30, 0);
      ctx.rotate(45 * Math.PI / 180);
      ctx.moveTo(0, 0);
      ctx.lineTo(30, 0);
      ctx.stroke();

      ctx.restore();
      // ctx.save();

    }
  },
}
</script>
<style scoped>
.cans-view {
  width: 100vw;
  height: 100vh;
}
.bnt-view {
  width: 100%;
  height: 80px;
  text-align: left;
}
.btn {
  background: #cccccc;
  width: 120px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
}
.btn + .btn {
  margin-left: 20px;
}
</style>