<template>
  <div class="slider-wrapper">
<!--    <me-loading v-if="!sliders.length"/>-->
    <div class="loading-container" v-if="!sliders.length">
      <me-loading inline/>
    </div>
      <me-slider
        :data="sliders"
        :direaction="direction"
        :loop="loop"
        :interval="interval"
        :pagination="pagination"
        v-else
      >
        <swiper-slide
          v-for="(item, index) in sliders"
          :key="index"
        >
          <a href="javascript:;">
            <img :src="item" alt="" class="slider-img">
          </a>

        </swiper-slide>
      </me-slider>
  </div>
</template>

<script>
    import MeSlider from 'base/slider';
    import MeLoading from 'base/loading';
    import {swiperSlide} from 'vue-awesome-swiper';
    import {sliderOptions} from './config';
    import {getProduct} from 'api/product';

    export default {
        name: 'ProductSlider',
        components:{
          MeSlider,
          MeLoading,
          swiperSlide
        },
      data() {
        return {
          direction: sliderOptions.direction,
          loop: sliderOptions.loop,
          interval: sliderOptions.interval,
          pagination: sliderOptions.pagination,
          sliders:[],
          };
        },
        created() {
          // this.getSliders();
          this.getSliders().then(() => {
            // 数据获取成功，告诉父组件可以更新滚动条了
            this.$emit('loaded');
          })
        },
        methods:{
          update(){
            return this.getSliders();
          },
          getSliders() {
            return getProduct(this.$route.params.id).then(data => {
              this.sliders = data.content.sliders;
            });
          }
        }

    };
</script>
<style lang="scss" scoped>

  .loading-container {
    margin-top: 200px;
  }

  .slider-wapper {
    width: 100%;
    height: 500px;
  }
  .slider-img {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

</style>
