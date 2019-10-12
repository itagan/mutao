<template>
  <div class="assets">
    <div class="meAssets">
      <i class="iconfont icon-scan"></i>
      <span>我的资产</span>
    </div>

    <ul class="moreAssets">
      <div v-for="item in arrList">
        <router-link :to="item.link">
          <li>
            <span>
              {{item.name}}
            </span>
          </li>
        </router-link>
      </div>
    </ul>
  </div>
</template>

<script>
    export default {
        name: 'personalAssets',
        data() {
          return {
            arrList:[]
          }
        },
        mounted() {
          this.arrList = [
            {
              name:'现金券',
              link:'/personal'
            },
            {
              name:'红包',
              link:'/personal'
            },
            {
              name:'余额',
              link:'/personal'
            },
            {
              name:'礼品卡',
              link:'/personal'
            },
          ]
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .assets {
    height: 85px;
    background-color: #ffffff;
    margin-top: 10px;

    & .meAssets {
      height: 40px;
      display: flex;
      border-bottom: 1px solid rgba(237,237,237,.9);

      i:nth-child(1) {
        font-size: $icon-font-size ;
        padding-left: 10px;
        padding-top: 6px;
      }
      & span:nth-child(2) {
        font-size: 18px;
        color: #000;
        padding-left: 20px;
        padding-top: 11px;
      }
    }
    & .moreAssets {
      display: flex;
      height: 45px;
      font-size: $font-size-l + 2;
      width: 100%;
      div {
        display: inline-block;
        width: 100%;
      }
      li {
        width: 93.75px;
        line-height: 45px;
        text-align: center;
      }
    }
  }


</style>
