<template>
  <div class="category">
    <header class="g-header-container">
      <category-header/>
    </header>
    <div class="g-content-container">
      <div class="sidebar">
        <category-tab @switch-tab="getCurrentId"/>
      </div>
      <div class="main">
        <category-content :curId="curId"/>
      </div>
    </div>
  </div>
</template>

<script>
    import CategoryHeader from './header';
    import CategoryTab from './tab';
    import CategoryContent from './content'
    export default {
        name: 'category',
        components: {
          CategoryHeader,
          CategoryTab,
          CategoryContent
        },
        data() {
          return {
            curId:''
          };
        },
        methods: {
          //事件定义的方法用于获取当前id参数
          getCurrentId(id) {
            this.curId = id;
          }
        }

    };
</script>

<style lang="scss" scoped>
    @import "~assets/scss/mixins";

    .category {
      overflow: hidden;
      width: 100%;
      height: 100%;
      background-color: $bgc-theme;
    }

    /*.g-content-container {*/
    /*  display: flex;*/
    /*}*/

    /*解决左侧内容上移，不能滚动问题*/
    .g-content-container {
      display: flex;
      padding-top: $navbar-height;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .sidebar {
      width: 80px;
      height: 100%;
    }
    .main {
      flex: 1;
      height: 100%;
    }
</style>
