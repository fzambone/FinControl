import {useEffect, useState} from "react";
import {getCategoriesData} from "@/src/services/api";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


const CategoryInsights = () => {
    const [categoryData, setCategoryData] = useState(null);

    useEffect(() => {
        getCategoriesData()
            .then(data => {
                setCategoryData(data);
            })
            .catch(error => {
                //TODO: handle error in UI
            });
    }, []);

    // TODO: render interactive charts
    return (
        <div>
            <h2>Category Insights</h2>
        </div>
    );
};

export default CategoryInsights;