<template>
    <div class="mine-search-box-wrapper">
      <i class="iconfont icon-search"></i>
      <div class="mine-search-box" v-if="fake">{{placeholder}}</div>
      <!--      下边placeholder是变量所以前面用加冒号-->
      <input
        type="text"
        class="mine-search-box"
        title="搜索框"
        :placeholder="placeholder"
        ref="input"
        v-model="query"
        v-if="!fake"
      >
<!--      当Input有值的时候，v-show变真 清除按钮显示出来，通过点击清除内容-->
      <i
        class="iconfont icon-close"
        v-show="query"
        @click="reset"
      ></i>
    </div>
</template>

<script>
  import {debounce} from 'assets/js/util';

    export default {
        name: 'MeSearchBox',
        props: {
          placeholder: {
            type:String,
            default:'请输入搜索内容'
          },
          fake: {
            type: Boolean,
            default: false
          }
        },
        data() {
          //输入框input的value发生变化，v-model中query相应发生变化；反之也是；
          return {
            query:''
          };
        },
      //监控query的变化，并通过$emit派发事件的方式往外告知变化,把当前query发送出去
        watch: {
          query: debounce(function() {
            this.$emit('query', this.query);
          })
        },
        methods: {
          focus() {
            // 绑定input元素的DOM事件 focus事件；ref绑定变成真正dom原生写法
            this.$refs.input && this.$refs.input.focus();
          },
          clear() {
            this.query = ''; //v-model双向绑定，重置为空，input输入内容也就空了
          },
          //把焦点定位到Input上方便输入，先清空原来内容再定焦点
          reset() {
            this.clear();
            this.focus();
          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  $search-box-height: 30px;

  .mine-search-box-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: $search-box-height;
    padding: 0 7px;
    background-color: #fff;
    border-radius: $search-box-height / 2;
  }

  .iconfont {
    color: $icon-color;
    font-size: $icon-font-size-sm;
    font-weight: bold;
  }

  .mine-search-box {
    flex: 1;
    background: none;
    border: none;
    margin: 0 6px;
    color: #666;
    line-height: 1.5;
  }
</style>
