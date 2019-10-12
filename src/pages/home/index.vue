<template>
  <div class="home">
    <header class="g-header-container">
<!--      <home-header></home-header>   里面不写内容的话直接单个闭合标签即可-->
<!--      用对象写法，变量控制class是否有；引用头部组件控制显示和隐藏-->
      <home-header :class="{'header-transition':isHeaderTransition}" ref="header"/>
    </header>
<!--    给滚动条传data数据进行更新，一旦data有变化就来更新滚动条-->
    <me-scroll
      :data="recommends"
      pullDown
      pullUp
      @pull-down="pullToRefresh"
      @pull-up="pullToLoadMore"
      @scroll="scroll"
      @scroll-end="scrollEnd"
      @pull-down-transition-end="pullDownTransitionEnd"
      ref="scroll"
    >
      <home-slider ref="slider"></home-slider>
      <home-nav></home-nav>
<!--      获取来自子组件的信息渲染到这来-->
      <home-recommend @loaded="getRecommends" ref="recommend"/>

    </me-scroll>
    <div class="g-backtop-container">
      <me-backtop :visible="isBacktopVisible" @backtop = "backToTop"/>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import MeScroll from 'base/scroll';
  import MeBacktop from 'base/backtop';
  import HomeHeader from  './header';
  import HomeSlider from './slider';
  import HomeNav from './nav';
  import HomeRecommend from './recommend';
  import {HEADER_TRANSITION_HEIGHT} from './config';
    export default {
        name: 'home',
        components: {
          MeScroll,
          MeBacktop,
          HomeHeader,
          HomeSlider,
          HomeNav,
          HomeRecommend
        },
        data() {
          return {
            //接收数据
            recommends:[],
            //设置上升悬浮按钮 默认隐藏
            isBacktopVisible: false,
            //设置动画是否开启
            isHeaderTransition:false
          };
        },

        // created() {
        //   setTimeout(() => {
        //     this.isBacktopVisible = true;
        //   },1000)
        // },
        methods: {
          //更新滚动条
          updateScroll() {

          },
          //获取数据的方法
          getRecommends(recommends) {
            this.recommends = recommends;
          },
          //下拉刷新，end参数指pullDownEnd这个方法 子组件$emit触发事件时候的传参
          pullToRefresh(end) {
            this.$refs.slider.update().then(end);
            // setTimeout(() => {
            //   console.log('下拉刷新');
            //   end();
            // },1000);
          },
          pullToLoadMore(end) {
            this.$refs.recommend.update().then(end).catch(err => {
              //处理没有更多数据的情况
              //禁止继续加载更多数据：这里没写
              //替换上拉时的loading,改为没有更多数据了：这里也还没写
              if(err) {
                console.log(err);
              }
              end();
            });
            // setTimeout(() => {
            //   console.log('上拉刷新');
            //   end();
            // },1000);
            //上拉目的是获得推荐列表，所以先把对应组件获取到
          },

          //手拖动即滚动的时候触发的事件方法
          scroll(translate) {
            this.changeHeaderStatus(translate);
          },

          //监听，用于滚动的时候悬浮按钮出现，用于后面点击之后返回顶部；
          // 1， @scroll-end="scrollEnd"  2，子组件 this.$emit('scroll-end'，……）
          scrollEnd(translate, scroll, pulling) {
            // console.log(translate);//滚动还没有回到顶部就显示头部的情况，就打印出滚动距离=0的情况，这里插件没有好办法，需要多判断
              //加载完成（不再加载的时候）的时候出现头部。加载的过程中，不允许设为显示
            if(!pulling) {
              //手松开滚动结束也得触发，实现头部显示隐藏.
              this.changeHeaderStatus(translate);
            }
            this.isBacktopVisible = translate < 0 && -translate > scroll.height;

          },
          //实现加载完成，弹回去的时候，出现头部
          pullDownTransitionEnd() {
            this.$refs.header.show();
          },

          //点击之后返回顶部
          //1，ref="scroll" 2，@backtop = "backToTop" 3，子组件backtop this.$emit('backtop');
          backToTop() {
            this.$refs.scroll && this.$refs.scroll.scrollToTop();
          },

          //改变头部的状态。显示和隐藏.translate是滚动条滚动的距离
          changeHeaderStatus(translate) {
            //上拉就大于0
            if (translate > 0) {
              this.$refs.header.hide();
              return;
            }

            this.$refs.header.show();
            this.isHeaderTransition = -translate > HEADER_TRANSITION_HEIGHT;


          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .home {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: $bgc-theme;
  }
</style>
