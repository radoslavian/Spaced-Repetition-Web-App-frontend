import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { compareDate, convertEFactorData } from "../utils/helpers";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title,
);

function getOptions(title) {
    return {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title,
            },
        },
    };
}

function getChartData(labels, data) {
    return {
        labels,
        datasets: [
            {
                data: data,
                backgroundColor: "rgba(53, 162, 235, 0.5)"
            }
        ]
    };
}

export function CardDistributionChart({ chartData, title = "Distribution" }) {
    const options = getOptions(title);
    const labels = Object.keys(chartData).sort(compareDate);
    const data = getChartData(labels, labels.map(label => chartData[label]));

    return <Bar options={options} data={data} />;
}

export function GradesDistributionChart({ chartData }) {
    // Number of cards for each grade.
    const options = getOptions("Grades distribution");
    const labelKeys = Object.keys(chartData).sort();
    const labels = labelKeys.map(key => `Grade: ${key}`);
    const data = getChartData(labels,
                              labelKeys.map(label => chartData[label]));

    return <Bar options={options} data={data} />;
}

export function EFactorDistributionChart({ chartData }) {
    const eFactorData = convertEFactorData(chartData);
    const options = getOptions("E-Factors distribution");
    const labels = Object.keys(eFactorData).sort();
    const data = getChartData(labels,
                              labels.map(label => eFactorData[label]));

    return <Bar options={options} data={data} />;
}
