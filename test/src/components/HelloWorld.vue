<template lang="pug">
  .sec
    .timer
      p {{time | tmrFmt}}
      button(@click='onStart()') start
      button(@click='onPause()') pause
      button(@click='onStop()') stop
    .table
      ul(v-for="item in table")
        li {{item.SiteName}}
        li {{item.Pollutant || '無資料'}}
        li {{item.Status}}
        li {{item['PM2.5_AVG']}}
      button(@click='onInc()') 順排
      button(@click='onDec()') 逆排
    .multiples35
      p {{ans}}
</template>

<script>
/* eslint-disable */
export default {
  name: 'HelloWorld',
  data() {
    return {
      time: 0,
      tid: 0,
      type: 'stop',
      //
      table: [],
      sortTypeInc: true,
      //
      ans: 0
    };
  },
  methods: {
    tmrStart() {
      if (/start/.test(this.type)) {
        this.time = Date.now();
        setTimeout(() => { this.tmrStart(); }, 0.5 * 1000);
      } else if (/pause/.test(this.type)) {
        setTimeout(() => { this.tmrStart(); }, 0.5 * 1000);
      }
    },
    onStart() {
      this.type = 'start';
      this.tmrStart();
    },
    onPause() {
      this.type = 'pause';
    },
    onStop() {
      this.type = 'stop';
      clearInterval(this.tid);
    },
    //
    getData() {
      const url = 'http://opendata2.epa.gov.tw/AQI.json'
      return new Promise((resolve) => {
        if(/localhost/.test(window.location.href)) {
          const list = [{"SiteName":"a基隆","County":"基隆市","AQI":"37","Pollutant":"","Status":"良好","SO2":"1.4","CO":"0.19","CO_8hr":"0.2","O3":"36","O3_8hr":"40","PM10":"18","PM2.5":"11","NO2":"5","NOx":"6.1","NO":"1","WindSpeed":"2.2","WindDirec":"81","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"8","PM10_AVG":"16","Latitude":"25.129167","Longitude":"121.760056"},{"SiteName":"g汐止","County":"新北市","AQI":"31","Pollutant":"","Status":"良好","SO2":"1.6","CO":"0.22","CO_8hr":"0.2","O3":"30","O3_8hr":"34","PM10":"11","PM2.5":"4","NO2":"14","NOx":"17","NO":"2.2","WindSpeed":"3.3","WindDirec":"35","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"5","PM10_AVG":"11","Latitude":"25.067131","Longitude":"121.6423"},{"SiteName":"c萬里","County":"新北市","AQI":"53","Pollutant":"懸浮微粒","Status":"普通","SO2":"3.8","CO":"0.21","CO_8hr":"0.2","O3":"38","O3_8hr":"43","PM10":"29","PM2.5":"12","NO2":"8.2","NOx":"9.1","NO":"0.9","WindSpeed":"1.8","WindDirec":"39","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"10","PM10_AVG":"58","Latitude":"25.179667","Longitude":"121.689881"},{"SiteName":"新店","County":"新北市","AQI":"23","Pollutant":"","Status":"良好","SO2":"1.8","CO":"0.34","CO_8hr":"0.4","O3":"23","O3_8hr":"25","PM10":"13","PM2.5":"4","NO2":"17","NOx":"20","NO":"3","WindSpeed":"1.4","WindDirec":"87","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"5","PM10_AVG":"13","Latitude":"24.977222","Longitude":"121.537778"},{"SiteName":"土城","County":"新北市","AQI":"34","Pollutant":"","Status":"良好","SO2":"0.9","CO":"0.39","CO_8hr":"0.4","O3":"23","O3_8hr":"28","PM10":"11","PM2.5":"12","NO2":"19","NOx":"20","NO":"1.5","WindSpeed":"1.8","WindDirec":"338","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"11","PM10_AVG":"13","Latitude":"24.982528","Longitude":"121.451861"},{"SiteName":"板橋","County":"新北市","AQI":"28","Pollutant":"","Status":"良好","SO2":"1.8","CO":"0.41","CO_8hr":"0.4","O3":"19","O3_8hr":"25","PM10":"12","PM2.5":"8","NO2":"23","NOx":"26","NO":"2.5","WindSpeed":"3.6","WindDirec":"76","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"9","PM10_AVG":"13","Latitude":"25.012972","Longitude":"121.458667"},{"SiteName":"新莊","County":"新北市","AQI":"29","Pollutant":"","Status":"良好","SO2":"2.2","CO":"0.31","CO_8hr":"0.3","O3":"30","O3_8hr":"31","PM10":"11","PM2.5":"6","NO2":"14","NOx":"15","NO":"1.4","WindSpeed":"5.5","WindDirec":"55","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"4","PM10_AVG":"9","Latitude":"25.037972","Longitude":"121.4325"},{"SiteName":"菜寮","County":"新北市","AQI":"22","Pollutant":"","Status":"良好","SO2":"2.2","CO":"0.33","CO_8hr":"0.4","O3":"23","O3_8hr":"24","PM10":"21","PM2.5":"7","NO2":"13","NOx":"16","NO":"2.5","WindSpeed":"3.7","WindDirec":"82","PublishTime":"2018-11-02 16:00","PM2.5_AVG":"5","PM10_AVG":"19","Latitude":"25.06895","Longitude":"121.481028"}]
          resolve(list)
        } else {
          $.ajax({
            url,
            cache: false,
            method: 'GET',
            processData: false, // 重要
            contentType: false, // 重要
            dataType: 'json',
          })
            .done((response) => {
              resolve(response)
            })
            .fail((jqXHR, textStatus) => {
              reject('系統繁忙中，請稍候再試')
            })
            .always((e) => {
              reject('系統繁忙中，請稍候再試')
            })
        }
      })
    },
    updateTableWith10sec() {
      this.getData()
        .then((arr) => {
          this.table = arr
          if(this.sortTypeInc) {
            this.table = this.sortTableBySiteNameInc(arr)
          } else {
            this.table = this.sortTableBySiteNameDec(arr)
          }
        })
      setTimeout(() => {
        this.updateTableWith10sec()
      }, 10 * 1000)
    },
    onInc(){
      const arr = this.table
      this.table = this.sortTableBySiteNameInc(arr)
    },
    onDec(){
      const arr = this.table
      this.table = this.sortTableBySiteNameDec(arr)
    },
    sortTableBySiteNameInc(arr) {
      return arr.sort((a, b) => { return a.SiteName - b.SiteName })
    },
    sortTableBySiteNameDec(arr) {
      return arr.sort((a, b) => { return b.SiteName - a.SiteName })
    },
    //
    getSum() {

    }
  },
  mounted() {
    this.updateTableWith10sec()
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  ul
    display: flex
    flex-wrap: wrap
    list-style: none
    li
      width: 25%
</style>
