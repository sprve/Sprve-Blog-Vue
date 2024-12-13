<!-- 友情链接 -->
<template>
    <div>
        <headerMenu></headerMenu>
        <div class="container">
            <el-row  :gutter="30">
                <el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
                    <friends></friends>
                    <message></message>
                </el-col>
                <el-col :sm="24"  :md="8" >
                    <rightList></rightList>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts" name="FriendsLink">
import headerMenu from '@/components/headerMenu.vue'
import friends from '@/components/friends.vue'
import rightList from '@/components/rightList.vue'
import message from '@/components/message.vue'
</script>

<style>

</style>
