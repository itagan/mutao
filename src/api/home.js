import axios from 'axios';
import jsonp from 'assets/js/jsonp';
import {SUCC_CODE, TIMEOUT, HOME_RECOMMEND_PAGE_SIZE, jsonpOptions} from './config';

// 打乱数组顺序 方法
const shuffle = (arr) => {
  const arrLength = arr.length;
  let i = arrLength;
  let rndNum;
 //循环，当前的索引不等于随机取的索引的话
  while (i--) {
    if (i !== (rndNum = Math.floor(Math.random() * arrLength))) {
       //交换数组里这两个值的位置，es6新写法，解构赋值。一般的处理还得引入第三方变量。
      //实现循环数组的长度，任意交换数组中两个值的位置，这样就打乱数组了
      [arr[i], arr[rndNum]] = [arr[rndNum], arr[i]];
    }
  }

  return arr;
};

//获取幻灯片数据--ajax
// 暴露常量给其它引用
// timeout 用于设置超时 ，get里，api后面{ 超时设置 }，是axios本身的参数，用来定义请求发出的延迟毫秒数
export const getHomeSlider = () => {
  return axios.get('http://www.imooc.com/api/home/slider',{
    timeout:TIMEOUT
  }).then(res => {
      if(res.data.code === SUCC_CODE) {
        //保存获取到的幻灯片为变量
        let sliders = res.data.slider;
        //随机获取一张幻灯片，避免处理完没有一张图片的情况
        const slider = [sliders[Math.floor(Math.random() * sliders.length)]];
        //返回新数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。产生随机数，大于0.5的就保存到新数组中,这样每张幻灯片就有50%概率获取到并组成数组
        //filter遍历数组，返回真就保留，否则剔除。 下边的es6箭头函数写法，没有带{}，又仅仅一条语句，那么就是return  Math.random() >= 0.5)
        sliders = shuffle(sliders.filter(() => Math.random() >= 0.5));

        //考虑到上面>0.5判断也可能全剔除了幻灯片，所以把取得一张的赋值给sliders
        if (sliders.length == 0) {
          sliders = slider;
        }

        return sliders;
      }
        // 没有获取成功，手动抛出错误。获取错误，比如请求超时。超时的错误用catch捕获它
      throw new Error('没有成功获取到数据！');
    }).catch(err => {
      if(err) {
        console.log(err);
      }
      //catch可以捕获到所有错误，比如code不等于0的时候，上面抛出错误后这里捕获到。但是其他如超时错误，也一样可以捕获到。
    //10毫秒是不能获取到数据的，所以会报错。Error:timeout of 10ms exceeded.不能让页面空空如也，需要着手处理错误，可以设置按钮刷新，给提示性文字。
    //这里简单一些，返回数组，放404图片.没有真正处理错误
      return [
        {
          'linkUrl':'https://www.imooc.com',
          'picUrl':require('assets/img/404.png')
          // 解决超时页面空白问题，可以写提示
        }
      ]
  })
  //   .then(data => {
  //   return new Promise(resolve => {
  //     setTimeout(()=> {
  //       resolve(data);
  //     },1000)
  //   })
  // })  页面写完后延迟一秒统统去掉
  };


//获取热门推荐数据,第1页，每页20条
export const getHomeRecommend = (page = 1, psize = HOME_RECOMMEND_PAGE_SIZE) => {
  const url = 'https://ju.taobao.com/json/tg/ajaxGetItemsV2.json';
  const params = {
    //向后台请求数据的时候，定义的几个参数，具有看对应api。
    page,
    psize,
    type:0,
    frontCatId:''
  };

  return jsonp(url, params, jsonpOptions).then(res => {
    //res是设置的参数，传递的就是我们获取到的数据data,页面上打印可以看到api上的data
      if (res.code === '200') {
        return res;
      }

      throw new Error('没有成功获取到数据');
  }).catch(err => {
    if(err){
      console.log(err);
    }
  })
  //   .then(data => {
  //   return new Promise(resolve => {
  //     //模拟网速不好时获取数据的情况
  //     setTimeout(()=> {
  //       resolve(data);
  //     },1000);
  //   })
  // })
};

