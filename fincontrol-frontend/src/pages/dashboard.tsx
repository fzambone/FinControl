import FinancialOverview from "@/src/components/FinancialOverview";
import CategoryInsights from "@/src/components/CategoryInsights";
import {Grid} from "@mui/material";
import BudgetTracker from "@/src/components/BudgetTracker";
import SpendingAlerts from "@/src/components/SpendingAlerts";

const DashboardPage = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FinancialOverview />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CategoryInsights />
            </Grid>
            <Grid item xs={12} sm={6}>
                <BudgetTracker />
            </Grid>
            <Grid item xs={12} sm={6}>
                <SpendingAlerts />
            </Grid>
        </Grid>
    );
};

export default DashboardPage;