<template>
    <me-navbar class="header">
      <i class="iconfont icon-setting" slot="left"></i>
      <h3 class="title" slot="center">我的慕淘</h3>
      <i class="iconfont icon-msg" slot="right"></i>
    </me-navbar>
</template>

<script>
    import MeNavbar from 'base/navbar';
    export default {
        name: 'personalHeader',
        components:{
          MeNavbar
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .header {
    &.mine-navbar {
      background-color: $header-bgc-translucent;
    }
    .title {
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      font-weight: bold;

    }
    .iconfont {
      color: $icon-color-default;
      font-size: $icon-font-size;
    }
  }
</style>
