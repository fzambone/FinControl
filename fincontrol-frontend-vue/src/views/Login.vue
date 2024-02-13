<template>
    <generic-form
     :fields="loginFields"
     @submit="handleLogin"
    />
</template>

<script lang="ts">
import GenericForm from '../components/GenericForm.vue'
import { defineComponent } from 'vue'
import { FormField } from '../types/FormField';

export default defineComponent({
    components: {
        GenericForm
    },
    setup() {
        const loginFields: FormField[] = [
            {
                label: 'Username',
                model: 'username',
                type: 'text',
                placeholder: 'Enter your username',
            },
            {
                label: 'Password',
                model: 'password',
                type: 'password',
                placeholder: 'Enter your password',
            },
        ]

        // const formData = reactive({
        //     username: '',
        //     password: '',
        // })

        const handleLogin = (formData: { username: string, password: string }) => {
            console.log('Form data submitted:', formData)
        }

        return { loginFields, handleLogin }
    }
})
</script>