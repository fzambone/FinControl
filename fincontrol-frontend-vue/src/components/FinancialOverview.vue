<template>
    <div class="financial-overview">
        <el-select v-model="selectedPeriod" placeholder="Select reference date" @change="updateCharts" class="filter-dropdown">
            <el-option
             v-for="date in uniqueReferenceDates"
             :key="date"
             :label="date"
             :value="date">
            </el-option>
        </el-select>
        <!-- Charts here -->
    </div>
</template>

<script lang="ts">
import { ElSelect, ElOption } from 'element-plus';
import { defineComponent, onMounted, ref, watch } from 'vue';
import transactionsService from '../services/transactionsService';

export default defineComponent({
    components: {
        ElSelect,
        ElOption,
    },
    setup() {
        const selectedPeriod = ref<string>('')
        const uniqueReferenceDates = ref<string[]>([])

        const fetchAndProcessData = async () => {
            const response = await transactionsService.list();
            const dates = response.data.map(transaction => transaction.ReferenceDate)
            uniqueReferenceDates.value = Array.from(new Set(dates)).sort()
        }

        const updateCharts = () => {
            // TODO: Implement chart update logic based on selectedPeriod
        }

        onMounted(fetchAndProcessData)
        watch(selectedPeriod, updateCharts)

        return {
            selectedPeriod,
            uniqueReferenceDates,
            updateCharts,
        }
    }
})
</script>

<style scoped>
/* @import "../styles/element-variables.scss"; */

.filter-dropdown {
    margin-bottom: 20px;
}
</style>