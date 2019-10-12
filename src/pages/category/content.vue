<template>
  <!-- <div>
    content
  </div> -->
  <div class="content-wrapper">
    <div class="loading-container" v-if="isLoading">
      <!-- <me-loading/> -->
      <div class="loading-wrapper">
        <me-loading/>
      </div>
    </div>
    <me-scroll

      ref="scroll"
      @scroll-end="scrollEnd"
    >
      <div class="content">
        <div class="pic" v-if="content.banner">
          <a :href="content.banner.linkUrl" class="pic-link">
            <img @load="updateScroll" :src="content.banner.picUrl" alt="" class="pic-img">
          </a>
        </div>
        <div
          class="section"
          v-for="(section, index) in content.data"
          :key="index"
        >
<!--          注意两个循环，不能重名，看api数据结构-->
          <h4 class="section-title">{{section.name}}</h4>
          <ul class="section-list">
            <li
              class="section-item"
              v-for="(item, i) in section.itemList"
              :key="i"
            >
              <a href="" class="section-link">
                <p class="section-pic" v-if="item.picUrl">
<!--                  懒加载图片。前面写过全局可用。注意不是v-lazyload-->
                  <img v-lazy="item.picUrl" alt="" class="section-img" />
                </p>
                <p class="section-name">{{item.name}}</p>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="g-backtop-container">
        <me-backtop :visible="isBacktopVisible" @backtop = "backToTop"/>
      </div>
    </me-scroll>
  </div>
</template>

<script>
  import MeLoading from 'base/loading';
  import MeScroll from 'base/scroll';
  import MeBacktop from 'base/backtop';
  import {getCategoryContent} from 'api/category';
  import storage from 'assets/js/storage';
  import {CATEGORY_CONTENT_KEY, CATEGORY_CONTENT_UPDATE_TIME_INTERVAL} from './config';
  export default {
    name: 'CategoryContent',
    components: {
      MeLoading,
      MeScroll,
      MeBacktop
    },
    props: {
      curId: {
        type: String,
        default: ''
      }
    },
      data() {
        return {
          content:{},
          isBacktopVisible:false,
          isLoading:false
        }
      },
      watch: {
        curId:
        function curId(id) {
          this.isLoading = true;
          //then前，需要是Promise对象，所以getContent  需要前面用return
          this.getContent(id).then(() => {
            //成功后把加载条遮罩层取消，显示页面
            this.isLoading = false;
            //每次tab切换的时候实现滚动条都是在顶部
            // this.backToTop();
            //进一步优化，点击tab实现瞬间返回顶部
            this.backToTop(0);
          });
        }
      },
      methods: {
        getContent: function(id) {
          let contents = storage.get(CATEGORY_CONTENT_KEY); //通过键获取一下内容，看看有没有；
          let updateTime; //上一次更新的时间
          let curTime = new Date().getTime();//定义一下当前的时间是多少，获取它的时间戳

          if(contents && contents[id]) {
            updateTime = contents[id].updateTime || 0;
            if(curTime - updateTime <= CATEGORY_CONTENT_UPDATE_TIME_INTERVAL) {
              //说明还在缓存期内容，可以调用缓存的内容
              // 我们希望getContent能够返回Promise对象，方便后面then链式调用，所以这里前面加return
              return this.getContentsByLocalStorage(contents[id]);
            }else {
              //已经缓存过但是已经过期，那么需要再从服务器里获取对应id的数据，并且更新这个id的缓存内容
              return this.getContentsByHTTP(id).then(() => {
                this.updateLocalStorage(contents, id, curTime);
              });
            }
          } else {
            //没有缓存过，那么locaStorage里将找不到这id内容：contents[id] ，那么直接从服务器中获取，并且更新缓存到浏览器里
            return this.getContentsByHTTP(id).then(() => {
              this.updateLocalStorage(contents, id, curTime);
            });
          }
        },
        //获取缓存内容
        getContentsByLocalStorage(content) {
          this.content = content.data;
          //getContent希望能够返回Promise对象，所以这里返回promise对象，成功的状态，表示已经成功的获取到了数据
          return Promise.resolve();
        },

        //从服务器获取数据
        getContentsByHTTP(id) {
          return getCategoryContent(id).then(data => {
            //用Promise包一层，成功获取后即resolve 调用then里的更新方法；避免没有获取到数据也去执行更新方法；没有获取到就不会走then里的更新方法
            return new Promise(resolve => {
              if(data) {
                this.content = data;
                resolve();
              }
            })
          });
        },
        updateLocalStorage(contents, id, curTime) {
          //判断有没有值，没有值就传一个空对象
          contents = contents || {};
          //找到这个id对应内容，即使原来有值，更新后也重置为空，方便后面设置新内容
          contents[id] = {};
          contents[id].data = this.content;
          contents[id].updateTime = curTime;
          //用新设置的contents内容覆盖原来的，实现更新
          storage.set(CATEGORY_CONTENT_KEY, contents);
        },

        //返回顶部
        backToTop() {
          this.$refs.scroll && this.$refs.scroll.scrollToTop();
        },
        //解决滚动条问题，更新~  img @load="updateScroll"
        // @load可以理解成onload事件，它在image src有值的时候，才开始加载onload事件，在src的资源加载完毕的时候才会触发
        updateScroll() {
          this.$refs.scroll && this.$refs.scroll.update();
        },

        // scrollEnd(translate, scroll) {
        //   this.isBacktopVisible = translate < 0 && -translate > scroll.height;
        // }
        //用于显示返回顶部按钮
        scrollEnd(translate, scroll, pulling) {

          this.isBacktopVisible = translate < 0 && -translate > scroll.height;
        },


      }
    }
</script>

<style lang="scss" scoped>

  @import "~assets/scss/mixins";

  .content-wrapper {
    position: relative;
    height: 100%;
  }

  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: $category-popup-z-index;
    @include flex-center();
    width: 100%;
    height: 100%;
    /*background-color: $modal-bgc;*/

    .mine-loading {
      color: #fff;
      font-size: 14px;
    }
  }
  .loading-wrapper {
    width: 50%;
    padding: 30px 0;
    background-color: $modal-bgc;
    border-radius: 4px;
  }

  .content {
    padding: 10px;
  }

  .pic {
    margin-bottom: 12px;

    &-link {
      display: block;
    }

    &-img {
      width: 100%;
    }
  }

  .section {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    &-title {
      height: 28px;
      line-height: 28px;
      color: #080808;
      font-weight: bold;
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      padding: 10px 10px 0;
    }

    &-item {
      width: (100% / 3);
    }

    &-link {
      display: block;
    }

    &-pic {
      position: relative;
      width: 80%;
      padding-bottom: 80%;
      margin: 0 auto;
    }

    &-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &-name {
      height: 36px;
      line-height: 36px;
      text-align: center;
      @include ellipsis();
    }
  }
  .g-backtop-container {
    bottom: 10px;
  }
</style>
