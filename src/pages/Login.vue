<!-- 登录注册 -->
<template>
    <div>
        <div class="container">
            <h1 class="loginTitle">    

            </h1>
            <!-- 登录注册 -->
            <div v-show="true" class="">
                <div v-if="login==1" class="loginBox">
                    <div class="lr-title">
                        <h1>登录</h1>
                        <p>
                            新用户<a @click="goRegister()" class="tcolors">注册</a>
                        </p>
                    </div>

                    <el-alert
                        v-show="loginErr"
                        :title="loginTitle"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                        type="text"
                        placeholder="用户名"
                        v-model="username">
                    </el-input>

                    <el-input
                            type="password"
                            placeholder="密码"
                            @keyup.enter="gotoHome()"
                            v-model="password">
                    </el-input>

                    <h3><a href="">忘记密码？</a></h3>
                    <div class="lr-btn tcolors-bg" @click="gotoHome()">登录</div>
                    <div class="otherLogin" >
                        <a href="javascript:void(0)"><i class="fa fa-fw fa-wechat"></i></a>
                        <a href="javascript:void(0)"><i class="fa fa-fw fa-qq"></i></a>
                        <a href="javascript:void(0)"><i class="fa fa-fw fa-weibo"></i></a>
                    </div>
                </div>
                <div v-else class="registerBox">
                    <div class="lr-title">
                        <h1>注册</h1>
                        <p>
                            已有账号<a @click="goLogin()" class="tcolors">登录</a>
                        </p>
                    </div>
                    <el-alert
                        v-show="registerErr"
                        :title="registerTitle"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                        type="text"
                        placeholder="用户名"
                        v-model="nusername">
                    </el-input>
                    <el-alert
                        v-show="nusernameErr"
                        title="用户名错误"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                        type="text"
                        placeholder="昵称"
                        v-model="nnickname">
                    </el-input>
                    <el-alert
                        v-show="nnicknameErr"
                        title="昵称错误"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                        type="email"
                        placeholder="邮箱"
                        v-model="nemail">
                    </el-input>
                    <el-alert
                        v-show="nemailErr"
                        title="邮箱错误"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                          type="password"
                          placeholder="密码:6-12位英文、数字、下划线"
                          v-model="npassword">
                    </el-input>
                    <el-alert
                        v-show="npasswordErr"
                        title="密码错误"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                            type="password"
                          placeholder="确认密码"
                           @keyup.enter="newRegister()"
                          v-model="npassword2">
                    </el-input>
                    <el-alert
                        v-show="npassword2Err"
                        title="重复密码有误"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <div class="lr-btn tcolors-bg" @click="newRegister()" v-loading.fullscreen.lock="fullscreenLoading"  element-loading-text="提交中">注册</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Login">
import {onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useUserDataStore} from '@/store/index'
import {userLogin,userRegister} from '../api/user.js'

const userDataStore = useUserDataStore()
const router = useRouter()
const route = useRoute()
const username= ref('')//用户名
const password= ref('')//密码
const nusername= ref('')//新用户注册名
const nnickname= ref('')//新用户昵称
const nemail= ref('')//新用户注册邮箱
const npassword= ref('')//新用户注册密码
const npassword2= ref('')//新用户注册重复密码
const login= ref(0)//是否已经登录
const loginErr= ref(false)//登录错误
const loginTitle=ref('用户名或密码错误')
const nusernameErr=ref(false)//新用户注册用户名错误
const nnicknameErr= ref(false)//新用户昵称错误
const nemailErr= ref(false)//新用户注册邮箱错误
const npasswordErr= ref(false)//新用户注册密码错误
const npassword2Err= ref(false)//新用户注册重复密码错误
const registerErr= ref(false)//已注册错误
const registerTitle= ref('该邮箱已注册')
const fullscreenLoading= ref(false)//全屏loading
const urlstate=ref(0)//重新注册

