<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Rank',
  data() {
    return {
            chartInstance: null,
            allData: null,
            startValue: 0,
            endValue: 9,
            timerId: null
    }
  },
  created() {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
            this.chartInstance.dispose()
            this.initChart()
            this.screenAdapter()
            this.updateChart()
    }
  },
  mounted() {
    this.initChart()
        this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
        initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, this.theme)

      const initOption = {
        title: {
          text: '▎Areas Sales Ranking',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
                    containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          value: 'value'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: 'white',
              rotate: 30
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)

            this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
            this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
        async getData(res) {
      // const { data: res } = await this.$http.get('/rank')
      console.log('res: ', res)
      this.allData = res
            this.allData.sort((a, b) => b.value - a.value)

      console.log(this.allData)
      this.updateChart()
            this.startInterval()
    },
        updateChart() {
            const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
                                          const provinceInfo = this.allData.map(item => item.name)
            const valueArr = this.allData.map(item => item.value)

      const dataOption = {
        xAxis: {
          data: provinceInfo
        },
        dataZoom: {
                    show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                let targetColorArr = null

                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }

                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: targetColorArr[0] },
                                    { offset: 1, color: targetColorArr[1] }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
        screenAdapter() {
      const titleFontSzie = (this.$refs.rankRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSzie
          }
        },
        series: [
          {
            barWidth: titleFontSzie,
            itemStyle: {
              barBorderRadius: [titleFontSzie / 2, titleFontSzie / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
        startInterval() {
            this.timerId && clearInterval(this.timerId)

      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped></style>
