<template>
  <div class="com-container" @dblclick="chinaMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
import { mapState } from 'vuex'

export default {
  name: 'Map',
  data() {
    return {
            axiosInstance: null,
            chartInstance: null,
            chinaMapData: null,
            allData: null,
            cityMapData: {},
    }
  },
  computed: {
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      console.log('主题切换了')
            this.chartInstance.dispose()
            this.initChart()
            this.screenAdapter()
            this.updateChart()
    },
  },
  created() {
    this.axiosInstance = axios.create({
      baseURL: 'http://101.34.160.195:9997',
    })
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
        this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('stockData')
  },
  methods: {
        async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, this.theme)
            
      if (!this.chinaMapData) {
        const { data: res } = await this.axiosInstance.get('/map/china.json')
        this.chinaMapData = res
      }
            this.$echarts.registerMap('china', this.chinaMapData)

            const initOption = {
        title: {
          text: '▎Merchant Arrangement',
          left: 20,
          top: 20,
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
                    roam: true,
                    itemStyle: {
                        areaColor: '#2E72BF',
                        borderColor: '#333',
          },
          label: {
            show: true,
            color: 'white',
            formatter: `{a}`,
          },
        },
      }
      this.chartInstance.setOption(initOption)

            this.chartInstance.on('click', async e => {
                        const ProvinceInfo = getProvinceMapInfo(e.name)

                if (!this.cityMapData[ProvinceInfo.key]) {
                    const { data: res } = await this.axiosInstance.get(ProvinceInfo.path)
                    this.cityMapData[ProvinceInfo.key] = res
                    this.$echarts.registerMap(ProvinceInfo.key, res)
        }

                const changeOption = {
          geo: {
            map: ProvinceInfo.key,
          },
        }
                this.chartInstance.setOption(changeOption)
      })
    },
        getData(res) {
      // http://101.34.160.195:8888/api/map
      // const { data: res } = await this.$http.get('/map')
      this.allData = res
      console.log('res-----------------------------------------: ', res)

      this.updateChart()
    },
        updateChart() {
            const legendArr = this.allData.map(item => {
        return item.name
      })
            const seriesArr = this.allData.map(item => {
                return {
          type: 'effectScatter',
                    name: item.name,
          data: item.children,
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        scale: 10,
                        brushType: 'stroke',
          },
        }
      })

            const dataOption = {
        legend: {
          left: '2%',
          bottom: '5%',
                    orient: 'verticle',
          data: legendArr.reverse(),
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
        screenAdapter() {
            const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6
      console.log('titleFontSize: ', titleFontSize)

            const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
                    itemWidth: titleFontSize / 2,
                    itemHeight: titleFontSize / 2,
                    itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      }

      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
        chinaMap() {
      const chinaMapOption = {
        geo: {
          map: 'china',
        },
      }
      this.chartInstance.setOption(chinaMapOption)
    },
  },
}
</script>

<style lang="less" scoped>
</style>