import {useEffect, useState} from "react";
import {getSpendingAlertsData} from "@/src/services/api";

const SpendingAlerts = () => {
    const [spendingAlertsData, setSpendingAlertsData] = useState(null);

    useEffect(() => {
        getSpendingAlertsData()
            .then(data => {
                setSpendingAlertsData(data);
            })
            .catch(error => {
                //TODO: handle displaying error in the UI
            });
    }, []);

    // TODO: render interactive charts
    return (
        <div>
            <h2>Spending Alerts</h2>
        </div>
    );
};

export default SpendingAlerts;