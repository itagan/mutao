<template>
    <div class="loginRegister">
      <div class="personIcon">
        <img src="./img/personal.png" alt="">
      </div>
      <div class="personLr">
        <span class="personRegister">注册</span>
        <span class="line"></span>
        <span class="personLogin">登录</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'loginRegister'
    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
    .loginRegister {
      width: 100%;
      height: 100px;
      background-color: $header-bgc-translucent;

      & .personIcon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #ffffff;
        margin: 0 auto;

        & img {
          margin: auto;
          padding-top: 5px;
          width: 40px;
          height: 40px;
          display: block;
          border-radius: 50%;
        }
      }

      & .personLr {
        text-align: center;
        margin:0 auto;
        height: 50px;
        width: 100%;
        display: flex;
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        justify-content: center;
        vertical-align: middle;


         .personRegister {
           width: 150px;
           height: 100%;
           display: inline-block;
           line-height: 50px;
        }
        .line {
          width: 1px;
          height: 20px;
          display: block;
          background-color: #ffffff;
          margin-top: 15px;
        }
        .personLogin {
          width: 150px;
          height: 100%;
          display: inline-block;
          line-height: 50px;
        }

      }




    }
</style>
