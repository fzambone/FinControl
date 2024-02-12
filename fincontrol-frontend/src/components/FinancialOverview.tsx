import {useEffect, useState} from "react";
import {getTransactionsData} from "@/src/services/api";


const FinancialOverview = () => {
    const [transactionsData, setTransactionsData] = useState(null);

    useEffect(() => {
        getTransactionsData()
            .then(data => {
                setTransactionsData(data);
            })
            .catch(error => {
                // TODO: Handle error in the UI
            });
    }, []);

    // TODO: Render charts
    return (
        <div>
            <h2>Financial overview</h2>
        </div>
    );
};

export default FinancialOverview;