<template>
    <div class="order">
      <div class="meOrder">
        <i class="iconfont icon-service"></i>
        <span>我的订单</span>
        <span>查看我的全部订单</span>
        <i class="iconfont icon-back"></i>
      </div>
      <div class="moreOrder">
        <router-link class="g-tabbar-item" to="/home">
          <i class="iconfont icon-home"></i>
          <span>待付款</span>
        </router-link>
        <router-link class="g-tabbar-item" to="/category">
          <i class="iconfont icon-category"></i>
          <span>待收货</span>
        </router-link>
        <router-link class="g-tabbar-item" to="/cart">
          <i class="iconfont icon-cart"></i>
          <span>待评价</span>
        </router-link>
        <router-link class="g-tabbar-item" to="/personal">
          <i class="iconfont icon-personal"></i>
          <span>退货/退款</span>
        </router-link>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'personalOrder'
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .order {
    height: 120px;
    background-color: #ffffff;
    margin-top: 10px;

    & .meOrder {
      height: 40px;
      display: flex;
      border-bottom: 1px solid rgba(237,237,237,.9);
      & i:nth-child(1) {
        font-size: $icon-font-size ;
        padding-left: 10px;
        padding-top: 6px;
      }
      & i:nth-child(4) {
        font-size: $font-size-l + 1;
        padding-left: 10px;
        padding-top: 12px;
        transform: rotate(180deg);
      }
      & span {
        display: inline-block;
        height: 40px;
        width: 200px;
      }
      & span:nth-child(2) {
        font-size: 18px;
        color: #000;
        padding-left: 20px;
        padding-top: 11px;

      }
      & span:nth-child(3) {
        font-size: 15px;
        color: gray;
        padding-left: 40px;
        padding-top: 12px;
      }
    }

    & .moreOrder {
      display: flex;
      height: 80px;
      font-size: $font-size-l + 1;
    }
  }

</style>
