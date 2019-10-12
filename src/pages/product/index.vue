<template>
  <transition name="mine-product">
  <div class="product">
    <header class="g-header-container">
      <product-header/>
    </header>

    <div class="g-content-container">
    <me-scroll ref="scroll" >
    <product-slider @loaded="updateScroll"/>

      <div class="loading-container" v-if="!Object.keys(productKeys).length">
        <me-loading inline/>
      </div>

      <div v-else >
<!--价格销量-->
      <div class="priceSellcount">
        <div class="price">
          <span class="priceSymbol">￥</span>
          <strong class="priceNum">{{price}}</strong>
        </div>
        <div class="sell">
          <p class="sellCount">{{sellCount}}件已售</p>
        </div>
      </div>
<!--标题邮费信息-->
      <div class="title">
        <div class="title-title">{{title}}</div>
        <div class="title-msg">
          <p>{{postage}}</p>
          <p>月销量{{vagueSellCount}}</p>
          <p>{{from}}</p>
        </div>
      </div>
<!-- 评价有关-->
      <div class="evaluate">
        <div class="totalCount">
          商品评价( {{totalCount}} )

          <span class="more">查看全部 ></span>
        </div>

        <div class="eva">
          <ul class="eva-list">
            <li class="eva-item" v-for="(item, index) in keywords" :key="index">
              <span>{{item.word}}</span>
              <span>({{item.count}})</span>
            </li>
          </ul>
        </div>

        <div>
          <div class="msg">
            <img :src="headPic" class="msg-pic">
            <span class="msg-name">{{userName}}</span>
          </div>

          <div class="content">
            {{content}}
          </div>

          <div class="type">
            {{dateTime}}
            {{skuInfo}}
          </div>
        </div>
      </div>
<!--      问答-->
      <div class="ask">
        <img src="https://gw.alicdn.com/tps/TB1J7X6KXXXXXc4XXXXXXXXXXXX-102-60.png" class="ask-img">
        <span class="ask-msg">宝贝好不好，问问已买过的人</span>
        <div class="ask-text">
          <span class="ask-textAsk">问</span>
          <span>{{askText}}</span>
          <span class="ask-textQue"></span>
        </div>
      </div>
<!--卖家信息-->
        <div class="seller">
          <div class="seller-img">
            <img :src="shopIcon" class="seller-pic" alt="">
          </div>

          <div class="seller-msg">
            <div class="seller-name">{{shopName}}</div>
            <div class="seller-productType"><img :src="shopType" alt="" class="seller-type"></div>
          </div>

          <div class="seller-evaluates">
            <ul class="seller-list">
              <li class="seller-item" v-for="(item, index) in evaluates" :key="index">
                <span>{{item.title}}</span>
                <span>{{item.score}}</span>
                <span>{{item.levelText}}</span>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </me-scroll>
    </div>


    <product-footer @sellect-item="sellectItem"/>

    <sku-base
      ref="skubase"
      :skuData = "skuBases"
      @remind = "remindTrue"
      @remindCart = "remindCart"
      @isSoldCount = 'isSoldCount'
    ></sku-base>

    <me-remind
      ref="remind"
      :remind="remindTypeItems"
      :icons= "icons"
    ></me-remind>
  </div>
  </transition>

</template>

