import { AxiosResponse } from "axios"
import http from "./http"

const endpoint: string = '/transactions'

interface Transaction{
    ID: number
    CategoryID: number
    PaymentMethodID: number
    Amount: number
    Name: string
    Description: string
    Type: 'Expense' | 'Income' | 'Cancellation' | 'Transfer'
    PaymentDate: string
    ReferenceDate: string
    NeedsReview: boolean
}

interface UploadResponse {
    message: string
}

export default {
    list(): Promise<AxiosResponse<Transaction[]>> {
        return http.get(endpoint);
    },
    create(transaction: Transaction): Promise<AxiosResponse<Transaction>> {
        return http.post(endpoint, transaction)
    },
    get(id: number): Promise<AxiosResponse<Transaction>> {
        return http.get(`${endpoint}/${id}`)
    },
    update(id: number, transaction: Transaction): Promise<AxiosResponse<Transaction>> {
        return http.put(`${endpoint}/${id}`, transaction)
    },
    delete(id: number): Promise<AxiosResponse<{}>> {
        return http.delete(`${endpoint}/${id}`)
    },
    upload(formData: FormData): Promise<AxiosResponse<UploadResponse>> {
        return http.post(`${endpoint}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}