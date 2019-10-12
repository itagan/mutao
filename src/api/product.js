import jsonp from 'assets/js/jsonp';
import {jsonpOptions} from './config';

//获取产品数据---jsonp
export const getProduct = id => {
  console.log(id);
  const url='https://unszacs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/';
  // const params = {
  //   api:'mtop.taobao.detail.getdetail',
  //   ttid: '2017@taobao_h5_6.6.0',
  //   data: `{"itemNumId":"${id}"}`,
  //   appKey:12574478,
  //   dataType:'jsonp',
  //   type:'jsonp',
  //   v:'6.0'
  // };

  const params = {
    api:'mtop.taobao.detail.getdetail',
    ttid: '2017@taobao_h5_6.6.0',
    data: `{"itemNumId"%3A"${id}"}`,
    appKey:12574478,
    dataType:'jsonp',
    type:'jsonp',
    v:'6.0'
  };


  return jsonp(url, params, jsonpOptions).then(res => {
    // if (res.data) {
    //   return res.data;
    // }
    // console.log(res);
    res = res.data;
    console.log(res);
    if (res.apiStack && res.item) {
      const apiStack = JSON.parse(res.apiStack[0].value);
    console.log(apiStack);
    //整理api接口
    let data = {};
    data.content = {};
    data.content.sliders = res.item.images; //幻灯片数据
    data.content.priceText = apiStack.price.price.priceText;//价格
    data.content.soldCount = apiStack.vertical.jhs.soldCount;//库存
    data.content.title = apiStack.item.title;// 标题
    data.content.postage = apiStack.delivery.postage; //邮费
    data.content.sellCount = apiStack.item.sellCount; //销量
    data.content.from = apiStack.delivery.from;//发货地
    data.content.vagueSellCount = apiStack.item.vagueSellCount;

    if (res.rate) {
      data.content.review = {};
      data.content.review.totalCount = res.rate.totalCount;
      data.content.review.keywords = res.rate.keywords || [];
      data.content.review.rateList = res.rate.rateList || [];
    }
    if (res.seller) {
      data.content.seller = {};
      data.content.seller.shopIcon = res.seller.shopIcon;
      data.content.seller.shopName = res.seller.shopName;
      data.content.seller.creditLevelIcon = res.seller.creditLevelIcon;
      data.content.seller.evaluates = res.seller.evaluates;
    }

    if (res.resource) {
      data.content.resource = {};
      data.content.resource.askAll = res.resource.entrances.askAll;
    }

    if (res.skuBase) {
      data.content.skuBase = {};
      data.content.skuBase.props = res.skuBase.props;
        data.content.skuBase.skus = res.skuBase.skus;
    }

      console.log(data);
      //返回调用
      return data;

  }
    throw new Error('没有成功获取到数据！');
  }).catch(err => {
    if(err) {
      // 有错误打印出来不处理
      console.log(err);
      console.log('11');
    }
  }).then(res => {
    // 延时一秒
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(res);
      },1000);
    });
  });
};
