//jsonp 封装
import jsonp  from 'jsonp';

// 1、在es6中，单一参数的圆括号是可选的。
// 2、一般来讲，语法结构如下：const 函数名 = 传入的参数 => 函数返回的内容
//这个方法不需要暴露出去，本页面调用即可
const parseParam = param => {
  let params = [];
  for(const key in param) {
    params.push([key, param[key]]);
    //上面的效果 [[page,1],[psize,20]]
  }
  //join() 方法用于把数组中的所有元素放入一个字符串。去掉了[ ]结构
  //map方法对原数组按后面的方法调用处理，返回新数组，里面值是处理后的值
  return params.map(value => value.join('=')).join('&');
};

//提供给外界的接口，暴露出一个方法:地址，数据，参数
export default (url, data, options) => {
  //拼接url；有？号就加连字符&即可，没有就先加？ ； data需要进行转义，定义方法操作
  url+= (url.indexOf('?') < 0 ? '?':'&') + parseParam(data);
    //需要用的是promise对象，所以这里进行包装后返回；
    return new Promise((resolve, reject)=> {
      //下边的url是拼接后的，原url拼接data后的；options是参数，（err,data）是回调），注意这个url是传进来的url拼接data的
      jsonp(url, options, (err, data) => {
        if (err){
          //如果有错误的话就把错误带出去
          reject(err);
        } else {
          //没有错误就是成功了，那就把数据带出去
          resolve(data);
        }
      })
    })
};

// [[page, 1], [pszie, 20]]
// [page=1, psize=20]
// page=1&psize=20
