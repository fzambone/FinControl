<template>
    <el-container>
        <el-header>Header</el-header>
        <el-container>
            <el-aside width="200px">Sidebar</el-aside>
            <el-main>Main Content</el-main>
        </el-container>
        <el-footer>Footer</el-footer>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Dashboard',
});
</script>