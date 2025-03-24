<!-- 头部公用 -->
<template>
<div class="">
	<div class="headBack">
		<el-row class="container">
			<el-col :span="24">
				<!-- pc端导航 -->
				<div class="headBox">
					<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true">
						<!-- 首页菜单 -->
						<el-menu-item index="/Home"><i class="fa fa-wa fa-home"></i> 首页</el-menu-item>
						<el-sub-menu index="/Share">
							<template #title>
								<i class="fa fa-wa fa-archive"></i>分类
							</template>
							<el-menu-item v-for="(item,index) in classListObj" :key="item.id" :index="'/Share?classId='+item.id">{{item.name}}</el-menu-item>
						</el-sub-menu>
						<el-menu-item index="/Reward"><i class="fa fa-wa fa-cny"></i> 赞赏</el-menu-item>
						<el-menu-item index="/Friendslink"><i class="fa fa-wa fa-users"></i>友链</el-menu-item>
						<!-- 用户登录 -->
						<div class="userInfo">
							<div v-show="!userDataStore.haslogin" class="nologin">
								<a href="javascript:void(0);" @click="logoinFun(1)">登录&nbsp;</a>|<a href="javascript:void(0);" @click="logoinFun(0)">&nbsp;注册</a>
							</div>
							<div v-show="userDataStore.haslogin" class="haslogin">
								<i class="fa fa-fw fa-user-circle userImg"></i>
								<ul class="haslogin-info">
									<li>
										<a href="javascript:void(0);"><el-menu-item index="/Userinfo">个人中心</el-menu-item></a>
									</li>
									<li>
										<a href="javascript:void(0);" @click="userlogout()"><el-menu-item index="/Home">退出登录</el-menu-item></a>
									</li>
								</ul>
							</div>
						</div>
					</el-menu>
				</div>
			</el-col>
		</el-row>
	</div>
	<!-- 首页大屏头像Logo -->
	<div class="headImgBox" :style="{backgroundImage:
		userDataStore.themeObj.top_image
		?'url('+userDataStore.themeObj.top_image+')'
		:'url('+headerBg+')'
		}">
		<div class="scene">
			<div><span id="Luke"></span></div>
		</div>
		<div class="h-information">
                <img :src="userDataStore.themeObj.head_portrait
				?userDataStore.themeObj.head_portrait
				:headerUser
				" 
				alt="">
			<h2 class="h-description">
                {{userDataStore.themeObj.autograph
				?userDataStore.themeObj.autograph
				:"让真实的声音回响！"}}
            </h2>
		</div>
	</div>
</div>
</template>

<script setup lang="ts" name="headerMenu">
import { ref ,onMounted, watch} from 'vue'
import { useRouter ,useRoute} from 'vue-router'
import { ElMessageBox ,ElMessage} from 'element-plus'
import TheaterJS from 'theaterjs'
import {logout} from '@/api/user'
import {getCategoryList} from '@/api/category'
import {useUserDataStore} from '@/store/index'
import headerBg from '@/assets/img/headerBg.png'
import headerUser from '@/assets/img/headerUser.png'

const userDataStore = useUserDataStore()
const router = useRouter()
const route = useRoute()

let userInfo = ''           //用户信息

const classListObj= ref('') //Blog分类
const activeIndex= ref('/') //当前选择的路由模块
const pMenu= ref(true)      //手机端菜单打开
const input=ref('')         //input输入内容

//搜索栏
function searchChangeFun(){
	if (input.value == '') {
		userDataStore.keywords = '';
		router.push({path:'/'});
	}
}
//用户登录和注册跳转
function logoinFun(msg) {
	localStorage.setItem('logUrl',route.fullPath);
	if (msg == 0) {
		router.push({
			path: '/Login',
			query:{
				login:0
			}
		});
	} else {
		router.push({
			path: '/Login',
			query:{
				login:1
			}
		});
	}
}
// 用户退出登录
function userlogout() {
	ElMessageBox.confirm('是否确认退出?', '退出提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(async () => {
		await logout()
		userDataStore.removeUserToken()
		localStorage.removeItem('userInfo');
		console.log(userDataStore.haslogin)
		userDataStore.setUserHasLogin(false);
		console.log(userDataStore.haslogin)
		window.location.reload();
		ElMessage({
			type: 'success',
			message: '退出成功!'
		});
		if (route.path == '/UserInfo') {
			router.push({
				path: '/'
			});
		}
	})
}
//路由参数改变
function routeChange() {
	pMenu.value = true
	activeIndex.value =route.path == '/' ? '/Home' : route.path;
	if (localStorage.getItem('userInfo')) {
		userDataStore.setUserHasLogin(true);
		userInfo = JSON.parse(localStorage.getItem('userInfo'));
	} else {
		userDataStore.setUserHasLogin(false);
	}

	getCategoryList()

	if ((route.name == "Share" || route.name == "Home") && userDataStore.keywords) {
		input.value = userDataStore.keywords;
	} else {
		input.value = '';
		userDataStore.keywords = '';
	}
}
function Typeit(){
	const theater = new TheaterJS();
 	theater
  		.on("type:start, erase:start", function () {
	 // 添加一些视觉效果
    })
  		.on("type:end, erase:end", function () {
	 // 添加一些视觉效果
    });
 	theater
   		.addActor("Luke")
   		.addScene("Luke:Welcome to Sprve!",10)
   		//.addScene(theater.replay.bind(theater));
}

