<template>
  <div class="com-container">
    <div class="title" @click="showMenu = !showMenu" :style="comStyle">
      <span class="before-icon">▎</span>
      <span>{{ showTitle }}</span>
      <span class="iconfont title-icon" :style="comStyle">&#xe6eb;</span>
      <div class="select-con">
        <div class="select-item" v-show="showMenu" @click.prevent="handleSelect(item.key)" v-for="item in selectTypes" :key="item.key">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from 'utils/theme_utils'

export default {
    name: 'Trend',
  data() {
    return {
      chartInstance: null,
      allData: null,
      showMenu: false,
      activeName: 'map',
      titleFontSize: 0,
      value: ''
    }
  },
  created() {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  computed: {
    ...mapState(['theme']),
    selectTypes() {
      if (!this.allData) return []
      return this.allData.type.filter(item => item.key !== this.activeName)
    },
    showTitle() {
      if (!this.allData) return ''
      return this.allData[this.activeName].title
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    }
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
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
        this.$socket.unRegisterCallBack('trendData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, this.theme)
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
                tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: '18%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData(res) {
      // const { data: res } = await this.$http.get('http://101.34.160.195:8888/api/trend')
      this.allData = res
      console.log('res: ', res)

      this.updateChart()
    },

    updateChart() {

      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']

      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']

      const month = this.allData.common.month
      const valueArr = this.allData[this.activeName].data

      const seriesArr = valueArr.map((item, index) => {
        return {
                    name: item.name,
          type: 'line',
          data: item.data,
        
          stack: this.activeName,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const legendArr = valueArr.map(item => item.name)

      const dataOption = {
        xAxis: {
          data: month
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
            this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 1.3
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(currentType) {
      this.activeName = currentType
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 50px;
  top: 20px;
  z-index: 999;
  color: white;
  cursor: pointer;

  .before-icon {
    position: absolute;
    left: -20px;
  }
  .title-icon {
    margin-left: 10px;
  }
}
</style>
