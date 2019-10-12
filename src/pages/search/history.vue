<template>

  <div class="history" v-if="historys.length">
    <h4 class="history-title">历史搜索</h4>
    <transition-group class="g-list" name="list" tag="ul">
      <li
        class="g-list-item"
        v-for="item in historys"
        :key="item"
        @click=" $_selectItem(item)"
      >
        <span class="g-list-text">{{ item }}</span>
        <i
          class="iconfont icon-delete"
          @click.stop="removeItem(item)">
        </i>
      </li>
    </transition-group>

    <a
      href="javascript:;"
      class="history-btn"
      @click="showConfirm"
    >
      <i class="iconfont icon-clear"></i>
      清空历史搜索
    </a>
  </div>

</template>

<script>
  import {SEARCH_HISTORY_KEYWORD_KEY} from './config';
  import {searchMixin} from 'assets/js/mixins';
  import storage from '../../assets/js/storage';

  export default {
    name: 'SearchHistory',
    data() {
      return {
        //保存历史记录，默认为空
        historys:[]

      }
    },
    //引入代码段，实现历史搜索被点击跳转，和重新排序效果，被点击的被过滤掉然后又被unshift添加到新数组开头变成排前头
    mixins:[searchMixin],
    created() {
      this.getKeyword();
    },

    methods: {
      update() {
        this.getKeyword();
      },
      getKeyword() {
        //从缓存中获取数据作为搜索历史中的数组
        this.historys = storage.get(SEARCH_HISTORY_KEYWORD_KEY, []);

      },
      removeItem(item) {
        //不等的话保留，相等的剔除，这样就把历史搜索中的项删除了，因为历史搜索项也是缓存中获取，那么就是相同对应的；
        //Item是某一项，肯定缓存中也有。这样通过过滤方法把这个过滤出去，其它在缓存中是不相等的依然保留，除非点击到这个项；
        this.historys = this.historys.filter(val => val !== item);
        //再把新数组作为缓存保存
        storage.set(SEARCH_HISTORY_KEYWORD_KEY, this.historys);
        //提醒更新滚动条
        setTimeout(()=> {
          this.$emit('remove-item', item);
        },100)

      },
      showConfirm() {
        //点击清除历史记录按钮，往外派发事件
        this.$emit('show-confirm');
      },
      clear() {
        storage.remove(SEARCH_HISTORY_KEYWORD_KEY);
      }

    }
  };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .history {
    padding-bottom: 30px;
    background-color: #fff;

    &-title {
      height: 34px;
      line-height: 34px;
      padding: 0 10px;
      font-size: $font-size-l;
      font-weight: bold;
    }

    &-btn {
      @include flex-center();
      width: 80%;
      height: 40px;
      background: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 0 auto;
      color: #686868;

      .iconfont {
        margin-right: 5px;
      }
    }
  }

  .g-list {
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    margin-bottom: 20px;
  }

  /*删除动画效果，高度在100ms变成0*/
  .list {
    &-enter-active,
    &-leave-active {
      transition: height 0.1s;
    }

    &-enter,
    &-leave-to {
      height: 0;
    }
  }

</style>
