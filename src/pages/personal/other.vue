<template>
    <div class="other">
      <ul class="moreOther">
        <div v-for="item in arrList">
          <router-link :to="item.link">
            <li>
              <i :class="item.iconLeft"></i>
            <span>
              {{item.name}}
            </span>
              <i :class="item.iconRight"></i>
            </li>
          </router-link>
        </div>
      </ul>
    </div>
</template>

<script>
    export default {
        name: 'other',
        data() {
          return {
            arrList:[]
          }
        },
        mounted() {
          this.arrList = [
            {
              iconLeft: 'iconfont icon-msg',
              name:'售后服务',
              iconRight: 'iconfont icon-back ',
              link:'/personal'
            },
            {
              iconLeft:'iconfont icon-msg',
              name:'意见反馈',
              iconRight:'iconfont icon-back ',
              link:'/personal'
            },
            {
              iconLeft:'iconfont icon-msg',
              name:'收货地址',
              iconRight:'iconfont icon-back ',
              link:'/personal'
            },
            {
              iconLeft:'iconfont icon-msg',
              name:'退出登录',
              iconRight:'iconfont icon-back ',
              link:'/personal'
            },
            {
              iconLeft:'iconfont icon-msg',
              name:'400-123-8888',
              iconRight:'iconfont icon-back ',
              link:'/personal'
            }
          ]
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .other {
    height: 190px;
    background-color: #ffffff;
    margin-top: 10px;

    & .moreOther {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      div {
        display: inline-block;

        li {
          height: 38px;
          border-bottom:1px solid rgba(237,237,237,.9);
          font-size: $font-size-l + 4;
          padding-top: 6px;
          color: #000;

          i:nth-child(1) {
            padding-left: 10px;
            font-size: $icon-font-size ;
          }
          span:nth-child(2) {
            color: #000;
            padding-left: 20px;
          }
          i:nth-child(3) {
            float: right;
            font-size: $font-size-l + 2;
            padding-left: 10px;
            margin-top: 6px;
            transform: rotate(180deg);
            color: rgb(173,173,173);
            font-weight: bold;
          }
        }
      }
    }
  }

</style>
