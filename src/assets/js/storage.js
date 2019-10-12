//定义常量，把window的localStorage API赋值给常量后面调用
const storage = window.localStorage;

//暴露出定义的api给外界使用
export default {
  //缓存内容
  set(key, val) {
    //如果只写了key，而没有传具体的值，就直接返回，不让它写入了。
    if (val === undefined) {
      return;
    }
    //有值的时候，通过下边定义的系列化方法转化它的值，把它变成字符串，然后缓存下来
    storage.setItem(key, serialize(val));
  },
  //获取已缓存内容，从字符串转化为json对象这样才能被使用
  get(key, def) {
    const val = deserialize(storage.getItem(key));
    //val的值就是undefined，使用的时候就会报错。
    // 所以下面有一个三元运算符，如果val的值是undefined，将def赋值给val，可以理解是空对象{}。
    return val === undefined ? def : val;
  },
  //根据键清除对应所有内容
  remove(key) {
    storage.removeItem(key);
  },
  //清除所有内容，只能清理当前自己缓存的
  clear() {
    storage.clear();
  }
};

//系列化方法：用JSON.stringify()方法将json对象转换成字符串形式
function serialize(val) {
  return JSON.stringify(val);
}
//反系列化：JSON.parse() 方法将数据转换为 JavaScript 对象
function deserialize(val) {
  if (typeof val !== 'string') {
    return undefined;
  }
  try {
    //处理非标准json格式，不能被转化情况
    return JSON.parse(val);
  } catch (e) {
    return val || undefined;
  }
}

