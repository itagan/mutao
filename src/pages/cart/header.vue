<template>
  <me-navbar class="header">
    <span class="title" slot="center">
      购物车
    </span>
    <i class="iconfont icon-msg" slot="right"></i>
  </me-navbar>
</template>

<script>
  import MeNavbar from 'base/navbar';
  export default {
    name: 'cartHeader',
    components:{
      MeNavbar
    }
  };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .header {
    &.mine-navbar {
      background-color: #ffffff;
      border-bottom:1px solid rgba(213,213,214,.8);
    }
    .title {
      /*text-align: center;*/
      margin-left: 50%;
      font-size: 16px;
      color: #000000;
    }
    .iconfont {
      color: rgba(213,213,214,.9);
      font-size: $icon-font-size;
    }
  }
</style>
