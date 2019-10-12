<template>
  <transition name="fade-skubase">
    <div class="skubase" v-show="visible">
      <div class="skubase-msg">
        <div class="skubase-img"><img :src="image" alt=""></div>
        <div class="skubase-price">
            <span class="skubase-priceNow">￥{{price}}</span>
            <span>库存{{soldCount}}</span>
            <div class="skubase-type">
              <span>{{myType}}</span>
              <span
                v-for="(type, index1) in skuBasesType"
                :key="index1"
              >
                {{type.name}}
              </span>
            </div>
        </div>

        <div
          class="skubase-close"
          @click="close"
        >
          <div class="skubase-closeGo">

          </div>
        </div>
      </div>

<!--      <me-scroll>-->

      <div v-for="(item, index) in skuBases" :key="index" class="skubase-sellect" >
        <div>{{item.name}}</div>
       <ul>
          <li
            v-for="(itemLi, i) in item.values"
            @click="change(index,i,item,itemLi, $event)"
            :class="{'check': itemLi.checked}"
            :key="i"
          >
              <div>
                <img :src="itemLi.image" alt="" v-show="('image' in itemLi)">
                <span>{{itemLi.name}}</span>
              </div>
          </li>
        </ul>
      </div>

      <div class="skubase-num">
        <div>
          购买数量
          <span>(每人限购9件)</span>
        </div>

        <ul>
          <li
            @click="subtract"
            :class="{'opacBg':isActive, 'opacbgs':active}"

          >-</li>
          <li>
            <input type="text" v-model="shopNum">
          </li>
          <li @click="add">+</li>
        </ul>

      </div>

<!--      </me-scroll>-->

      <div class="skubase-cofirm" @click="confirm">确定</div>

    </div>
  </transition>
</template>

