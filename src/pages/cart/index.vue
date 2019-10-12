<template>
   <div class="cart">
        <cart-header/>

     <me-scroll>
<!--      当清空购物车后页面显示 -->
       <div class="cart-empty" v-if="isEmpty">
         <p>
           亲，<br/>
           购物车是空的~<br/>
           请在商品页添加宝贝，<br/>
           然后本页面刷新试试~
         </p>
       </div>
<!--购物车有商品-->
       <div  v-else >
     <div class="cart-msg">
       <img src="./img/dizhi.png" alt="" class="cart-dizhi">
       <span>loading……
       </span>
       <span class="cart-edit" @click="admin">{{admins}}</span>
     </div>

     <div
       class="cart-list"
       v-for="(section, index) in getAllCarts"
       :key="index"
     >
       <div class="cart-name">
         <div
           :class="{'check':section.checked }"
           @click="checkedStore(section,index)"
         ></div>
         <div>天猫</div>
         <div>{{section[0][0]}}</div>
       </div>

       <div class="cart-order">
         <span>购物津贴</span>
         <span>6-16-6-18跨店满减,满300减30</span>
         <span>凑单></span>
       </div>

       <ul
         v-for=" (item, i) in section"
         :key="i"
       >
         <li class="cart-goods">
           <div class="cart-goodsLeft">
             <div
               :class="{'check':item.checked }"
               @click="checkedCommodity(section,index,item, i)"
             ></div>
             <div><img :src="item[2]" alt=""></div>
           </div>

           <div class="cart-item">
             <h1>{{item[1]}}</h1>
             <span>{{item[5]}}</span>
             <div class="cart-item-bottom">
               <span class="cart-price">￥{{item[3]}}</span>

               <ul  class="cart-num">
                 <li @click.stop="subtract(item)">-</li>
                 <li>
                   <input type="text" v-model="item[6]">
<!--                   shopNum ? '1': item[6]-->
                 </li>
                 <li @click.stop="add(item)">+</li>
               </ul>
               <span class="cart-soldcount" v-show="soldcount">该库存{{item[4]}}</span>
<!--               <span class="cart-soldcount">{{soldcount}}</span>-->
             </div>
           </div>

         </li>
       </ul>

     </div>
       </div>

      </me-scroll>


<!--     结算-->
     <div class="settle">
       <div class="settle-left">
         <div
           :class="{'check':checkAllFlag}"
           @click="checkAll()"
         ></div>
         <span>全选</span>
       </div>
       <div class="settle-right" v-if="over">
         <p>合计：</p>
         <span>￥<i>{{priceCount}}</i> </span>
         <div @click="Settlement()">结算（<span>{{Lengths}}</span>）</div>
       </div>

       <div class="settle-other" v-else>
         <i class="iconfont icon-clear"></i>
         <span>清理</span>
         <div @click="Collector">移入收藏夹</div>
         <div @click="Delete">删除</div>
       </div>
     </div>

     <me-remind
       ref="remind"
       :remind="settlement"
       :icons= "icons"

     ></me-remind>
   </div>
</template>

