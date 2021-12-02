<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <i class="iconfont icon-left" @click="toLeft" :style="themeStyle">&#xe6ef;</i>
    <i class="iconfont icon-right" @click="toRight" :style="themeStyle">&#xe6ed;</i>
    <span class="cate-name" :style="themeStyle">{{ cateName }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from 'utils/theme_utils'
import _ from 'lodash'

export default {
  name: 'Hot',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: null,
    }
  },
  created() {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  computed: {
    ...mapState(['theme']),
    cateName() {
      if (!this.allData) return ''
      return this.allData[this.currentIndex].name
    },
    themeStyle() {
      if (!this.titleFontSize) {
        return { color: getThemeValue(this.theme).titleColor }
      }
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor,
      }
    },
  },
  watch: {
    theme() {
      console.log('change theme')
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
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, this.theme)

      const initOption = {
        title: {
          text: '▎Hot Product Percentiles',
          left: 20,
          top: 20,
        },
        legend: {
          top: '15%',
                    icon: 'circle',
        },
        tooltip: {
          show: true,
                    formatter: arg => {
                                    const thirdCategory = arg.data.children
                        let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
                        let showStr = ''
            thirdCategory.forEach(item => {
              showStr += `
                ${item.name}：${_.round((item.value / total) * 100, 2)}% <br/>
              `
            })
            return showStr
          },
        },
        series: [
          {
            type: 'pie',
            label: {
              show: true,
              formatter:`{b}{d}%`
            },
                        emphasis: {
              labelLine: {
                show: true,
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
    },
        getData(res) {
      // const { data: res } = await this.$http.get('/hotproduct')
      this.allData = res
      console.log(this.allData)
      this.updateChart()
    },
        updateChart() {
      const legenDateArr = this.allData[this.currentIndex].children.map(item => item.name)
      const seriesDataArr = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children,
        }
      })
      const dataOption = {
        legend: {
          data: legenDateArr,
        },
        series: [
          {
            data: seriesDataArr,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6
      console.log('titleFontSize: ', this.titleFontSize)

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 1.2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%'],
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
        toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) this.currentIndex = this.allData.length - 1
      this.updateChart()
    },
        toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) this.currentIndex = 0
      this.updateChart()
    },
  },
}
</script>

<style lang="less" scoped>
.com-container {
  i {
    z-index: 999;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    cursor: pointer;
  }
  i.icon-left {
    left: 10%;
  }
  i.icon-right {
    right: 10%;
  }
  .cate-name {
    position: absolute;
    right: 10%;
    bottom: 20px;
    z-index: 999;
  }
}
</style>