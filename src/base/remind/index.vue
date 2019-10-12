<template>
  <transition name="fade-remind">

    <div class="remind" v-show="visible">
      <div class="remind-wrapper">
        <div class="remind-icon" v-show="remindIcon">
          <i :class="icons"></i>
        </div>
        <span class="remind-text">
          {{remind}}
    </span>
      </div>
    </div>

  </transition>
</template>

<script>
  export default {
    name: 'MeRemind',
    data() {
      return {
        visible:false,
        remindIcon:true
      }
    },
    props:{
      remind:{
        type:String,
        default:' '
      },
      icons:{
        type: String,
        default: ''
      }

    },

    methods: {
      show() {
        this.visible = true;
        setTimeout(()=>{
          this.visible = false;
        },1000);
      },
      // hide() {
      //   this.visible = false;
      // }
      //图标不显示
      RemindIcon() {
        this.remindIcon = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .remind {
    z-index: $skubase-z-index + 100;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    @include flex-center();
    &-wrapper {
      background-color: rgb(59,59,59);
      opacity: 0.8;
      border-radius: 20px;
      /*height: 80px;*/
      /*width: 150px;*/
      /*line-height: 80px;*/
      text-align: center;
      color: #ffffff;
      font-size: 16px;
      padding:10px;

      div:nth-child(1) {
        width: 30px;
        height: 30px;
        @include flex-center(column);
        margin:10px auto;

        & i {
          width: 100%;
          height: 100%;
          line-height: 30px;
          font-size:$icon-font-size;
          color:rgb(251,97,9);
        }
      }
    }

  }



  .fade-remind-enter {
    opacity: 0;
  }
  .fade-remind-enter-active {
    transition: opacity 0.3s;
  }
  .fade-remind-leave {
    opacity: 1;

  }
  .fade-remind-leave-to {
    opacity: 0;
    /*transition: all .8s;*/
  }

  .fade-remind-leave-active {
    animation: bounce-in .8s;
    /*transition: all .8s;*/

    transition: all 1s;

  }

  @keyframes bounce-in {
    0% {
      transform: scale(1);
    }
    50%{
      transform: scale(0.8);
    }
    100% {
      transform: scale(0);
    }
  }

</style>
