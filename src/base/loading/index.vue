<template>
  <div class="mine-loading" :class="{'mine-loading-inline':inline}">
    <span class="mine-loading-indicator" v-if="indicator === 'on'">
      <slot><img src="./loading.gif" alt="loading"></slot>
    </span>
    <span class="mine-loading-text" v-if="loadingText">{{ loadingText }}</span>
  </div>
</template>

<script>
    export default {
        name: 'MeLoading',
        props: {
          indicator:{
            type:String,
            default:'on',
            validator(value) {
              return ['on','off'].indexOf(value) > -1;
            }
          },
          text: {
            type:String,
            default:'加载中...',
          },
          inline: {
            type:Boolean,
            default:false
          }
        },
        data() {
          return {
            loadingText:this.text
          };
        },
      //为了传进来的text改变的时候，也能够改变loadingText，用watch监听一下，再来里面实现修改值
        watch: {
          text(text) {
            this.loadingText = text;
          }
        },
        methods: {
          setText(text) {
            // this.text = text; 报错，因为子组件不能直接修改父组件的值。解决办法是自己加一个数据loadingText
            this.loadingText = text;
          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .mine-loading {
    overflow: hidden;
    width: 100%;
    height: 100%;
    @include flex-center(column);

    &.mine-loading-inline {
      flex-direction: row;
    }
  }

  .mine-loading-indicator ~ .mine-loading-text {
    margin-top: 0;
    margin-left: 6px;

  }
</style>
