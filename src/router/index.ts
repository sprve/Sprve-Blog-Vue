import { createWebHistory, createRouter } from 'vue-router'

import Home from '../pages/Home.vue'
import DetailArticle from '../pages/DetailArticle.vue'
import Share from '../pages/Share.vue'
import Reward from '../pages/Reward.vue'
import FriendsLink from '../pages/FriendsLink.vue'
import Login from '../pages/Login.vue'
import UserInfo from '../pages/UserInfo.vue'

const routes = [
{//首页
  path: '/',
  component: Home,
  meta: {
    auth: true
  },
  name: ''
},
{//首页
  path: '/Home',
  component: Home,
  meta: {
    auth: true
  },
  name: 'Home'
},
{//分享详情
  path: '/DetailArticle',
  component: DetailArticle,
  meta: {
    auth: true
  },
  name: 'DetailArticle'
},
{//分享详情
  path: '/Reward',
  component: Reward,
  meta: {
    auth: true
  },
  name: 'Reward'
},
{//赞赏
  path: '/Share',
  component: Share,
  meta: {
    auth: true
  },
  name: 'Share'
},
{//友链
  path: '/FriendsLink',
  component: FriendsLink,
  meta: {
    auth: true
  },
  name: 'FriendsLink'
},
{//注册登录
  path: '/Login',
  component: Login,
  meta: {
    auth: false
  },
  name: 'Login'
},
{//用户个人中心
  path: '/UserInfo',
  component: UserInfo,
  meta: {
    auth: true
  },
  name: 'UserInfo'
},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router