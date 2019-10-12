<template>
  <div class="slider-wapper">
    <me-loading v-if="!sliders.length"/>
    <me-slider
      :data="sliders"
      :direction="direction"
      :loop="loop"
      :interval="interval"
      :pagination="pagination"
      v-else
    >
      <swiper-slide
        v-for="(item, index) in sliders"
        :key="index">
        <a :href="item.linkUrl" alt="" class='slider-link'>
          <img :src="item.picUrl" alt="" class='slider-img'>
        </a>
      </swiper-slide>
    </me-slider>
  </div>
</template>

<script>
  import MeSlider from 'base/slider';
  import {swiperSlide} from 'vue-awesome-swiper';
  import {sliderOptions} from './config';
  import {getHomeSlider} from 'api/home';
  import MeLoading from 'base/loading';

  export default {
        name: 'HomeSlider',
        components: {
          MeSlider,
          swiperSlide,
          MeLoading
        },
      data() {
          return {
            direction: sliderOptions.direction,
            loop: sliderOptions.loop,
            interval: sliderOptions.interval,
            pagination: sliderOptions.pagination,
            sliders:[
              // {
              //  'linkUrl':'https://www.imooc.com',
              //  'picUrl':require('./1.jpg')   //js本地引入图片得加require
              // },
              // {
              //  'linkUrl':'https://www.imooc.com',
              //  'picUrl':require('./2.jpg')
              // },
              // {
              //  'linkUrl':'https://www.imooc.com',
              //  'picUrl':require('./3.jpg')
              // },{
              //  'linkUrl':'https://www.imooc.com',
              //  'picUrl':require('./4.jpg')
              // }
            ]
        };
      },

// created用来获取远程数据
    created() {
      // getHomeSlider();
      this.getSliders();
    },
    // methods是对象，里面可以放置要执行的函数；事件操作有关也这里写
    methods:{
      //提供给外部调用的api
      update(){
        return this.getSliders();
      },

      getSliders() {
        //promise对象，直接返回
        return getHomeSlider().then(data => {
          this.sliders = data;
        });
      }
    }

  };
</script>

<style lang="scss" scoped>
  .slider-wapper {
    width: 100%;
    height: 183px;
  }

  .slider-link {
    display: block;
  }

  .slider-link,
  .slider-img {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

</style>
