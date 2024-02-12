import {useEffect, useState} from "react";
import {getBudgetTrackerData} from "@/src/services/api";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


const BudgetTracker = () => {
    const [budgetTrackerData, setBudgetTrackerData] = useState(null);

    useEffect(() => {
        getBudgetTrackerData()
            .then(data => {
                setBudgetTrackerData(data);
            })
            .catch(error => {
              //TODO: handle display error in the UI
            });
    }, []);

    // TODO: render interactive charts
    return (
        <div>
            <h2>Budget Tracker</h2>
        </div>
    );
};

export default BudgetTracker;