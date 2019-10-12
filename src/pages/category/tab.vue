<template>
   <me-scroll :scrollbar="false">
<!--     上面传的不是字符串一定加冒号-->
     <ul class="tab">
       <li
       class="tab-item"
       :class="{'tab-item-active':item.id === curId}"
       v-for="(item, index) in items"
       :key="index"
       @click="switchTab(item.id)"

       >{{item.name}}</li>
     </ul>
   </me-scroll>
</template>

<script>
    import MeScroll from 'base/scroll';
    import {categoryNames} from './config';

    export default {
        name: 'CategoryTab',
        components: {
          MeScroll
        },
        data() {
          return {
            curId:''
          }
        },
        created() {
          this.init();
          //刚打开页面的时候第一个作为当前页面，所以需要调用方法，实现激活样式和传id参数给父组件。
          this.switchTab(this.items[0].id);
        },
        methods: {
          //不需要时刻变化和交互的数据不用放data
          init() {
            this.items = categoryNames;
          },
          switchTab(id) {
            if(this.curId === id) {
              //如果当前的id等于传进来的id，说明是在显示的页面上，点击无效直接返回
              return;
            }
            this.curId = id;
            //触发父组件的事件，并传参数
            this.$emit('switch-tab', id);
          }

        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  $tab-item-height: 46px;

  .tab {
    width: 100%;

    &-item {
      height: $tab-item-height;
      background-color: #fff;
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      color: #080808;
      font-size: $font-size-l;
      font-weight: bold;
      text-align: center;
      line-height: $tab-item-height;
      @include ellipsis();

      &:last-child {
        border-bottom: none;
      }
    }

    &-item-active {
      background: none;
      border-right: none;
      color: #f23030;
    }
  }
</style>
