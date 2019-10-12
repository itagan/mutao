<template>
  <div>
    <personal-header/>

    <me-scroll>
    <login-register/>
    <personal-order/>
    <personal-assets/>
    <personal-other/>
    <div class="footer">
      <p>
        客服热线400-123-8888（8：00-22：00）<br/>
        拨打前请记录您的UID：0
      </p>
    </div>
    </me-scroll>
  </div>
</template>

<script>
    import personalHeader from './header';
    import loginRegister from './loginRegister';
    import personalOrder from './order';
    import personalAssets from './assets';
    import  personalOther from './other';

    import MeScroll from 'base/scroll';
    export default {
        name: 'personal',
        components:{
          personalHeader,
          loginRegister,
          personalOrder,
          personalAssets,
          personalOther,
          MeScroll
        }
    };
</script>

<style lang="scss" scoped>
  .footer {
    font-size: 14px;
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 20px;
  }


</style>
