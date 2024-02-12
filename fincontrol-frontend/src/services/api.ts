import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8080',
})

export const getTransactionsData = async () => {
    try {
        const response = await API.get('/transactions');
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions data:", error);
        throw error;
    }
};

export const getCategoriesData = async () => {
    try {
        const response = await API.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories data:", error);
        throw error;
    }
};

export const getBudgetTrackerData = async () => {
    try {
        const response = await API.get('/budgets');
        return response.data;
    } catch (error) {
        console.error("Error fetching budgets data:", error);
        throw error;
    }
};

export const getSpendingAlertsData = async () => {
    try {
        const response = await API.get('/spendingAlerts');
        return response.data;
    } catch (error) {
        console.error("Error fetching spending alerts data:", error);
        throw error;
    }
};

export default API;