watch(route,()=>{
	routeChange()
})

onMounted(async ()=>{
	classListObj.value = await getCategoryList();
})
onMounted(()=>{
	const timer = setTimeout(() =>{
		Typeit(); //打字机效果
		clearTimeout(timer);
	}, 500);
})
onMounted(()=>{
	//生命周期函数
	//判断当前页面是否被隐藏
	const hiddenProperty = 'hidden' in document ? 'hidden' :
		'webkitHidden' in document ? 'webkitHidden' :
		'mozHidden' in document ? 'mozHidden' :
		null;
	const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
	const onVisibilityChange = function() {
		if (!document[hiddenProperty]) { //被隐藏
			if (route.path != '/DetailShare') {
				if (localStorage.getItem('userInfo')) {
					userDataStore.setUserHasLogin(true);
				} else {
					userDataStore.setUserHasLogin(false);
				}
			}
		}
	}
	document.addEventListener(visibilityChangeEvent, onVisibilityChange);
	routeChange();
})
</script>

<style>
/*********头部导航栏********/

/*头部导航栏盒子*/

.headBack {
	height: 40px;
	width: 100%;
	background: rgba(40, 42, 44, 0.6);
	/*margin-bottom:30px;*/
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 100;
}

.headBox li.is-active {
	/*background: #48456C;*/
	background: rgba(73, 69, 107, 0.7);
}

.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title {
	border-bottom: none!important;
}

.headBox .el-menu {
	background: transparent;
	border-bottom: none!important;
}

.headBox .el-menu-demo li.el-menu-item,
.headBox .el-menu--horizontal .el-sub-menu .el-sub-menu__title {
	height: 38px;
	line-height: 38px;
	border-bottom: none!important;

}

.headBox .el-sub-menu li.el-menu-item {
	height: 38px;
	line-height: 38px;
}

.headBox li .fa-wa {
	vertical-align: baseline;
}

.headBox ul li.el-menu-item,
.headBox ul li.el-menu-item.is-active,
.headBox ul li.el-menu-item:hover,
.headBox .el-sub-menu div.el-sub-menu__title,
.headBox .el-sub-menu__title i.el-sub-menu__icon-arrow {
	color: #fff;
}

.headBox .el-menu--horizontal .el-sub-menu>.el-menu {
	top: 38px;
	border: none;
	padding: 0;
}

.headBox>ul li.el-menu-item:hover,
.headBox>ul li.el-sub-menu:hover .el-sub-menu__title {
	background: #48456C;
	border-bottom: none;
}

.headBox>ul .el-sub-menu .el-menu,
.headBox>ul .el-sub-menu .el-menu .el-menu-item {
	background: #48456C;
}

.headBox>ul .el-sub-menu .el-menu .el-menu-item {
	min-width: 0;
}

.headBox>ul .el-sub-menu .el-menu .el-menu-item:hover {
	background: #64609E;
}

/*pc搜索框*/

.headBox .pcsearchbox {
	padding: 0;
	max-width: 170px;
	/*min-width: 30px;*/
	height: 100%;
	line-height: 38px;
	position: absolute;
	top: 0;
	right: 0;
	cursor: pointer;
}

.headBox .pcsearchbox:hover .pcsearchinput {
	opacity: 1;
	/*transform: scaleX(1);*/
	visibility: visible;
}

.headBox .pcsearchbox i.pcsearchicon {
	color: #fff;
	padding-left: 10px;
}

.headBox .pcsearchbox .pcsearchinput {
	width: 180px;
	padding: 10px 20px 10px 20px;
	background: rgba(40, 42, 44, 0.6);
	border-radius: 0 0 2px 2px;
	position: absolute;
	right: 0;
	top: 38px;
	opacity: 0;
	visibility: hidden;
	/*transform: scaleX(0);*/
	transform-origin: right;
	transition: all 0.3s ease-out;
}

.headBox .pcsearchbox .hasSearched {
	opacity: 1;
	/*transform: scaleX(1);*/
	visibility: visible;
}

.headBox .pcsearchbox .el-input {
	width: 100%;
}

.headBox .el-input__inner {
	height: 30px;
	border: none;
	background: #fff;
	/*border: 1px solid #333;*/
	border-radius: 2px;
	padding-right: 10px;
}

.headBox .userInfo {
	height: 100%;
	line-height: 38px;
	position: absolute;
	right: 30px;
	top: 0;
	color: #fff;
}

.headBox .userInfo a {
	color: #fff;
	font-size: 13px;
	transition: all 0.2s ease-out;
}

.headBox .userInfo a:hover {
	color: #48456C;
}

.headBox .nologin {
	text-align: right;
}