<script>
  // import MeScroll from 'base/scroll';
  import storage from 'assets/js/storage';
  import {SKUBASE_CART_KEY_KEYWORD_KEY} from './config';


  export default {
        name: 'skuBase',
        components:{
          // MeScroll
        },
        data() {
          return {
            visible:false,
            skuBases: [],
            price:'',
            soldCount:'',
            image:'',
            myType:'',
            iac:[], //存储状态以便选择商品
            shopNum:'1',
            isActive:false,
            active:true,
            // isShow:true,
            skuBasesType:[],
            clicked:true,
            // changeBgcolor:'',
            carts:[],
            check:'false',

          }
        },
        props:{
          skuData:{
            type:Array,
            default() {
              return [];
            },
          }
        },
        created(){
          // this.skuBasesType = this.skuBases;
          // this.updateScroll();

        },
        watch:{
          skuData(data){
            if (data.length === 0) return;
            this.skuBases = data[0];
            //初始化渲染类型选择,极端情况下可能没有类型供选择，那么使用默认为空
            this.skuBasesType = this.skuBases;
            if(this.skuBasesType){
              this.myType='请选择';
            }else {
              this.myType='';
            };
            // console.log(this.skuBases);
            this.price = data[1];
            // console.log(this.price);
            this.soldCount = data[2];
            this.image = data[3][0];
            this.shopName = data[4];
            this.title = data[5];
          }
        },

        methods:{
          show(){
            this.visible = true;
            console.log('成功');
          },
          hide() {
            this.visible = false;
          },
          //点击确定执行操作
          confirm(){
            let typeItems = [];
            //this.skuBasesType可能是未定义，因为该商品不需要选择类型，所以加存在判断
            if(this.skuBasesType && this.skuBasesType.length){
              // console.log(this.skuBasesType);
              this.skuBasesType.forEach(typeItem => {
                typeItems.push(typeItem.name);
              });

              this.typeItems=typeItems.join(' ');
              // console.log(typeItems.join(' '));
              // console.log(this.typeItems);

              //提醒某类型没有做出选择
              this.$emit('remind',this.typeItems);

              // return;

            }else {
              //库存判断有关，都没问题就可添加到购物车
              if(this.shopNum <= this.soldCount){
                //提醒加入购物车成功并隐藏页面
                this.$emit('remindCart');
                this.hide();

                //调用方法，把数据缓存：同页面methods一个方法调用另外一个方法；不过显示undefined
                // this.$options.methods.carts();

                //把购物车需要的数据设置数组形式缓存
                //设置需要缓存进去的数据
                this.carts=[this.shopName,this.title,this.image,this.price,this.soldCount,this.myType,this.shopNum];
                //设置前先获取缓存，如果已经有了需要判断一下
                let keywords = storage.get(SKUBASE_CART_KEY_KEYWORD_KEY, []);
                //从缓存中判断，如果有值，那么决定本次添加的数据应该如何添加到缓存中；


                //缓存是三维数组结构 [[[a店，类型1，数量],[a店，类型2，数量]], [[b店，类型1，数量],[b店，类型2，数量]]]


                //实际应用中缓存应是对象形式，里面含数组，有机会再用vuex重构
                if (keywords.length !== 0) {
                  //定义变量方法使用
                  let shopName = this.shopName;
                  let myType = this.myType;
                  let carts = this.carts;
                  let shopNum = this.shopNum;

                  //原方法判断，错误~~因为循环导致缓存添加更多值
                  // keywords.map(function (item, index) {
                  //
                  //   if(shopName === item[0][0]){
                  //     // console.log('同名');
                  //     if(item[0][5] && myType === item[0][5]){
                  //       console.log('同名同类型');
                  //       item.push(carts);
                  //       storage.set(SKUBASE_CART_KEY_KEYWORD_KEY,  keywords);
                  //
                  //
                  //     }else if (item[0][5] && myType !== item[0][5]) {
                  //       console.log('同名不同类型');
                  //       item.push(carts);
                  //       storage.set(SKUBASE_CART_KEY_KEYWORD_KEY,  keywords);
                  //
                  //     }
                  //
                  //   }else if(shopName !== item[0][0]) {
                  //     console.log('不同名的店铺');
                  //     // keywords.unshift([carts]);
                  //     keywords.push([carts]);
                  //
                  //     storage.set(SKUBASE_CART_KEY_KEYWORD_KEY,  keywords);
                  //   }
                  // })

                  // for(let i=0;i<keywords.length;i++){
                  //   // console.log(keywords[i][0]);
                  //   if(this.shopName === keywords[i][0][0]){
                  //     // console.log('同名');
                  //     if(keywords[i][0][5] && this.myType === keywords[i][0][5]){
                  //       console.log('同名同类型');
                  //     }else {
                  //       console.log('同名不同类型');
                  //     }
                  //
                  //   }else {
                  //     console.log('不同名的店铺');
                  //    for循环方法导致这里死循环 不采取.因为再设置缓存后数组长度在增加导致判断失效。
                  //     return keywords.unshift([this.carts]);
                  //
                  //   }
                  // }

                  //定义新方法
                  //过滤出同名店铺，看看数组长度，为0说明没有同名的
                  let length1 = keywords.filter((shopname,index )=> {
                    return shopname[0][0] === shopName;
                  }).length;
                  //新方法：find()方法查找同名的并返回找到的元素组成新数组，没有则undefined;这里未用
                  let name1 = keywords.find(value => {
                    return value[0][0] === shopName;
                  });


                  //找到同名店铺在最大数组中的位置  findIndex()方法,找不到返回-1
                  let index1 = keywords.findIndex((value) => {
                   return  value[0][0] === shopName;
                  });
                  //同名的店铺情况下，找到这个店铺，给它数组里添加carts商品信息
                  //同名的店铺，分为2种情况，1是同名同购买选择类型，那么合并，购买数量累加；，2是同名不同购买类型，直接push；
                  if(length1 > 0){
                    //同名的情况下，找到同类型在的位置,shopName已经知道，店铺位置也知道;找不到就返回-1
                    let index2 =keywords[index1].findIndex(value => value[5] === myType);
                    // console.log(index2);
                    //同名同购买选择类型，那么合并，购买数量累加
                    if(index2 !== -1){
                      console.log('同名同类型');
                      //把该类型的购买数量变成累加 注意不是拼接，可以前面加个+ 号
                      // let sum = +keywords[index1][index2][6] + +shopNum ;
                      //其它解决办法
                      let sum = parseInt(keywords[index1][index2][6]) + parseInt(shopNum) ;
                      // console.log(sum);
                      keywords[index1][index2].splice(6,1,sum);

                    }else {
                      //同名不同类型，直接在该店铺组成的数组中添加值
                      keywords[index1].push(carts);
                      console.log('同名不同类型');
                    };



                  }else {
                    //不同名的店铺，直接大数组后面添加
                    keywords.push([carts]);
                    console.log('不同名店铺');
                  };
                  //把更改后的数组设置缓存
                  storage.set(SKUBASE_CART_KEY_KEYWORD_KEY,  keywords);



                }else {
                  console.log('缓存没内容');
                  //缓存没内容那么设置新内容进去
                  keywords.unshift([this.carts]);
                  storage.set(SKUBASE_CART_KEY_KEYWORD_KEY,  keywords);
                };



              }else {
                //购买数量超出了，那么重置为1
                console.log('数量超出范围了哦');
                this.$emit('isSoldCount');
                this.shopNum = '1';
              };
            };

          },
          //取消关闭选择窗口
          close() {
            this.hide();
          },
          // 更新滚动条
          // updateScroll() {
          //   this.$refs.scroll && this.$refs.scroll.update();
          // },


          //点击选项
         change(index, i, item, itemLi, event) {
           //未用到源事件
           // console.log(event.currentTarget);
           // console.log(event.target);
           //解决刚开始无属性问题
           // if(typeof itemLi.checked == 'undefined'){
           //   //给所有对象添加属性，解决被点击后才添加属性值bug
           //   //找到所有为'undefined'的，被点击的为true
           //   this.$set(item.values[i],'checked','true');
           //
           //
           //   //其他统统为false
           //   //定义数组，剔除被点击的项目，其他项组成新数组
           //   let Items = item.values.filter((item1) => {
           //     return item1!== itemLi;
           //   });
           //   //同一分类下其他项目都取消选中状态。
           //   Items.forEach(item => {
           //     item.checked = false;
           //     //以下依然出bug
           //     // this.$set(item,'checked','false');
           //   });
           //
           //
           //
           // }else {
           //   // item.values[i].checked = !item.values[i].checked;
           //   itemLi.checked = !itemLi.checked;
           //   //切换该项目的背景色
           //   //该分类有多个，说明长度大于1。同一分类多个项目的点击这个，其它需要取消被选中状态
           //   if(item.values.length > 1) {
           //
           //    //被点击的项目自由切换
           //     //定义数组，剔除被点击的项目，其他项组成新数组
           //     let items = item.values.filter((item1,i1) => {
           //           return item1!== itemLi;
           //          });
           //     // console.log(items);
           //     //同一分类下其他项目都取消选中状态
           //     items.forEach(item => {
           //           item.checked = false;
           //        });
           //     //该分类只有一个的自由切换
           //
           //   }else {
           //     itemLi.checked = !itemLi.checked;
           //   }
           //
           //   // //优化，不用判断该分类有几个，统统遍历该分类;forEach对空数组不会操作~
           //   // //被点击的项目自由切换
           //   // item.values[i].checked = !item.values[i].checked;
           //   //
           //   // //定义数组，剔除被点击的项目，其他项组成新数组
           //   // let items = item.values.filter((item1, i1) => {
           //   //   return item1!== itemLi;
           //   // });
           //   // //同一分类下其他项目都取消选中状态。
           //   // items.forEach(item => {
           //   //   item.checked = false;
           //   // });
           //
           // };

           // //换个思路:分开解决没有必然联系的功能，减少代码耦合
           // if(typeof itemLi.checked == 'undefined') {
           //   // this.$set(item.values[i], 'checked','true');
           //   this.$set(itemLi, 'checked','true');
           // }else {
           //   itemLi.checked = !itemLi.checked;
           //   // this.$set(itemLi, 'checked',!itemLi.checked);
           // }

           //实现同类型变多选问题
           //定义数组，剔除被点击的项目，其他同类下的项组成新数组
           //   let items = item.values.filter((item) => {
           //     return item !== itemLi;
           //   });
           //   // 同一分类下其他项目都取消选中状态。
           //   items.forEach(item => {
           //     item.checked = false;
           //     // this.$set(item,'checked','false');
           //   });
           // for(let j=0;j<items.length;j++){
           //   items[j].checked = false;
           //   // this.$set(items[j],'checked','false');
           // }
           // items.map(item =>  item.checked = false);
           // item.values.map(val => {
           //   // eslint-disable-next-line no-return-assign
           //   // if(val !== itemLi) return val.checked = false;
           //   // if(val !== itemLi) return  this.$set(val ,'checked','false');
           //   if(val === itemLi) {
           //     // return;
           //   }else {
           //    // this.$set(val ,'checked','false');
           //     val.checked = false;
           //   }
           //
           // });

           // this.$nextTick(()=> {

             //换个思路:分开解决没有必然联系的功能，减少代码耦合
             if(typeof itemLi.checked == 'undefined') {
               // this.$set(item.values[i], 'checked','true');
               this.$set(itemLi, 'checked','true');
             }else {
               itemLi.checked = !itemLi.checked;
               // this.$set(itemLi, 'checked',!itemLi.checked);
             }
             //把同类中其它项设置为false
             item.values.map(val => {
               if(val !== itemLi) return val.checked = false;
               // if(val !== itemLi) return  this.$set(val ,'checked','false');
          });


           // });


            //判断状态，本身没具体实现功能代码
           // if(itemLi.checked) {
           //   console.log('我被选中了');
           //   console.log(itemLi.checked);
           // }else if(itemLi.checked === false){
           //   console.log('我被取消选中了');
           //   console.log(itemLi.checked);
           //
           // }


           // 更换商品展示图片变对应小图片
           if ('image' in itemLi ) {
             if(itemLi.checked){
               this.image = item.values[i].image;
               // console.log('选中了切换图片');

             }else {
               // this.$set(this.image,src,data[3][0]);
               // console.log('没选中还原原图');
               // this.image = data[3][0];
               //从props中取初始值，而不是watch里取；
               this.image = this.skuData[3][0];
             }
           }

           //过滤器过滤掉被点击项的所属类型在请选择中一栏的显示.filter不会改变原数组
           //循环遍历每个分类，效果是有被选中的就取消这个对应的分类显示
           // //如果这个类有被选中的，那么不会被筛选掉，否则筛选掉
           // let itemType =  item.values.filter( item => item.checked === true) ;
           // if(itemType.length){
           //   // let indexType = this.skuBasesType.findIndex(value => value === item);
           //   // console.log(indexType);
           //   this.skuBasesType = this.skuBasesType.filter(val => val !== item);
           //
           // }else {
           //   //否则恢复回去；方法是找到被过滤的类型，返回对应位置然后添加
           //   // let indexType = this.skuBasesType.findIndex(value => value === item);
           //   // this.skuBasesType = this.skuBasesType.splice(indexType,0,item);
           //
           // }

           //改变选项背景色有关,原来的方式；
           // :class="{'changeColor':i === iac[index]}"
           // concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
           // 数组来储存选择状态,concat连接空数组
           this.iac[index] = i;
           this.iac = this.iac.concat([]);
           // console.log(this.iac);
           // //

           // //过滤器过滤掉被点击项的所属类型在请选择中一栏的显示
           //过滤后：
           // this.skuBasesType =  this.skuBasesType.filter(val => val !== item);

           //假如会被过滤。定义过滤后的数组
           let noFilter =this.skuBasesType.filter(val => val !== item);
           //找到被过滤那个类的位置
           // let indexFilter = this.skuBasesType.findIndex(value => value === item);
           // 如果不被过滤，那么重新连接回去
           // let noFilter = [];
           // let indexArr = [];
           // indexArr.push(indexFilter);
           if(itemLi.checked === false){
             //不被过滤，那么重新连接回去，concat会后面连接
             //根据淘宝效果应是原位置显示，尝试其他方法注意添加值的时候splice返回的是什么，返回被删除的元素，没被删除就返回空，会改变原数组
             this.skuBasesType =  noFilter.concat(item);
             //效果更不佳，一样由于点击问题导致被打乱顺序
             //   this.skuBasesType.splice(indexFilter,0,item);

             // this.$set(this.skuBasesType,indexArr[indexArr.length-1],item.name);

           }else{
             this.skuBasesType = noFilter;

           }

           //
           // console.log(this.skuBasesType);
           // console.log(indexFilter);

           // 这个被点击项对应的类需要被过滤的,定义过滤后的新数组
          //  let filterType =  this.skuBasesType.filter(val => {
          //    if(itemLi.checked){
          //      return val !== item;
          //    }
          //  });
          //
          //  if(itemLi.checked){
          //    //如果该项是需要过滤的，那么过滤后赋值
          //    this.skuBasesType = filterType;
          //  }else {
          //    // 这项被点击后从true变false的，说明不会被过滤掉，那么还原回去原来的数组
          //    return;
          //  }



           // this.skuBasesType.push(item.name);
           // console.log(this.skuBasesType);


           //所有类型都作出了选择，才能取消请选择xx类型，变成已选，
           // 并解决掉iac[a]为非数字empty的bug：当未按类型顺序选择时候报错问题,因为iac[a]可能是空，不是数字，导致name未定义报错
              if(this.skuBasesType.length > 0){
                this.myType = `请选择：`;
              }else {

                //实现点击选择商品时候显示 已选择xxx；只有所有类型都被选中，才能显示；
                let sellcts = [];
                for(let a =0; a < this.iac.length; a++){

                  let bb = this.skuBases[a].values[this.iac[a]].name;
                  sellcts.push(bb);
                  this.myType = `已选：${sellcts.join(' ')}`;
                }

              }


              // //更换商品小图片
              // if ('image' in itemLi ){
              //   //如果这个项点击是被选中的状态，那么设置对应图片，否则还原原图
              //   //需要点击了其它所有分类，才能切换图bug；解决bug：先给它设置属性，因为刚开始没有属性问题
              //   // let items1 = item.values.filter((item1,i1) => {
              //   //   return item1.checked === true;
              //   // });
              //   // console.log(items1.length);
              //   // //长度=1，说明被点击后，本类中有一个选中的，那么更换图片
              //   // if(items1.length !== 0){
              //   //   this.image = itemLi.image;
              //   //   console.log('选中了切换图片');
              //   // }else {
              //   //   // 否则还原原图
              //   //   // this.image = data[3][0];
              //   //   console.log('没选中还原原图');
              //   // }
              //   if(itemLi.checked){
              //     // item.values[i].checked
              //     this.image = item.values[i].image;
              //     console.log('选中了切换图片');
              //
              //   }else {
              //     // this.image = data[3][0];
              //       console.log('没选中还原原图');
              //   }
              //
              //   // this.image = itemLi.image;
              // }

           // if ('image' in itemLi ){
           //   if(itemLi.checked){
           //     this.image = item.values[i].image;
           //     console.log('选中了切换图片');
           //
           //   }else {
           //     // this.image = data[3][0];
           //     console.log('没选中还原原图');
           //   }
           // }

         },



         //加减以及减号背景色改变
          subtract() {
            // if(this.shopNum =1 ){
            //   this.active = true;
            //   this.isActive = false;
            // }
            // if(this.shopNum <= 1){
            //   // console.log('不能再减啦');
            //   this.active = true;
            //   this.isActive = false;
            //   return;
            // }else {
            //   this.shopNum--;
            // }
            //
            // if(this.shopNum > 1) {
            //   this.shopNum--;
            //   this.active = true;
            //   this.isActive = false;
            // }else {
            //   console.log('不能再减啦');
            //   return;
            // }


            if(this.shopNum <= 1){
              console.log('不能再减啦');
              return;
            }else {
              this.shopNum--;
              //减少的时候判断是否为1再改变背景色，注意是 ==
              //嵌套判断避免减少为1时候背景色未改变
              if(this.shopNum == 1){
                this.active = true;
                this.isActive = false;
              }
            }

          },
          add() {
            // this.shopNum++;
            // if(this.shopNum >= 1) {
            //   this.isActive = true;
            //   this.active = false;
            //
            //   if(this.shopNum > this.soldCount ) {
            //     console.log('库存不足了哦');
            //     this.$emit('isSoldCount');
            //   }
            // }

            //小bug未解决，输入10000，还能够加1，接着才不能增加
            if(this.shopNum >= this.soldCount ) {
              console.log('库存不足了哦');
              this.$emit('isSoldCount');
              return;

            }else {
              this.shopNum++;
              if(this.shopNum >= 1) {
                this.isActive = true;
                this.active = false;
              }
            }
          }
          // updateScroll() {
          //   this.$refs.scroll && this.$refs.scroll.update();
          //   console.log('2');
          // },
        },


  };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .skubase {
    height: 600px;
    width: 100%;
    background-color: #ffffff;
    z-index: $skubase-z-index;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    /*position: relative;*/
    &-msg {
      height:150px;
      width: 100%;
      border-bottom: 1px solid rgba(246,245,246,.9);
      display: flex;
      position: relative;
      & .skubase-img {
        margin-left: 10px;
        margin-top: 15px;
        & > img {
          width: 80px;
          height: 110px;
        }
      }
      & .skubase-price {
        //@include flex-center(column);
        height: 110px;
        margin-top: 15px;
        margin-left: 20px;
        text-align: left;
        /*vertical-align:bottom;*/
        /*display:table-cell;*/
        padding-top: 50px;

        & span {
            display: block;
            height: 20px;
            line-height: 28px;
          }
        & .skubase-priceNow {
          color: rgb(246,73,31);
          font-size: 16px;
        }


        & .skubase-type {
          display: flex;
          font-size: 12px;
          color: rgb(138,138,138);

          & span {
            margin-right: 5px;
          }
        }
      }
     /*右上角关闭按钮*/
      & .skubase-close {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border:2px solid rgba(191,191,191,.8);
        margin-top: 15px;
        /*margin-left: 40%;*/
        position: absolute;
        right: 10px;


        .skubase-closeGo {
          width: 10px;
          height: 10px;
          overflow: hidden;
          position: relative;
        }
        .skubase-closeGo::before,
        .skubase-closeGo::after {
          position: absolute;
          content: '';
          top: 60%;
          left: 2px;
          background: rgba(191,191,191,.8);
          width: 100%;
          height: 2px;
        }
        .skubase-closeGo::before {
          transform: rotate(45deg);
        }
        .skubase-closeGo::after {
          transform: rotate(-45deg);
        }
      }

    }



    &-sellect {
      overflow: hidden;
      width: 100%;
      color:rgb(82,82,82);
      font-size: 14px;
      border-bottom: 1px solid rgba(246,245,246,.9);
      margin-top: 10px;
      & > div {
        margin-left: 10px;
        margin-bottom: 10px;
      }

      & > ul {
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;

        & li {
          margin-bottom: 15px;
          margin-left: 10px;
          background-color: rgba(242,242,242,.9);
          /*max-width: 180px;*/
          min-width: 50px;
          height: 28px;
          line-height: 28px;
          border-radius:10px;
          text-align: center;
          @include ellipsis();
          & > div {
             & > img {
               width: 25px;
               height: 25px;
               display: inline-block;
               margin-top: 2.5px;
               margin-left: 5px;
               float: left;
             }
          }
        }
      }
    }
    .check {
      background:rgb(255,247,247);
      color:rgb(214,91,48);
      border:1px solid rgb(214,91,48);
    }

    &-num {
      @include flex-between();
      margin-left: 10px;


      & ul {
        height: 30px;
        width: 110px;
        border: 1px solid rgb(239,239,239);
        border-radius:5px;
        display: flex;
        font-size: 16px;
        margin-right: 15px;

        li:nth-child(1) {
          width: 30px;
          height: 100%;
          border-right:1px solid rgb(239,239,239);
          @include flex-center(column);
        }
        & .opacBg {
          background-color: rgba(242,242,242,.9);
        }
        & .opacbgs {
          background-color:   rgb(250,250,250);
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
            background-color: rgba(242,242,242,.9);
          }

        }
        li:nth-child(3) {
          width: 30px;
          @include flex-center(column);
          background-color: rgba(242,242,242,.9);

        }
      }
    }


    &-cofirm {
      width: 90%;
      height: 40px;
      /*margin: 0 auto;*/
      margin-left: 5%;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      border-radius:30px;
      background: -webkit-linear-gradient(left, rgb(251,97,9), rgb(251,42,0)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, rgb(251,97,9), rgb(251,42,0)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, rgb(251,97,9), rgb(251,42,0)); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, rgb(251,97,9), rgb(251,42,0)); /* 标准的语法（必须放在最后） */
      position:absolute;
      bottom: 10px;
      z-index: $skubase-z-index+1;
    }

  }

  /*动画效果*/
  .fade-skubase-enter-active, .fade-skubase-leave-active {
    transition: transform .3s ease-in;
  }
  .fade-skubase-enter, .fade-skubase-leave-to
    /* .list-leave-active for below version 2.1.8 */ {
    transform: translateY(600px);
  }
</style>
