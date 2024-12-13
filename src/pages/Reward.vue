<!-- 赞赏页面 -->
<template>
<div>
	<headerMenu></headerMenu>
	<div class="container">
		<el-row :gutter="30">
			<el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
				<reward></reward>
			</el-col>
			<el-col :sm="24" :md="8">
				<rightList></rightList>
			</el-col>
		</el-row>
	</div>
</div>
</template>

<script setup lang="ts" name="Reward">
import headerMenu from '@/components/headerMenu.vue'
import rightList from '@/components/rightList.vue'
import reward from '@/components/reward.vue'
</script>

<style>

</style>
