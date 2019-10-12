<template>
  <!--下面渲染结构的参数需要查看api-->
    <div class="recommend">
      <h3 class="recommend-title">热卖推荐</h3>
      <div class="loading-container" v-if="!recommends.length">
        <me-loading inline/>
      </div>
      <ul class="recommend-list" v-else>
        <li class="recommend-item" v-for="(item, index) in recommends" :key="index">
          <router-link class="recommend-link"
          :to = "{ name:'home-product', params:{id: item.baseinfo.itemId} }"
          >
            <!-- :src 换成v-lazy就实现懒加载-->
            <p class="recommend-pic"><img class="recommend-img" v-lazy="item.baseinfo.picUrlNew"></p>
            <p class="recommend-name">{{item.name.shortName}}</p>
            <p class="recommend-origPrice"><del>¥{{item.price.origPrice}}</del></p>
            <p class="recommend-info">
              <span class="recommend-price">¥<strong class="recommend-price-num">{{item.price.actPrice}}</strong></span>
              <span class="recommend-count">{{item.remind.soldCount}}件已售</span>
            </p>

          </router-link>
        </li>
      </ul>
    </div>
</template>

<script>
    import {getHomeRecommend} from 'api/home';
    import MeLoading from 'base/loading';

    export default {
        name: 'HomeRecommend',
        components:{
          MeLoading
        },
        data() {
          return {
            recommends:[],
            curPage:1,
            totalPage:1,
          }
        },
        created() {
        this.getRecommend();
      },
        methods: {
          //api，外部调用
          update() {
              return this.getRecommend();
          },
          //内部使用
          getRecommend() {
            if (this.curPage > this.totalPage) {
              //确保没有数据的时候返回的也是promise对象，这里返回reject情况
              return Promise.reject(new Error('没有更多了'));
            }
            //下边是promise对象，所以直接返回，从而能够接着then
           return getHomeRecommend(this.curPage).then(data => {
              return new Promise(resolve => {
                if(data) {
                  // console.log(data);
                  //要访问上面data中的数据的时候，可以使用this
                  this.curPage++;//功能是加载更多。+1.比当前页数字大1，就能够加载下页，还能够判断是否还有新页
                  this.totalPage = data.totalPage;
                  //当前热卖推荐+新加载的热卖推荐，组成新的热卖推荐。concat表示连接数组。
                  this.recommends = this.recommends.concat(data.itemList);
                  console.log(data.itemList);
                  // console.log(this.recommends);
                  //发消息告诉其它组件，我已经更新完热卖推荐。父组件获取信息。
                  //触发父组件的loaded事件，并向其传输数据，参数this.recommends；
                  this.$emit('loaded', this.recommends);

                  //只有当data有值，没报错的情况下，才能执行resolve，home里的then(end)才会被执行到
                  resolve();
                }
              })
            })
          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .recommend {
    &-title {
      position: relative;
      width: 100%;
      padding: 10px 0;
      font-size: $icon-font-size-sm;
      text-align: center;

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background-color: #ddd;
      }
      &:before {
        left: 0;
      }
      &:after {
        right: 0;
      }
    }

    &-list {
      @include flex-between();
      flex-wrap: wrap;
    }
    &-item {
      width: 49%;
      background-color: #fff;
      box-shadow:0 1px 1px 0 rgba(0, 0, 0, 0.12);
      margin-bottom: 8px;
    }
    &-link {
      display: block;
    }
    &-pic {
      position: relative;
      width: 100%;
      padding-top: 100%; //padding和margin 百分比是相对盒子本身宽高而言
    }
    &-img {
      //图片被padding撑下来用定位确定位置，还可用浮动
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    &-name {
      height: 36px;
      padding: 0 5px;
      margin-bottom: 8px;
      line-height: 1.5;
      @include multiline-ellipsis();
    }

    &-origPrice {
      padding: 0 5px;
      margin-bottom: 8px;
      color: #ccc;
    }

    &-info {
      @include flex-between();
      padding: 0 5px;
      margin-bottom: 8px;
    }

    &-price {
      color: #e61414;
    }

    &-price-num {
      font-size: 20px;
    }

    &-count {
      color: #999;
    }
  }

  .loading-container {
    margin-top: 100px;
  }
</style>
