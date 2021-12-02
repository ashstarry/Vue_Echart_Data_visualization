<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from 'utils/theme_utils'

export default {
    name: 'Seller',
  data() {
    return {
            chartInstance: null,
            allData: null,
            curretnPage: 1,
            totalPage: 0,
            timerId: null,
            PointerColor: this.axisPointerColor,
    }
  },
  created() {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  computed: {
    ...mapState(['theme']),
    axisPointerColor() {
      return getThemeValue(this.theme).sellerAxisPointerColor
    },
  },
  watch: {
    theme() {
            this.chartInstance.dispose()
            this.initChart()
            this.screenAdapter()
            this.updateChart()
    },
  },
  mounted() {
        this.initChart()
        this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: '',
    })
        this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
    destroyed() {
    clearInterval(this.timeID)
        window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
        initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme)
            const initOption = {
        title: {
          text: '▎Sales Statistics',
          left: 20,
          top: 20,
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
                    containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
                    trigger: 'axis',
          axisPointer: {
                        type: 'line',
            lineStyle: {
              color: this.axisPointerColor,
            },
                        z: 0,
          },
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
              },
            },
                        itemStyle: {
                                          color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#5052EE' },
                                { offset: 1, color: '#AB6EE5' },
              ]),
            },
          },
        ],
      }

      this.chartInstance.setOption(initOption)

            this.chartInstance.on('mouseover', () => {
        this.timerId && clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
        getData(res) {
      // http://101.34.160.195:8888/api/seller
      // const { data: res } = await this.$http.get('seller')
      
      this.allData = res
            this.allData.sort((a, b) => b.value - a.value)
            this.totalPage = Math.ceil(this.allData.length / 5)

            this.updateChart()
            this.startInterval()
    },
        updateChart() {
            const start = (this.curretnPage - 1) * 5
      const end = this.curretnPage * 5
      const showData = this.allData.slice(start, end)
      console.log('showData: ', showData)

            const sellerNames = showData.map(item => item.name)
            const sellerValues = showData.map(item => item.value)

            const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      }

            this.chartInstance.setOption(dataOption)
    },
        startInterval() {
            this.timerId && clearInterval(this.timerId)

      this.timerId = setInterval(() => {
        this.curretnPage++
                if (this.curretnPage > this.totalPage) this.curretnPage = 1

        this.updateChart()
      }, 3000)
    },
        screenAdapter() {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
            const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
    },
  },
}
</script>

<style lang="less" scoped>
</style>