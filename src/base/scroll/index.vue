<template>
  <swiper :options="swiperOption" ref="swiper">
    <div class="mine-scroll-pull-down" v-if="pullDown">
        <me-loading :text="pullDownText" inline ref="pullDownLoading"/>
    </div>
    <swiper-slide>
      <slot></slot>
    </swiper-slide>
    <div class="mine-scroll-pull-up" v-if="pullUp">
      <me-loading :text="pullUpText" inline ref="pullUpLoading"/>
    </div>
    <div class="swiper-scrollbar" v-if="scrollbar" slot="scrollbar"></div>
  </swiper>
</template>

<script>
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import MeLoading from 'base/loading';
  import {
    PULL_DOWN_HEIGHT,
    PULL_DOWN_TEXT_INIT,
    PULL_DOWN_TEXT_START,
    PULL_DOWN_TEXT_ING,
    PULL_DOWN_TEXT_END,
    PULL_UP_HEIGHT,
    PULL_UP_TEXT_INIT,
    PULL_UP_TEXT_START,
    PULL_UP_TEXT_ING,
    PULL_UP_TEXT_END
  } from './config';

    export default {
      name: 'MeScroll',
      components: {
        swiper,
        swiperSlide,
        MeLoading
      },
      props: {
        scrollbar: {
          type: Boolean,
          default: true,
        },

        //接收数据，跟下边的data方法不是同一个，仅仅命名罢了
        data: {
          //不知道数据是什么，确定是数组对象，只需要确定是否更新了数据就行
          type: [Array, Object]
        },
        //接收参数
        pullDown: {
            type:Boolean,
            default:false
        },
        pullUp:{
          type:Boolean,
          default:false
        }

      },
      // data() {
      //   return {
      //     pulling:false, // 下拉或者上拉过程中不发送请求，一个标志确定状态
      //     pullDownText: PULL_DOWN_TEXT_INIT,
      //     pullUpText: PULL_UP_TEXT_INIT,
      //     swiperOption: {
      //       direction: 'vertical', //方向
      //       slidesPerView: 'auto', //原指一页里面能够看到几张图片，这里指slider里能够看到的内容，自适应
      //       freeMode: true, //幻灯片滚动是一张图一张图固定距离，这里指滚动自由模式，随便滚动。
      //       setWrapperSize: true,//给类为slider-wrapper的div增加height
      //       scrollbar: {
      //         el: this.scrollbar ? '.swiper-scrollbar' : null,
      //         hide: true //滚动条是否自动隐藏
      //         //scrollbar滚动条是否存在判断
      //       },
      //       on: {
      //         // data配置数据，滚动的时候触发swiper的事件
      //         sliderMove: this.scroll,
      //         //回调函数，触摸释放时执行，接受 touchend事件作为参数。（释放即执行）
      //         touchEnd:this.touchEnd
      //       }
      //     }
      //   };
      // },
      //监测自定义的data的变化
      watch: {
          data() {
            this.update();
          }
      },
      //去掉data，因为里面的不需要时刻监听，放在Init方法里，需要created生命周期钩子里调用
      created() {
        this.init();
      },
      methods: {
        update() {
          // 存在swiper实例化对象就调用它的更新方法
          // this.$refs.swiper && this.$refs.swiper.swiper.update();
          this.$nextTick(()=> {
            this.$refs.swiper && this.$refs.swiper.swiper.update();
          });
          // console.log(this.$refs);
          // console.log(this.$refs.swiper);
        },

        //暴露出api方法给外部调用
        scrollToTop(speed, runCallbacks) {
          //返回第几个幻灯片，本组件只有1个，所以也可以算回到顶部。其它是slideTo api参数.一般不用传值，使用默认值
          this.$refs.swiper && this.$refs.swiper.swiper.slideTo(0, speed, runCallbacks);
        },

        init(){
            this.pulling = false, // 下拉或者上拉过程中不发送请求，一个标志确定状态
            this.pullDownText = PULL_DOWN_TEXT_INIT,
            this.pullUpText = PULL_UP_TEXT_INIT,
            this.swiperOption = {
              direction: 'vertical', //方向
              slidesPerView: 'auto', //原指一页里面能够看到几张图片，这里指slider里能够看到的内容，自适应
              freeMode: true, //幻灯片滚动是一张图一张图固定距离，这里指滚动自由模式，随便滚动。
              setWrapperSize: true,//给类为slider-wrapper的div增加height
              scrollbar: {
              el: this.scrollbar ? '.swiper-scrollbar' : null,
                hide: true //滚动条是否自动隐藏
              //scrollbar滚动条是否存在判断
            },
              on: {
              // data配置数据，滚动的时候触发swiper的事件
                sliderMove: this.scroll,
                //回调函数，触摸释放时执行，接受 touchend事件作为参数。（释放即执行）
                touchEnd:this.touchEnd,
                //当滚动停止的时候触发这个事件给外面使用，这里定义一个方法，然后再触发外面的事件，用于返回顶部
                transitionEnd:this.scrollEnd
            }
          };
        },
        //上面是供外部调用的api，下边是内部自己使用的
        scroll() {
          //保存实例对象。方便多次调用；this.$refs.swiper找到swiper组件，后面是指找到它的实例对象
          const swiper = this.$refs.swiper.swiper;
          //触发事件，用于后面头部显示隐藏等操作
          this.$emit('scroll', swiper.translate, this.$refs.swiper.swiper);
          // console.log(this.$refs.swiper);
          // console.log(this.$refs.swiper.swiper);
          // console.log(swiper.translate);
          //如果正在拉动，就直接返回
          if(this.pulling) {
            return;
          }
          if(swiper.translate > 0) { //下拉 为正值
            //判断用户是否需要下拉
            if(!this.pullDown) {
              return;
            }
            //PULL_DOWN_HEIGHT 自定义配置数据100
            if(swiper.translate > PULL_DOWN_HEIGHT) {
              // this.pullDownText = '111'  直接传值，改变data的值重新渲染就会造成闪动bug
              //解决方法，调用这个组件，利用它的api。比如swiper插件的scrollapi的update方法
              this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_START);
              // console.log(this.$refs.pullDownLoading);
            }else {
              this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_INIT);
              // console.log(this.$refs.pullDownLoading);
            }
          } else if(swiper.isEnd) { //上拉，首先判断是不是到了底部
            //判断是否开启了上拉
              if (!this.pullUp) {
                return;
              }
            //判断用户的上拉的距离是否达到触发条件
            const isPullUp = Math.abs(swiper.translate) + swiper.height - PULL_UP_HEIGHT > parseInt(swiper.$wrapperEl.css('height'));
            //进行判断得出对应提示文字
            if (isPullUp) {
              this.$refs.pullUpLoading.setText(PULL_UP_TEXT_START);
            } else {
              this.$refs.pullUpLoading.setText(PULL_UP_TEXT_INIT);
            }
          }
        },

        //事件处理函数，解决scroll事件的缺陷。用于后面返回顶部按钮当满足一定条件后显示出来
        scrollEnd() {
          this.$emit('scroll-end', this.$refs.swiper.swiper.translate, this.$refs.swiper.swiper, this.pulling);
        },
        touchEnd() {
          //如果正在拉动，就直接返回，不用再继续加载了
          if(this.pulling) {
            return;
          }
          const swiper = this.$refs.swiper.swiper;
          if(swiper.translate > PULL_DOWN_HEIGHT) {
            if (!this.pullDown) {
              return;
            }
            //如果没有在拉动，那就重置为真
            this.pulling = true;
            //开始下拉
            swiper.allowTouchMove = false;// 禁止触摸
            swiper.setTransition(swiper.params.speed);
            swiper.setTranslate(PULL_DOWN_HEIGHT);
            swiper.params.virtualTranslate = true;// 定住不给回弹
            this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_ING);
            //作为基础组件而不是业务组件，刷新功能不应设置在这里
            this.$emit('pull-down', this.pullDownEnd);

          }else if (swiper.isEnd) { //判断是否到底部了
            const totalHeight = parseInt(swiper.$wrapperEl.css('height'));
            const isPullUp = Math.abs(swiper.translate) + swiper.height - PULL_UP_HEIGHT > totalHeight;

            if (isPullUp) { // 上拉
              if (!this.pullUp) {
                return;
              }
              this.pulling = true;
              swiper.allowTouchMove = false; // 禁止触摸
              swiper.setTransition(swiper.params.speed);  // 回弹的速度
              swiper.setTranslate(-(totalHeight + PULL_UP_HEIGHT - swiper.height));// 拉的超过了就回弹到合适的距离
              swiper.params.virtualTranslate = true; // 定住不给回弹
              this.$refs.pullUpLoading.setText(PULL_UP_TEXT_ING);
              //上拉后触发业务组件的事件做相应的事情，并传值，还原参数，下边定义了对应还原方法
              this.$emit('pull-up', this.pullUpEnd);
            }
          }

        },
        pullDownEnd() {
          const swiper = this.$refs.swiper.swiper;
          //加载完成后，那就重置为假，可以进行下一次拉动
          this.pulling = false;

          this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_END);
          swiper.params.virtualTranslate = false;
          swiper.allowTouchMove = true; //是否允许触摸
          swiper.setTransition(swiper.params.speed); //回弹的速度
          swiper.setTranslate(0);  //回弹到初始值为0

          //head动画消失和隐藏有关
          setTimeout(() => {
            this.$emit('pull-down-transition-end');
          }, swiper.params.speed);

        },

        pullUpEnd() {
          const swiper = this.$refs.swiper.swiper;
          this.pulling = false;
          this.$refs.pullUpLoading.setText(PULL_UP_TEXT_END);
          swiper.params.virtualTranslate = false;
          swiper.allowTouchMove = true;
          //这里什么都没有做，让内容自动撑开，而不是滚动回弹到0距离
        }
      }
    };
</script>

<style lang="scss" scoped>
  .swiper-container {
    overflow: hidden;
    width: 100%;
    height: 100%; //swiper-container 的div变成617px
  }
  .swiper-slide {
    height: auto; //设置auto。而不是跟随父容器swiper-wrapper的高度
    //swiper-wrapper 则被style设置高度为617.data里设置了true，随着更改。
  }
  .mine-scroll-pull-up,
  .mine-scroll-pull-down {
    position: absolute;
    left: 0;
    width: 100%;
  }
  .mine-scroll-pull-down {
    bottom: 100%;
    height: 80px;
  }

  .mine-scroll-pull-up {
    top: 100%; //往上挤下来，变隐藏看不见
    height: 30px;
  }
  .mine-scroll-pull-down {

    bottom: 100%; // 默认被隐藏看不到
    height: 80px;
  }

</style>
