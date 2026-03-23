<template>
    <h1>page1</h1>
    <el-input type="text"></el-input>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="desc" label="desc" />
    </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import utils from '$common/utils'
import $curl from '$common/curl'

console.log("page1 init", utils)

const tableData = ref([{
    name: 'aaa',
    desc: 'aaa desc'
}, {
    name: 'bbb',
    desc: 'bbb desc'
}, {
    name: 'ccc1',
    desc: 'ccc desc'
}])
onMounted(async () => {
    console.log("page1 mounted")
    const res = await $curl({
        url: "/api/project/list",
        method: "get",
        query: {
            proj_key: "a",
        }
    })
    tableData.value = res.data
})


</script>

<style lang="less" scoped>
h1 {
    color: red
}
</style>