export function computedCarts( getAllCarts) {

  // this.getAllCarts = storage.get(SKUBASE_CART_KEY_KEYWORD_KEY, []);
  //计算结算金额，换个思路，每次点击都遍历所有被选中的，从而得出结算总额
  let arr = [];
  for(let i=0;i < getAllCarts.length;i++){
    // 对店铺过滤，取出被选中的项目作为新数组
    let aa = getAllCarts[i].filter((item) => {
      return item.checked === true;
    });
    arr.push(aa);
  }

  //获取到各个店铺里各个被选中的宝贝，三维数组
  let newArr = arr.filter(newArr => {
    return newArr.length !== 0;
  });

  let cc = [];

  //闭包：
  function counts() {
    // let cc = [];
    for(let i=0; i<newArr.length;i++) {
      for(let j = 0; j < newArr[i].length;j++){
        cc.push(newArr[i][j][3]*newArr[i][j][6]);
      };
    };
    //计算总结算金额sum
    let sum = 0;
    for(let k=0;k<cc.length;k++){
      sum += cc[k];
    }
    //返回带金额和数量的数组，给外部调用获取值
    return [sum,cc.length];
  }
  //先返回函数里的函数
  return counts;
}
