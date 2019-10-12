import storage from 'assets/js/storage';
import {SEARCH_HISTORY_KEYWORD_KEY} from 'pages/search/config';

export const searchMixin = {
  methods: {
    $_selectItem(keyword) {
      //没有获取到这个key就返回一个空的数组
      let keywords = storage.get(SEARCH_HISTORY_KEYWORD_KEY, []);
      //长度不为0，说明获取到了，有两种情况，里面获取的没有你当前历史搜索保存的值的话，那就扔到第一个去；如有的话，那就把之前在历史搜索的删除，把最新搜索的放在开头
      //这里换一个思路，不管你点击的项在历史搜索有没有，查询历史搜索一下，有的话删除没有的删除不到，并把新搜索的放在开头
      //splice常用于数组删除，但是效率不高；这里用filter过滤器
      if (keywords.length !== 0) {
        //对在缓存中的数据遍历，如果传输进来的值不在里面，那么就保留，组成新数组
        keywords = keywords.filter(val => val !== keyword);
      }
      //给新数组开头添加这个不在缓存中的数据,keyword是传进来的值，被缓存中剔除，然后添加到新数组中，这样实现被点击的就在历史搜索的开头
      keywords.unshift(keyword);
      //给缓存添加这部分数据
      storage.set(SEARCH_HISTORY_KEYWORD_KEY, keywords);
      //跳转到淘宝搜索页面
      location.href = `https://s.m.taobao.com/h5?event_submit_do_new_search_auction=1&_input_charset=utf-8&topSearch=1&atype=b&searchfrom=1&action=home%3Aredirect_app_action&from=1&sst=1&n=20&buying=buyitnow&q=${keyword}`;
    }
  }
};

