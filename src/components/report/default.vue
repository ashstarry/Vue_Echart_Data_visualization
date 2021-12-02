<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  name: "Trend",
  data() {
    return {
            chartInstance: null,
            allData: null,
    };
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods: {

    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, "chalk");
      const initOption = {};
      this.chartInstance.setOption(initOption);
    },
        async getData() {
      // this.$http.get()
      this.updateChart()
    },
        updateChart(){
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
        screenAdapter(){
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
};
</script>

<style lang="less" scoped>
</style>