<script>
    import MeScroll from 'base/scroll';
    import MeLoading from 'base/loading';
    import MeRemind from 'base/remind';
    import ProductHeader from './header';
    import ProductSlider from './slider';
    import productFooter from './productFooter';
    import skuBase from './skubase';
    import {getProduct} from 'api/product';

    export default {
        name: 'home-product',
        components:{
          MeScroll,
          MeLoading,
          MeRemind,
          ProductHeader,
          ProductSlider,
          productFooter,
          skuBase,
        },
        data(){
          return {
            productKeys:{}, //对象
            price:'',
            sellCount:'',
            title:'',
            postage:'',
            from:'',
            vagueSellCount:'',
            totalCount:'',
            keywords:[],
            userName:'',
            headPic:'',
            content:'',
            skuInfo:'',
            dateTime:'',
            askText:'',
            shopIcon:'',
            shopName:'',
            shopType:'',
            evaluates:[],
            skuBases:[],
            remindTypeItems:'',
            icons:'iconfontNew iconNew-jinggao',
            // remindCart:'添加成功，在购物车等亲~'
          }
        },
        created() {
          this.getProductdetail();
          // this.updateScroll();
        },
        methods:{
          getProductdetail(){
            return getProduct(this.$route.params.id).then(data => {
              this.productKeys =data.content;
              // console.log(this.productKeys);
              // console.log(Object.keys(this.productKeys));//把对象键值放进数组从而具备长度方便判断是否有内容

              this.price = data.content.priceText;
              this.sellCount = data.content.sellCount;
              this.soldCount  = data.content.soldCount;

              this.title = data.content.title;
              this.postage = data.content.postage;
              this.from = data.content.from;
              this.vagueSellCount = data.content.vagueSellCount;

              this.keywords = data.content.review.keywords;
              this.totalCount = data.content.review.totalCount;
              this.userName = data.content.review.rateList[0].userName;
              this.headPic = data.content.review.rateList[0].headPic;
              this.content =  data.content.review.rateList[0].content;
              this.skuInfo = data.content.review.rateList[0].skuInfo;
              this.dateTime = data.content.review.rateList[0].dateTime;
              this.askText = data.content.resource.askAll.text;

              this.shopIcon = data.content.seller.shopIcon;
              this.shopName = data.content.seller.shopName;
              this.shopType = data.content.seller.creditLevelIcon;
              this.evaluates = data.content.seller.evaluates;

              this.skuBase = data.content.skuBase.props;
              this.sliders = data.content.sliders;

              this.skuBases = [this.skuBase,this.price,this.soldCount, this.sliders,this.shopName,this.title];


            });
          },
          // 更新滚动条
          updateScroll() {
            this.$refs.scroll && this.$refs.scroll.update();
          },

          //点击加入购物车实现选择商品
          sellectItem() {
            this.$refs.skubase.show();
         },
          //选择商品点击确定
          remindTrue(typeItems) {
            this.$refs.remind.show();
            // this.remindTypeItems = typeItems;
            this.remindTypeItems = `请选择${typeItems}`;
            console.log(this.remindTypeItems);
          },
          //成功加入购物车
          remindCart() {
            this.$refs.remind.show();
            this.remindTypeItems='添加成功，在购物车等你~亲';
          },
          isSoldCount() {
            this.$refs.remind.show();
            this.remindTypeItems='数量超出范围了哦';
          }
        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .product {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: $bgc-theme;
    position:absolute;
    top: 0;
    left: 0;
    z-index: $product-z-index;

  }

  .g-content-container {

    padding-top: $navbar-height;

  }

  .loading-container {
    margin-top: 200px;
  }


  .priceSellcount {
    height:40px;
    background: -webkit-linear-gradient(left, deeppink, red); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, deeppink, red); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, deeppink, red); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, deeppink, red); /* 标准的语法（必须放在最后） */
    @include flex-between();
    color: #ffffff;
    font-weight: bold;

    .price {
      padding-left: 5px;
      font-size: $font-size-l;
    }

    .sell {
      height: 23px;
      width: 80px;
      margin-right: 5px;
      background: rgba(190,23,55,.5);
      @include flex-center();
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }

  .title {
    background-color: #fff;
    height: 65px;

    &-title {
      padding-top: 5px;
      padding-left: 5px;
      height: 40px;
      color: #000;
      /*display:flex;*/
      /*align-items:center;*/
      line-height: 20px;
    }

    &-msg {
      height: 25px;
      @include flex-between();

    }
  }


  .evaluate {
    width: 100%;
    margin-top: 15px;
    background-color: #fff;

    .totalCount {
      font-size: 16px;
      padding-left: 10px;
      height:30px;
      line-height: 30px;
      width: 100%;

      .more {
        font-size:14px;
        float: right;
        padding-right:10px;
        color:red;

      }
    }
    .eva {
      width: 100%;

      &-list {
        display: flex;
        flex-wrap: wrap;
      }

      &-item {
        margin-bottom: 15px;
        margin-left: 10px;
        padding:0px 8px;
        height:25px;
        line-height: 25px;
        background:rgba(258,238,240,.8);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }

    }

    .msg {
      &-pic {
        width: 25px;
        height:25px;
        border-radius: 50%;
      }

      &-name {
        height: 25px;
        line-height: 25px;
      }
    }

    .content {
      padding: 5px 5px;
      line-height: 1.5;
    }
    .type {
      color: rgba(135,135,135,0.8);
      padding: 5px 5px;
    }
  }


  .ask {
    width: 100%;
    margin-top: 15px;
    background-color: #fff;

    &-img {
      width: 40px;
      height: 25px;
    }

    &-msg {
      height: 25px;
      line-height: 25px;
      font-size:14px;
    }
    &-text {
      @include ellipsis();
      height: 25px;
      line-height: 15px;
      margin-top: 5px;

      .ask-textAsk {
        float: left;
        margin: 0 5px;
        font-size: 12px;
        width: 15px;
        text-align: center;
        background:orange;
        color: #ffffff;
      }
      .ask-textQue {
        float: right;
        padding-right: 5px;
      }
    }
  }

  .seller {
    width: 100%;
    background-color: #fff;
    margin-top: 10px;
    padding-top: 10px;
    &-img {
      height: 50px;
      width: 50px;
      border: 1px solid rgba(135,135,139,1);
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      @include flex-center();
      float: left;
      margin-left: 10px;
    }
    &-pic {
      height: 40px;
      width: 40px;
    }
    &-msg {
      height: 60px;
      margin-left: 70px;
    }
    &-name {
      height: 25px;
      line-height: 25px;
      font-size: 16px;

    }
    &-productType {
      height: 25px;
      line-height: 25px;

    }
    &-type {
      width: 45px;
      height: 20px;
    }

    &-evaluates {
      width: 100%;
      height: 40px;
      /*margin-bottom: 100px;*/
    }
    &-list {
      @include flex-between();
      text-align: center;
    }
    &-item {
      //@include flex-center();
      flex: 1;
      height: 40px;
      line-height: 40px;
    }
  }

  /*点击加入购物车*/
  .skubase {
    position: fixed;
    bottom: 0px;
  }

  /*动画*/
  .mine-product-enter-active,
  .mine-product-leave-active {
    transition: all 0.5s;
  }
  /*进入离开的动画效果   需要查看vue的动画api*/
  .mine-product-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .mine-product-enter {
    transform: translate3d(100%, 0, 0);
  }





</style>
