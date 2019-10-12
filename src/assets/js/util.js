//函数节流
export const debounce = (func, delay = 200) => {
  let timer = null;

  return function (...args) {
    //清除上一次设置的定时器
      timer && clearTimeout(timer);
      //延时两百毫秒再来执行apply方法；
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
  };
};
//实现：当短时间内多次触发事件。由于上一次延时还没有执行，那么新的一次上来清除上次的定时器，接着等待延时执行
//当多次触发事件时，连续短时间内触发的不会被执行


// // 函数节流
// export const debounce = (func, delay = 200) => {
//   let timer = null;
//
//   return function (...args) {
//     //清除上一次设置的定时器
//     timer && clearTimeout(timer);
//     //延时两百毫秒再来执行apply方法；
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, delay);
//   };
// };
