<!-- 文章详情 -->
<template>
    <div>
        <headerMenu></headerMenu>
        <div  class="container" id="detail">
            <el-row  :gutter="30">
                <el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
                    <articleDetail></articleDetail>
                    <message></message>
                </el-col>
                <el-col :sm="24"  :md="8" >
                    <rightList></rightList>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts" name="DetailArticle">
import headerMenu from '@/components/headerMenu.vue'
import rightList from '@/components/rightList.vue'
import articleDetail from '@/components/articleDetail.vue'
import message from '@/components/message.vue'
import { onMounted } from 'vue';

onMounted(()=>{
    const anchor = document.querySelector("#detail");
    // console.log(anchor,anchor.offsetTop);
    const top = anchor.offsetTop-60;
    document.body.scrollTop = top;
    // Firefox
    document.documentElement.scrollTop = top;
    // Safari
    window.pageYOffset = top;
})
</script>

<style>

</style>