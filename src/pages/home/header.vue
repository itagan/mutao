<template>
    <me-navbar class="header" v-show="visible">
      <i class="iconfont icon-scan" slot="left"></i>
<!--      下边是字符串所以前面不用加冒号-->
      <me-search-box
        placeholder="开学季有礼，好货五折起"
        slot="center"
        fake
        @query="getQuery"
        @click.native="goToSearch"
      />
      <i class="iconfont icon-msg" slot="right"></i>
    </me-navbar>
</template>
<script>
  import MeNavbar from 'base/navbar';
  import MeSearchBox from 'base/search-box';
    export default {
        name: 'HomeHeader',
        components: {
          MeNavbar,
          MeSearchBox
        },
        data() {
          return {
            //自己控制自己的显示和隐藏，所以不需要外面传变量
            visible:true
          }
        },
        methods: {
          show() {
            this.visible = true;
          },
          hide() {
            this.visible = false;
          },
          //接收子组件search-box传输过来的query
          getQuery(query) {
            console.log(query);
          },
          goToSearch() {
            this.$router.push('/search');
          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .header {
    &.mine-navbar {
      background-color: transparent;
      /*给背景颜色开启渐变效果*/
      transition:background-color 0.5s;
      /*background-color: $header-bgc-translucent;*/
    }
    /*提高优先级写法*/
    &.header-transition {
      background-color: $header-bgc-translucent;
    }

    .iconfont {
      color: $icon-color-default;
      font-size: $icon-font-size;
    }
  }
</style>
