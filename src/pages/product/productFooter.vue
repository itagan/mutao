<template>
  <div class="footer">
    <div class="footer-left">
      <div>
        <i class="iconfont icon-shop"></i>
        <span>店铺</span>
      </div>
      <div>
        <i class="iconfont icon-service"></i>
        <span>客服</span>
      </div>
      <div>
        <i class="iconfont icon-collect"></i>
        <span>收藏</span>
      </div>

    </div>
    <div class="footer-center" @click="addCart">加入购物车</div>
    <div class="footer-right">马上抢</div>
  </div>
</template>

<script>
    export default {
        name: 'productFooter',
        methods:{
          addCart() {
            this.$emit('sellect-item');
          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: $tabbar-z-index;
    width: 100%;
    box-shadow:0 0 10px 0 hsla(0,6%,58%,0.6);
    display: flex;
    height: $tabbar-height;
    background: #fff;

    &-left {
      font-size:$font-size-l;
      width: 40%;
      @include flex-center();
      & div {
        flex: 1;
        @include flex-center(column);
        & .iconfont {
          margin-bottom: 4px;
          font-size: $icon-font-size;
        }
      }

    }

    &-center {
      width: 30%;
      background: rgb(247,144,0);
      font-size: 16px;
      color: rgb(252,236,110);
      line-height: 50px;
      text-align: center;
      font-weight: bold;
    }
    &-right {
      width: 30%;
      background: rgb(241,2,49);
      font-size: 16px;
      color: #ffffff;
      line-height: 50px;
      text-align: center;
      font-weight: bold;

    }
  }
</style>
