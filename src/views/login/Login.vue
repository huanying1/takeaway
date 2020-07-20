<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
            <a href="javascript:" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="{on: loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!rightPhone" class="get_verification" :class="{right_phone:rightPhone}" @click.prevent="getCode">
                 {{computeTime>0 ? `已发送(${computeTime})`: '获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on: !loginWay}">
              <section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                  <div class="switch_button" :class="showPwd? 'on' : 'off' "  @click="showPwd = !showPwd">
                    <div class="switch_circle" :class="{right:showPwd}"></div>
                    <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
<!--                  <img ref="captcha" class="get_verification" :src="" alt="captcha" @click="getCaptcha">-->
                  <div ref="captcha" class="get_verification" @click="getCaptcha"></div>
                </section>
              </section>
            </div>
            <button class="login_submit" @click.prevent="login">登录</button>
          </form>
          <a href="javascript:" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <AlertTip :alert-text="alertText"  v-show="showAt" @closeTip="closeTip"/>
    </section>
</template>

<script>
  import AlertTip from "../../components/alerttip/AlertTip"
  import {reqCaptCha, reqPwdLogin, reqSendCode, reqSmsLogin} from "../../api"
  import {mapState} from 'vuex'
  export default {
    name:'Login',
    components: {
      AlertTip
    },
    data() {
      return {
        loginWay:true, //true为短信登陆，false为密码登录
        phone: '', //手机号
        pwd: '123', //密码
        computeTime: 0, //获取验证码计时
        code: '',//短信验证码
        showPwd: false, //true为明文，false为密文
        name: 'abc', //用户名
        captcha: '', //图形验证码
        alertText: '', //提示文本
        showAt: false,
        captchaList: ''
      }
    },
    computed: {
      rightPhone() {
        return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(this.phone)
      },
      ...mapState(['userInfo'])
    },
    mounted() {
      this.getCaptcha()
    },
    methods: {
      //获取图形验证码
      getCaptcha() {
        this.$nextTick(async () => {
          this.$refs.captcha.innerHTML = await reqCaptCha()
        })
      },
      //获取验证码倒计时
      async getCode() {
        //启动倒计时
        if (!this.computeTime) {
          this.computeTime = 30
          this.intervalId = setInterval(() => {
            this.computeTime --
            if (this.computeTime<=0) {
              clearInterval(this.intervalId)
            }
          },1000)
          //发送ajax请求(向指定手机号发送验证码短信)
          let res = await reqSendCode(this.phone)
          if (res.code === 1) {
            //显示提示
            this.showAlert(res.msg)
            //停止倒计时
            if (this.computeTime) {
              this.computeTime = 0
              clearInterval(this.intervalId)
            }
          }
        }
      },
      //弹出提示框
      showAlert(alertText) {
        this.showAt = true
        this.alertText = alertText
      },
      //登录验证
      async login() {
        const {rightPhone,showAlert,captcha,pwd,phone,code,name} = this
        if (this.loginWay) {//短信登陆
          if (!rightPhone) {
            showAlert('手机号不正确')
            return
          }else if (!/^\d{6}$/.test(code)) {
            //验证码必须是6位数字
            showAlert('验证码必须是6位数字')
            return
          }
          //发送ajax请求短信登陆
          let {data} = await reqSmsLogin(phone,code)
          if (data.code === 0) {
            let user = data.data
            await this.$store.dispatch('recordUser', user)
            //将user保存到vuex的state中
            await this.$router.replace('/profile')
          }else {
            this.getCaptcha()
            this.showAlert('验证码不正确')
          }
        } else {//密码登录
          if (!name) {  //以下都是必填项
            showAlert('必须指定用户名')
            return
          }else if (!pwd) {
            showAlert('必须指定密码')
            return
          }else if (!captcha) {
            showAlert('必须指定验证码')
            return
          }
          //发送ajax请求密码登陆
          let {config,data} = await reqPwdLogin({name,pwd,captcha})
          //根据结果数据处理
          if (data.code === 0) {
            let user = Object.assign(JSON.parse(config.data),data.data)
            await this.$store.dispatch('recordUser', user)
            //将user保存到vuex的state中
            await this.$router.replace('/profile')
          }else {
            this.getCaptcha()
            this.showAlert(data.msg)
          }
        }
        //停止倒计时
        if (this.computeTime) {
          this.computeTime = 0
          clearInterval(this.intervalId)
        }


      },
      //关闭提示框
      closeTip() {
        this.showAt = false
        this.alertText = ''
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              touch-action none
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>