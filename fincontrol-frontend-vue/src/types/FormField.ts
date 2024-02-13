export interface FormField {
    label: string
    model: string
    type: string
    value?: string
    placeholder?: string
    options?: Array<{ value: string | number; label: string}>
    validationRules?: Array<string | Function>
}