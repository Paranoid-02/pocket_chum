import React from "react";
import Chart from "chart.js/auto";

const useChart = (nodeRef, options) => {
 React.useEffect(() => {
    const chart = Chart.getChart(nodeRef.current.id);
    if (chart) {
      chart.destroy();
     }
   new Chart(nodeRef.current, options);
   console.log("chart rendered");
}, [nodeRef, options]);
 return {};
};
export default useChart;