<template>
  <me-navbar class="header">
    <i
      class="iconfont icon-back"
      slot="left"
      @click="goBack"
    ></i>
    <me-search-box
      placeholder="开学季有礼，好货5折起"
      slot="center"
      @query="query"
    />
  </me-navbar>
</template>

<script>
  import MeNavbar from 'base/navbar';
  import MeSearchBox from 'base/search-box';

  export default {
    name: 'SearchHeader',
    components: {
      MeNavbar,
      MeSearchBox
    },
    methods: {
      //本组件用不上search-box里的Input输入内容，其触发本组件后，这里再传到result组件里
      query(query) {
        this.$emit('query', query);
      },
      //点击返回上一页，通过路由
      goBack() {
        this.$router.back();
      }
    }

  };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .header {
    border-bottom: 1px solid $border-color;

    .iconfont{
      color: $icon-color;
      font-size: $icon-font-size;
    }

    /*搜索框背景，样式在基础组件search-box里*/
    .mine-search-box-wrapper {
      background-color: #f7f7f7;
    }
  }
</style>