.headBox .haslogin {
	text-align: right;
	position: relative;
	min-width: 80px;
	cursor: pointer;
}

.headBox .haslogin:hover ul {
	visibility: visible;
	opacity: 1;
}

.headBox .haslogin ul {
	background: rgba(40, 42, 44, 0.6);
	padding: 5px 10px;
	position: absolute;
	right: 0;
	visibility: hidden;
	opacity: 0;
	transition: all 0.3s ease-out;
}

.headBox .haslogin ul li {
	border-bottom: 1px solid #48456C;
}

.headBox .haslogin ul li:last-child {
	border-bottom: 1px solid transparent;
}

/*******移动端*******/

.mobileBox {
	position: relative;
	height: 38px;
	line-height: 38px;
	color: #fff;
}

.hideMenu {
	position: relative;
	width: 100%;
	height: 100%;
	line-height: 38px;
}

.hideMenu ul.mlistmenu {
	width: 100%;
	position: absolute;
	left: 0;
	top: 100%;
	box-sizing: border-box;
	z-index: 999;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12), 0 0 8px 0 rgba(0, 0, 0, .04);
	background: #48456C;
	color: #fff;
	border-right: none;
}

.hideMenu .el-sub-menu .el-menu {
	background: #64609E;
}

.hideMenu .el-menu-item,
.hideMenu .el-sub-menu__title {
	color: #fff;
}

.hideMenu>i {
	position: absolute;
	left: 10px;
	top: 12px;
	width: 30px;
	height: 30px;
	font-size: 16px;
	color: #fff;
	cursor: pointer;
}

.hideMenu .el-menu-item,
.el-sub-menu__title {
	height: 40px;
	line-height: 40px;
}

.mobileBox .searchBox {
	padding-left: 40px;
	width: 100%;
	box-sizing: border-box;
}

.mobileBox .searchBox .el-input__inner {
	display: block;
	border-radius: 2px;
	border: none;
	height: 25px;
}

.hideMenu ul.mlistmenu.pshow {
	display: block;
}

.hideMenu ul.mlistmenu .el-sub-menu__icon-arrow,
.mobileBox li.el-menu-item a {
	color: #fff;
}

.hideMenu>ul li.el-menu-item:hover,
.hideMenu>ul li.el-menu-item.is-active {
	background: #48576a;
}



/*头部背景图*/

.headImgBox {
	height: 650px;
	position: relative;
	width: 100%;
	background-size: cover;
	background-position: center 50%;
	background-repeat: no-repeat;
	margin-bottom: 90px;
}

.h-information {
	text-align: center;
	width: 70%;
	margin: auto;
	position: relative;
	top: 480px;
	padding: 40px 0;
	font-size: 16px;
	opacity: 0.98;
	background: rgba(230, 244, 249, 0.8);
	border-radius: 5px;
	z-index: 1;
	animation: b 1s ease-out;
	-webkit-animation: b 1s ease-out;
}

@-webkit-keyframes b {
	0% {
		-webkit-transform: translateY(90px);
		transform: translateY(90px);
	}
	80% {
		-webkit-transform: translateY(5px);
		transform: translateY(5px)
	}
	90% {
		-webkit-transform: translateY(-5px);
		transform: translateY(-5px)
	}
	to {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}
}

@keyframes b {
	0% {
		-webkit-transform: translateY(90px);
		transform: translateY(90px);
	}
	80% {
		-webkit-transform: translateY(5px);
		transform: translateY(5px)
	}
	90% {
		-webkit-transform: translateY(-5px);
		transform: translateY(-5px)
	}
	to {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}
}

.h-information img {
	width: 100px;
	height: 100px;
	border-radius: 100%;
	transition: all .4s ease-in-out;
	-webkit-transition: all .4s ease-in-out;
	object-fit: cover;
}

.h-information img:hover {
	transform: rotate(360deg);
	-webkit-transform: rotate(360deg);
}

.h-information h2 {
	margin-top: 20px;
	font-size: 18px;
	font-weight: 700;
	/*font-family: 'Sigmar One';*/
}
.h-information h2  a{
	background: linear-gradient(to right, #DF2050, #48456D);
	-webkit-background-clip: text;
	color: transparent;
}
.headImgBox .scene {
	width: 100%;
	/*height:300px;*/
	text-align: center;
	font-size: 100px;
	font-weight: 200;
	color: #fff;
	position: absolute;
	left: 0;
	top: 160px;
	font-family: 'Sigmar One', Arial;
	text-shadow: 0 2px 2px #47456d;

}

.headImgBox .scene span {
	transform: matrix(1, 0, 0, 1, 0, 0);
	-webkit-transform: matrix(1, 0, 0, 1, 0, 0);
	text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
}

.saying:after {
	content: "|";
	font-family: Arial, sans-serif;
	font-size: 1em;
	/*line-height: 0;*/
	display: inline-block;
	vertical-align: baseline;
	opacity: 1;
	text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
	animation: caret 500ms infinite;
}

@keyframes caret {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
}
</style>
