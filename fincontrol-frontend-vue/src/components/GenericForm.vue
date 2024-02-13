<template>
    <el-form :model="formData" @submit.native.prevent="handleSubmit">
        <el-form-item 
        v-for="(field, index) in fields"
        :key="index"
        :label="field.label"
        :prop="field.model"
        >
            <el-input v-model="formData[field.model]" :type="field.type"></el-input>
        </el-form-item>
        <el-button type="primary" native-type="submit">Submit</el-button>
    </el-form>
</template>

<script lang="ts">
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { PropType, defineComponent, ref, toRefs, watch } from 'vue';
import { FormField } from '../types/FormField';

type FormData = {
    [key: string]: string
}

export default defineComponent({
    components: {
        ElForm,
        ElFormItem,
        ElInput,
        ElButton
    },
    props: {
        fields: {
            type: Array as PropType<FormField[]>,
            required: true,
        },
    },
    emits: ['submit'],
    setup(props, { emit }) {
        const { fields } = toRefs(props)
        const formData = ref<FormData>({})

        watch(fields, (newFields) => {
            newFields.forEach((field) => {
                if (!(field.model in formData.value)) {
                    formData.value[field.model] = field.value || ''
                }
            })
        }, { immediate: true })

        const handleSubmit = () => {
            emit('submit', formData.value)
        }

        return { formData, handleSubmit }
    },
})
</script>