function routeChange(){
    login.value = route.query.login==undefined?1:parseInt(route.query.login as string);//获取传参的login
    urlstate.value = route.query.urlstate==undefined?0:parseInt(route.query.urlstate as string);//获取传参的usrlstate状态码
}
async function gotoHome(){//用户登录
    const response = await userLogin(username.value,password.value)
    // 登录成功记录token和用户信息，登录失败给对应提示
    userDataStore.setUserToken(response.token)
    // 存储用户信息
    localStorage.setItem("userInfo",JSON.stringify(response.userInfo))
    if(localStorage.getItem('logUrl')){
        router.push({path:localStorage.getItem('logUrl')});
    }else{
        router.push({path:'/'});
    }
}
async function newRegister(){//注册提交
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
    const preg = /^(\w){6,12}$/;
    if(nusername.value){
        nusernameErr.value = false;
    }else{
        nusernameErr.value = true;
    }
    if(nnickname.value){
        nnicknameErr.value = false;
    }else{
        nnicknameErr.value = true;
    }
    if(reg.test(nemail.value)){
        nemailErr.value = false;
    }else{
        nemailErr.value = true;
    }
    if(npassword.value&&preg.test(npassword.value)){
        npasswordErr.value = false;
        if(npassword.value==npassword2.value){
            npassword2Err.value = false;
        }else{
            npassword2Err.value = true;
        }
    }else{
        npasswordErr.value = true;
    }
    if(!nusernameErr.value&&!nnicknameErr.value&&!nemailErr.value&&!npasswordErr.value){

        fullscreenLoading.value = true;
        try{
            await userRegister(nusername.value,nnickname.value,nemail.value,npassword.value)
            //注册成功后调整到登录
            goLogin()
        }
        catch{
            fullscreenLoading.value = false;
        }
    }
}
function goLogin(){//去登陆
    router.push({query:{login:1}});
}
function goRegister(){//去注册
    router.push({query:{login:0}});
}

watch(route,()=>{
    routeChange()
},{
    deep:true
})

onMounted(()=>{
    routeChange()
})

</script>

<style>
/*登录注册标题*/
.loginTitle{
    text-align: center;
    font-size: 26px;
    padding-top:50px;
    margin-bottom: 20px;
}
.loginBox ,.registerBox{
    background: #fff;
    padding:40px;
    max-width:320px;
    margin:0 auto;
}
.loginBox{
    padding-bottom:0;
}
.lr-title{
    position: relative;
    height:32px;
    line-height: 32px;
    margin-bottom: 20px;
}
.lr-title h1{
    font-size: 24px;
    color:#666;
    font-weight: bold;
    /*width:50%;*/
}
.lr-title p{
    font-size: 12px;
    color:#999;
    position: absolute;
    right:0;
    top:0;
}
.lr-btn{
    color:#fff;
    text-align: center;
    letter-spacing: 5px;
    padding:8px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 30px;
}
.loginBox .el-input,.registerBox .el-input{
    margin-bottom: 20px;
}
.loginBox .el-alert ,.registerBox .el-alert{
    top:-18px;
    background-color: #888;
}
.loginBox .el-input input,.registerBox .el-input input{
    border-radius: 4px;
}
.loginBox h3,.registerBox h3{
    text-align: right;
    margin-bottom: 20px;
}
.loginBox h3 a,.registerBox h3 a{
    font-size: 13px;
    color:#999;
}
.loginBox .otherLogin{
    max-width:320px;
    padding:30px 40px;
    background: #ddd;
    text-align: center;
    margin-left:-40px;
    margin-right: -40px;
    visibility: hidden;
}
.loginBox .otherLogin p{
    margin-bottom:20px;
    font-size: 16px;
}
.loginBox .otherLogin a i{
    display: inline-block;
    width: 42px;
    height: 42px;
    line-height: 42px;
    font-size: 18px;
    border-radius: 50%;
    color:#fff;
    margin: 0 10px;
}
.loginBox .otherLogin a i.fa-wechat{
    background: #7bc549;
}
.loginBox .otherLogin a i.fa-qq{
    background: #56b6e7;
}
.loginBox .otherLogin a i.fa-weibo{
    background: #ff763b;
}

/*登录成功*/
.registerSuc{
    padding: 40px;
    margin: 0 auto;
}
.registerSuc .sucIcon{
    text-align: center;
    margin-bottom: 30px;
    padding-left:60px;
}
.registerSuc .sucContent{
    line-height: 1.5;
    font-size: 15px;
    text-align: center;
}
.registerSuc .sucContent p{
    margin-top: 10px;
    font-size: 13px;
    color: #999;
}
.registerSuc .sucContent .lastbtn{
    display: inline-block;
    font-size: 14px;
    padding: 3px 10px;
    border-radius: 5px;
    color:#fff;
    cursor: pointer;
}
.registerSuc .sucContent  .el-icon-close{
    font-size: 13px;
}
</style>