<script>
  import MeScroll from 'base/scroll';
  import MeRemind from 'base/remind';

  import cartHeader from './header';


  import storage from 'assets/js/storage';
  import {SKUBASE_CART_KEY_KEYWORD_KEY} from '../product/config';
  import {computedCarts} from './config'

  export default {
        name: 'cart',
        components:{
          MeScroll,
          cartHeader,
          MeRemind,
        },
        data() {
          return {
            isEmpty:true,
            getAllCarts:[],
            priceCount:'',
            Lengths:'',
            shopNum: '1',
            soldcount:false,
            check:false,
            checkAllFlag:false,
            over:true,
            admins:'管理',
            settlement:'',
            icons:''
          }
        },
        // watch: {
        //   subtract:
        //   function subtract(item) {
        //     console.log(item[6]);
        //     if(item[6] <= 1){
        //       console.log('不能再减啦');
        //       return;
        //     }else {
        //       // item[6]--;
        //       this.shopNum = item[6]--;
        //       // item[6]--;
        //     }
        //   },
        // },
        created() {
          this.getCart();
          this.$refs.scroll && this.$refs.scroll.update();

        },
        methods: {
          // // 更新滚动条
          // updateScroll() {
          //   this.$refs.scroll && this.$refs.scroll.update();
          // },
          getCart() {
            //获取所有缓存
            this.getAllCarts = storage.get(SKUBASE_CART_KEY_KEYWORD_KEY, []);

            //没有数据则页面为空显示
            if(this.getAllCarts.length > 0){
              this.isEmpty = false;
              // this.$refs.scroll && this.$refs.scroll.update();
              // console.log('2');
            }else if(this.getAllCarts.length === 0) {
              this.isEmpty = true;
            }

            // this.shopNum = item[6];

            //对缓存操作，方向1，同店名不同购买类型，方向2，同店名同购买类型
            // this.getAllCarts.forEach(item => {
            //     item.filter(val => val != item[0])
            // // }
            // this.getAllCarts.filter(function (element, index, self) {
            //   return self.indexOf(element) === index;
            // })

           // this.getCarts = this.getAllCarts[0];
            // this.shopNum = this.getCarts[6];
            // this.soldCount = this.getCarts[7];
          },

          //$set实例方法解决v-model 绑定数组形式 数据不更新的问题
          add(item) {
            if(item[6] >= item[4] ) {
              console.log('库存不足了哦');
              this.$refs.remind.show();
              this.$refs.remind.RemindIcon();
              this.settlement = '啊啊，超出库存买不了了哦';

            }else {
              item[6]++;
              let obj = item[6]++;
              // Vue.set(this.item,6,obj);
              this.$set(item, 6, obj);
              // console.log(item[6]);
              // console.log(item[4]);
              // this.soldcount = `当前库存${item[4]}`;
              //显示库存
              this.soldcount = true;
            }

            let getAllCarts  = this.getAllCarts;
            //调用计算结算金额和结算商品数量方法
            let abc = computedCarts(getAllCarts)();
            this.priceCount = abc[0];
            // //得出需要结算的商品数量
            this.Lengths = abc[1];

          },

          subtract(item) {
            if(item[6] <= 1){
              console.log('不能再减啦');
              this.$refs.remind.show();
              this.$refs.remind.RemindIcon();
              this.settlement = '受不了了，宝贝不能再减少了哦';

            }else {
              // item[6]--;
              // this.shopNum = item[6]--;
              let obj = item[6];
              // Vue.set(this.item,6,obj);
              this.$set(item, 6, --obj);
              console.log(item[6]);
            }

            let getAllCarts  = this.getAllCarts;
            //调用计算结算金额和结算商品数量方法
            let abc = computedCarts(getAllCarts)();
            this.priceCount = abc[0];
            // //得出需要结算的商品数量
            this.Lengths = abc[1];
          },


          //点击店铺选中
          checkedStore(section,index,item, i) {
            if(typeof section.checked == 'undefined'){
              //给对象添加属性
              this.$set(section,'checked',true);
            }else {
              section.checked = !section.checked;
            }
            this.check = true;
            console.log('点店铺了');
            section.forEach((item, i) => {
              if(typeof item.checked == 'undefined'){
                //给对象添加属性
                this.$set(item,'checked',section.checked);
              }else {
                item.checked = section.checked;
              }
            });

            //场景：如果全选状态中，点击已被选中的店铺全选按钮，实现全选失效
            if(!section.checked) {
              this.checkAllFlag = false;
            };
            //场景：点击本店铺全选，刚好全部店铺全选，实现全部全选
            //定义变量，点击该店后，得到被选中的店铺的长度是否刚好全部店铺长度
            let sectionLength =  this.getAllCarts.filter((section) => {
              return section.checked === true;
            }).length;
            if( this.getAllCarts.length === sectionLength) {
              this.checkAllFlag = true;
            }

            let getAllCarts  = this.getAllCarts;
            //调用计算结算金额和结算商品数量方法
            let abc = computedCarts(getAllCarts)();
            this.priceCount = abc[0];
            // //得出需要结算的商品数量
            this.Lengths = abc[1];

          },

          //点击商品选中
          checkedCommodity(section,index,item, i) {

            if(typeof item.checked == 'undefined'){
              //给对象添加属性
              this.$set(item,'checked',true);
            }else {
              item.checked = !item.checked;
            }
            //商品变成选中状态
            this.check = true;
            // console.log('点商品了');

            //点击本身选中商品变成非选中，那么取消店铺全选和全部全选
            if(!item.checked && !section.checked){
              // console.log('都全选');
            }else{
              // console.log('都不全选');
              section.checked = false;
              this.checkAllFlag = false;
            };

            //极限情况，这个商品如果被选中了，刚好本店铺全部商品都被选中了，那么触发店铺全选功能
            //定义变量，点击该商品后，得到本店中都被选中的商品的长度是否刚好全部商品长度
            let itemLength = section.filter((item) => {
                return item.checked === true;
              }
            ).length;
            // console.log(itemLength);
            // if(!item.checked && !itemLength === section.length){
            //   section.checked = true;
            // }
            if(itemLength === section.length){
              section.checked = true;

              //场景：点击该商品后，刚好所有商品都被选中，触发全部全选；
              let sectionLength =  this.getAllCarts.filter((section) => {
                return section.checked === true;
              }).length;
              if( this.getAllCarts.length === sectionLength) {
                this.checkAllFlag = true;
              }

            };

            let getAllCarts  = this.getAllCarts;
            //调用计算结算金额和结算商品数量方法
            let abc = computedCarts(getAllCarts)();
            this.priceCount = abc[0];
            // //得出需要结算的商品数量
            this.Lengths = abc[1];
          },

          //点击全选实现全选和全部不选
          checkAll() {
            console.log('点全选所有了');
            this.checkAllFlag = !this.checkAllFlag;
            this.getAllCarts.forEach((section, index) => {
              if(typeof section.checked == 'undefined'){
                //给对象添加属性
                //箭头函数所以可以用this   全选则把section的都设置跟全选的状态一样
                this.$set(section,'checked',this.checkAllFlag);
                // this.$set(item,'checked',this.checkAllFlag);
              }else {
                //店铺全选已经有设置，点击店铺全选后设置成跟全选按钮的状态一样
                section.checked = this.checkAllFlag;
                // item.checked = this.checkAllFlag;
              };
              //接着循环实现全选店铺里的商品
              section.forEach((item, i) => {
                if(typeof item.checked == 'undefined'){
                  this.$set(item,'checked',this.checkAllFlag);
                }else {
                  item.checked = this.checkAllFlag;
                }
              });

            });

            let getAllCarts  = this.getAllCarts;
            //调用计算结算金额和结算商品数量方法
            let abc = computedCarts(getAllCarts)();
            this.priceCount = abc[0];
            // //得出需要结算的商品数量
            this.Lengths = abc[1];
          },

          //点击管理实现删除和移入收藏夹
          admin() {
            //当点击的时候变成完成两个字，反之
            if( this.admins ===  '完成'){
              this.admins = '管理';
              this.over = true;

            }else {
              this.admins = '完成';
              this.over = false;
            }

          },
          //点击结算
          Settlement() {
            // let allLength = this.getAllCarts.forEach((section) => {
            //   //接着循环店铺里的商品
            //   section.forEach((item) => {
            //     if(item.checked === true){
            //       return '1';
            //     }else {
            //       return '2';
            //     }
            //   });
            // });

            // console.log(allLength);
            // if(allLength.length=== 0) {
            //
            //   this.$refs.remind.show();
            //   this.$refs.remind.RemindIcon();
            //   this.settlement = '您还没有选择宝贝哦';
            // }

            // this.$refs.remind.show();
            // this.$refs.remind.RemindIcon();
            // this.settlement = '您还没有选择宝贝哦';
            //
            // let sectionLength =  this.getAllCarts.filter((section) => {
            //   // return section.checked === true;
            //   section.forEach((item) => {
            //         return item.checked !== true;
            //       });
            //
            // }).length;

            // let allLength = this.getAllCarts.forEach((section) => {
            //   //接着循环店铺里的商品
            //   //  section.filter((item,i) => {
            //   //
            //   //    if(item.checked) return this.item;
            //   //   }
            //   // );
            //   //    if(section.checked) return this.section;
            // section.every(function (item) {
            //   return item.checked === true;
            // })
            //
            // });
            // console.log(allLength);

            //先判断页面是否有商品:注意写法。直接等于0未出现购物车没宝贝提醒
            if(this.getAllCarts.length > 0) {

            }else {
              //其它情况就出现提醒
              this.$refs.remind.show();
              this.$refs.remind.RemindIcon();
              this.settlement = '您的购物车还没有宝贝哦';
              return;
            }

            //页面有商品但未选择
           //定义方法 获取页面上有被选中的项
            let arr = [];
            for(let i=0;i < this.getAllCarts.length;i++){
              let aa = this.getAllCarts[i].filter((item) => {
                    return item.checked === true;
                  }
                );
              arr.push(aa.length);
            };
            let newArr = arr.filter(ar => {
              return ar > 0;
            });
            // console.log(newArr);
            if(newArr.length === 0) {
              this.$refs.remind.show();
              this.$refs.remind.RemindIcon();
              this.settlement = '您还没有选择宝贝哦';
            }
          },

          //移入收藏夹
          Collector() {
              //定义方法 获取页面上有被选中的项
              let arr = [];
              for(let i=0;i < this.getAllCarts.length;i++){
                let aa = this.getAllCarts[i].filter((item) => {
                    return item.checked === true;
                  }
                );
                arr.push(aa.length);
              };
              let newArr = arr.filter(ar => {
                return ar > 0;
              });
              // console.log(newArr);
              if(newArr.length === 0) {
                this.$refs.remind.show();
                this.$refs.remind.RemindIcon();
                this.settlement = '您还没有选择宝贝哦';
              }
            },

          //删除
          Delete() {
            //定义方法 获取页面上有被选中的项
            let arr = [];
            for(let i=0;i < this.getAllCarts.length;i++){
              // //解决刚打开页面都是undefined问题，赋值false，利于后面筛选出没被选中的店铺
              // if(typeof this.getAllCarts[i].checked == 'undefined'){
              //   //给对象添加属性
              //   this.$set(this.getAllCarts[i],'checked',false);
              // };
              // //再循环给店铺里的每个商品checked为false
              // for(let j=0;j <this.getAllCarts[i]; j++) {
              //   if(typeof this.getAllCarts[i][j].checked == 'undefined'){
              //     //给对象添加属性
              //     this.$set(this.getAllCarts[i][j],'checked',false);
              //   };
              // }


              //过滤出有被选中的项
              let aa = this.getAllCarts[i].filter((item) => {
                  return item.checked === true;
                }
              );
              arr.push(aa.length);
            };
            let newArr = arr.filter(ar => {
              return ar > 0;
            });
            // console.log(newArr);
            if(newArr.length === 0) {
              this.$refs.remind.show();
              this.$refs.remind.RemindIcon();
              this.settlement = '您还没有选择宝贝哦';
            }



            //定义方法，剔除被选中的项目，保留没被选中的
            let arr1 = [];
            //对店铺过滤，保留没被全选的店铺组成新数组
           arr1 = this.getAllCarts.filter(section => {
              return section.checked !== true;
            });
            // console.log(arr1);

            // let newArr1 = arr1.forEach(section1 => {
            //   section1.filter(item1=> {
            //     return item1.checked === false;
            //   });
            // })

            let newArr1 = [];
            for(let j=0;j<arr1.length;j++){
             let arr2 =  arr1[j].filter(item1=> {
                  return item1.checked !== true;
                });
              // console.log(arr2);
              newArr1.push(arr2);
            }


            //获取到各个店铺里各个没被选中的宝贝组成新数组
            // let newArr1 = arr1.filter(item1=> {
            //   return item1.checked === false;
            // });
            //
            // console.log(newArr1);
            // console.log(this.getAllCarts);

            //把未被选中的重新赋值给本页面，实现删除效果~
            //注，没有删除原缓存，所以刷新后还原，从原缓存中获取
            this.getAllCarts = newArr1;


            let getAllCarts  = this.getAllCarts;
            //调用计算结算金额和结算商品数量方法
            let abc = computedCarts(getAllCarts)();
            this.priceCount = abc[0];
            // //得出需要结算的商品数量
            this.Lengths = abc[1];

            // //重新计算结算金额
            // //计算结算金额，换个思路，每次点击都遍历所有被选中的，从而得出结算总额
            // let arr3 = [];
            // for(let i=0;i < this.getAllCarts.length;i++){
            //   //对店铺过滤，取出被选中的项目作为新数组
            //   let aa = this.getAllCarts[i].filter((item) => {
            //     return item.checked === true;
            //   });
            //   arr3.push(aa);
            // }
            //
            // //获取到各个店铺里各个被选中的宝贝，三维数组
            // let newArr2 = arr3.filter(newArr => {
            //   return newArr.length !== 0;
            // });
            //
            // //进一步处理,获取每个商品结算金额，单价*数量，放进cc数组
            // let cc = [];
            // for(let i=0; i<newArr2.length;i++) {
            //   for(let j = 0; j < newArr2[i].length;j++){
            //     cc.push(newArr2[i][j][3]*newArr2[i][j][6]);
            //   };
            // };
            // //计算总结算金额sum
            // let sum = 0;
            // for(let k=0;k<cc.length;k++){
            //   sum += cc[k];
            // }
            // this.priceCount = sum;
            // //得出需要结算的商品数量
            // this.Lengths = cc.length;


            //没有数据则页面为空显示
            if(this.getAllCarts.length > 0){
              this.isEmpty = false;
              // console.log('2');
            }else if(this.getAllCarts.length === 0) {
              this.isEmpty = true;
              //全选不再选中状态
              this.checkAllFlag = false;
            };
          },


        }
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .cart {
    width: 100%;
    &-empty {
      font-size: 18px;
      line-height: 30px;
      width: 100%;
      color: red;
      text-align: center;
      margin-top: 150px
    }
    &-msg {
      font-size: 16px;
      margin-top: 10px;
      background: #ffffff;
      height: 40px;
      line-height: 40px;
      .cart-dizhi {
        width: 18px;
        height: 18px;
        margin-left: 10px;
        margin-top: 13px;
      }
      .cart-edit {
        float: right;
        margin-right: 10px;
      }
    }

    &-list {
      background-color:rgb(256,246,242);
      margin-top: 10px;
      border-radius:20px;
      width: 95%;
      margin-left: 2.5%;
      .cart-name {
        background: #ffffff;
        height: 30px;
        border-radius:20px 20px 0px 0px;
        display: flex;


        div:nth-child(1) {
          display: inline-block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border:2px solid rgba(191,191,191,.8);
          margin-left: 20px;
          margin-top: 6px;

        }
        div:nth-child(2) {
          @include flex-center();
          margin-left: 10px;
        }
        div:nth-child(3) {
          @include flex-center();
          margin-left: 8px;
          color: #000;
          font-size: 14px;
          font-weight: bold;
        }
      }

      .cart-order {
        height: 40px;
        line-height: 40px;
        span:nth-child(1) {
          margin-left: 46px;
        }
        span:nth-child(2) {
          margin-left:8px ;
        }
        span:nth-child(3) {
          float: right;
          margin-right: 10px;
        }
      }

      .cart-goods {
        display: flex;
        border-bottom: 1px solid gainsboro;
        padding-top: 10px;

        .cart-goodsLeft {
          display: flex;
          height: 50px;
          div:nth-child(1) {
            display: inline-block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border:2px solid rgba(191,191,191,.8);
            margin-left: 20px;
            margin-top: 16px;
          }

          div:nth-child(2) {
            width:70px;
            height: 70px;
            line-height: 50px;
            margin: auto auto;
            margin-left: 8px;

            & img {
              width: 100%;
              height: 100%;
            }

          }
          div:nth-child(3) {
            margin-left: 10px;
          }
        }

        .cart-item {
          margin-left: 15px;
          margin-right: 15px;
          h1:nth-child(1) {
            margin-bottom: 8px;
            line-height: 15px;
            color: #000;
            padding-right: 10px;


            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;  //将对象作为弹性伸缩盒子模型显示。
            -webkit-box-orient:vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
            -webkit-line-clamp:2; //这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。此处为2行
            word-wrap: break-word;//允许单词内断句，首先会尝试挪到下一行，看看下一行的宽度够不够，不够的话就进行单词内的断句
          }
          span:nth-child(2) {
            /*margin-top: 10px;*/
            background-color: rgba(247,241,237,.8);
            line-height: 15px;
            padding-right: 10px;

          }

          .cart-item-bottom {
            height: 60px;
            @include flex-between();

            .cart-price {
              color: rgb(251,56,0);
              margin-right: 20px;
              text-align: center;
              width: 65px;
            }
            .cart-num {
              height: 25px;
              width: 110px;
              border: 1px solid rgb(239,239,239);
              border-radius:5px;
              display: flex;
              font-size: 16px;
              margin-right: 15px;
              /*margin-left: 10px;*/
              background-color: #ffffff;

              li:nth-child(1) {
                width: 20px;
                height: 100%;
                border-right:1px solid rgb(239,239,239);
                @include flex-center(column);
              }

              li:nth-child(2) {
                width: 50px;
                height: 100%;
                border-right:1px solid rgb(239,239,239);
                @include flex-center(column);
                margin: 0 2px;
                & input {
                  width: 100%;
                  height: 100%;
                  display: inline-block;
                  text-align: center;
                }

              }
              li:nth-child(3) {
                width: 20px;
                @include flex-center(column);
              }
            }
            & .cart-soldcount {
              font-size:10px;
              color: red;
              text-align: left;
            }

          }

        }
      }
    }

    .settle {
      z-index: 1000;
      height: 50px;
      width: 100%;
      background-color: #ffffff;
      border-top: 1px solid rgba(213,213,214,.8);
      @include flex-between();
      position: fixed;
      bottom: 50px;
      &-left {
        @include flex-center();
        & div {
          display: inline-block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border:2px solid rgba(191,191,191,.8);
          margin-left: 15px;
        }
        & span {
          margin-left: 10px;
        }
      }
      &-right {
        @include flex-center();
        & > span {
          margin: 0 3px;
          color:rgb(252,62,19);
        }

        & div {
          /*width: 85px;*/
          height: 35px;
          background-color: rgba(252,67,9,.8);
          color: #ffffff;
          margin-right: 10px;
          margin-left: 10px;
          border-radius:20px;
          line-height: 35px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          padding-left: 12px;
          padding-right: 3px;
        }
      }

      &-other {
        @include flex-center();
        margin-right: 15px;
        line-height: 25px;
        text-align: center;
        & > i {
          font-size: 12px;
          margin: 0 3px;
        }

        & span {
          margin: 0 3px;
        }
         div:nth-child(3) {
          color: red;
           width: 80px;
           height: 25px;
           border:1px solid orange;
           border-radius:20px;
           /*line-height: 25px;*/
           /*text-align: center;*/
           margin:0px 10px;
        }
         div:nth-child(4) {
          color: blue;
           width: 55px;
           height: 25px;
           border:1px solid red;
           border-radius:15px;
        }

      }

    }

  }
  /*点击选项更换该背景色*/
  .check{
    background-color:red;
  }
</style>
