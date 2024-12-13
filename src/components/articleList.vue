<!-- 文章列表 -->
<template>
    <el-row class="sharelistBox">
        <el-col :span="24" class="s-item tcommonBox" v-for="(item,index) in articleListData" :key="item.id">
            <span class="s-round-date">
                <span class="month" v-html="showInitDate(item.createTime,'month')+'月'"></span>
                <span class="day" v-html="showInitDate(item.createTime,'date')"></span>
            </span>
            <header>
                <h1>
                    <a @click="router.push({path:'/DetailArticle',query:{
                        aid:item.id
                    }})" target="_blank">
                        {{item.title}}
                    </a>
                </h1>
                <h2>
                    <i class="fa fa-fw fa-user"></i>发表于
                    <i class="fa fa-fw fa-clock-o"></i><span v-html="showInitDate(item.createTime,'all')"></span> •
                    <i class="fa fa-fw fa-eye"></i>{{item.viewCount}} 次围观 •
                </h2>
                <div class="ui label">
                    <a @click="router.push({path:'/Share',query:{
                        classId:item.class_id
                    }})">{{item.categoryName}}</a>
                </div>
            </header>
            <div class="article-content">
                <p style="text-indent:2em;">
                    {{item.summary}}
                </p>
                <p style="max-height:300px;overflow:hidden;text-align:center;">
                    <img :src="item.thumbnail" alt="" class="maxW">
                </p>
            </div>
            <div class="viewdetail">
                <a class="tcolors-bg" @click="router.push({path:'/DetailArticle',query:{
                        aid:item.id
                    }})">阅读全文>></a>
            </div>
        </el-col>
         <el-col class="viewmore">
            <a v-show="hasMore" class="tcolors-bg" href="javascript:void(0);" @click="addMoreFun()">点击加载更多</a>
            <a v-show="!hasMore" class="tcolors-bg" href="javascript:void(0);">暂无更多数据</a>
        </el-col>
    </el-row>
</template>

<script setup lang="ts" name="articleList">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useUserDataStore} from '@/store/index'
import {initDate} from '@/utils/date.js'
import {articleList} from '@/api/article'

const userDataStore = useUserDataStore()
const router = useRouter()
const route = useRoute()
// 查询参数
const queryParams = {
        pageNum: 1,
        pageSize: 10,
        categoryId: 0,
        }
const articleListData= ref([])
const hasMore = ref(true)

//格式化日期
function showInitDate(oldDate,full){
    return initDate(oldDate,full)
}
//文章列表
async function getList(){
    const response = await articleList(queryParams)
    articleListData.value = articleListData.value.concat(response.rows)
    if(response.total<=articleListData.value.length){
        hasMore.value=false
    }else{
        hasMore.value=true
        queryParams.pageNum++
    }
}
//展示数据
function showSearchShowList(initData){
    if(initData){
        articleListData.value = []
    }
    getList()
}
//查看更多
function addMoreFun(){
    showSearchShowList(false);
}
//路由参数改变
function routeChange(){
    queryParams.categoryId = (route.query.classId==undefined?0:parseInt(route.query.classId as string));//获取传参的classId
    showSearchShowList(true);
}

watch(route,()=>{
    routeChange()
},{
    deep:true
})
watch(userDataStore.keywords,()=>{
    routeChange()
},{
    deep:true
})

onMounted(()=>{
    routeChange()
})
</script>

<style>
/*分享标题*/
.shareTitle{
    margin-bottom: 40px;
    position: relative;
    border-radius: 5px;
    background: #fff;
    padding:15px;
}
.shareclassTwo{
    width:100%;
}
.shareclassTwo li{
    display: inline-block;
}
.shareclassTwo li a{
    display: inline-block;
    padding:3px 7px;
    margin:5px 10px;
    color:#fff;
    border-radius: 4px;
    background: #64609E;
    border: 1px solid #64609E;
    transition: transform 0.2s linear;
    -webkit-transition: transform 0.2s linear;
}
.shareclassTwo li a:hover{
    transform: translate(0,-3px);
    -webkit-transform: translate(0,-3px);
}
.shareclassTwo li a.active{
    background: #fff;
    color:#64609E;

}
/*文章列表*/
.sharelistBox{
    transition: all 0.5s ease-out;
    font-size: 15px;
}
/*标题和按钮*/
.s-item .article-content p{
    margin:10px 0;
    line-height:24px;
}
.s-item .viewdetail{
    margin:10px 0 ;
    line-height: 24px;
    text-align: center;
}
.s-item .viewdetail a{
    color:#fff;
    font-size: 12px;
    padding:5px 10px;
    border-radius: 5px;
}
/*暂无更多数据*/
.viewmore{
    text-align: center;
    width:100%;
}
.viewmore a{
    /*background:  #97dffd;*/
    /*padding:6px 0;*/
    border-radius: 5px;
    text-align: center;
    font-size: 14px;
    color:#fff;
    height:30px;
    line-height: 30px;
    display: block;
}
/*.sharelistBox .viewmore a:hover,.s-item .viewdetail a:hover{
    background: #48456C;
}*/
</style>
