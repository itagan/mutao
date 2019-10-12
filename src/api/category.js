import axios from 'axios';
import {SUCC_CODE, TIMEOUT} from './config';

//axios下面提供一个叫canceltoken的方法
const CancelToken = axios.CancelToken;
//后面会接收取消的方法，通过它来取消请求；   默认为空
let cancel;

//获取内容数据
  export const getCategoryContent = (id) => {
    //判断是否存在cancel，有的话调用它来取消当前的请求，并传出文字说明，后面catch来捕获它并输出提示，告诉你不是什么错误，只是取消了前一次的请求
    cancel && cancel('取消了前一次的请求！');
    //重置为空，如果当前的请求并没有完成，那么就把它cancel取消掉。如果完成了就什么都不做。这重置为空可以不需要
    cancel = null;

    return axios.get(`http://www.imooc.com/api/category/content/${id}`, {
      timeout:TIMEOUT,
      //每次发送请求，都会把c赋值给cancel c是函数方法，可用来取消当前的请求
      cancelToken:new CancelToken(function executor(c) {
        //赋值后cancel就变成方法可被调用来取消请求
        cancel = c;
      })
    }).then(res => {
      if(res.data.code === SUCC_CODE) {
        return res.data.content;
      }

      throw new Error('没有成功获取到数据！');
    }).catch(err => {
      if (axios.isCancel(err)) { // 取消前一次的请求
        console.log(err);
      }else {
        // handle error 处理错误
       console.log(err);
      }
    })
  }

// import axios from 'axios';
// import {SUCC_CODE, TIMEOUT} from './config';
//
// const CancelToken = axios.CancelToken;
// let cancel;
// // 获取内容数据--ajax
// export const getCategoryContent = (id) => {
//   cancel && cancel('取消了前一次的请求！');
//   cancel = null;
//   return axios.get(`http://www.imooc.com/api/category/content/${id}`, {
//     timeout: TIMEOUT,
//     cancelToken: new CancelToken(function executor(c) {
//       cancel = c;
//     })
//   }).then(res => {
//     if (res.data.code === SUCC_CODE) {
//       console.log('ok');
//       return res.data.content;
//     }
//     throw new Error('没有成功获取到数据！');
//   }).catch(err => {
//     if (axios.isCancel(err)) { // 取消前一次的请求
//       console.log(err);
//     } else {
//       // handle error
//       console.log(err);
//     }
//   });
// };
