import React from 'react';

import { Bar, Line, Pie } from 'react-chartjs'

import './BookingsChart.css';

const BOOKING_BUCKETS = {
    "Cheap": {min: 0, max: 100},
    "Normal": {min: 100, max: 200},
    "Expensive": {min: 200, max: 1000000}
}

const rand = (min, max, num) => {
    const rtn = [];
    while (rtn.length < num) {
        rtn.push((Math.random() * (max - min)) + min);
    }
    return rtn;
}

const CHART_DATA = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: rand(32, 100, 7)
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: rand(32, 100, 7)
        }
    ]
};

const BookingsChart = (props) => {

    const data_chart_output = {
        labels: ["Cheap", "Normal", "Expensive"],
        datasets: [{
            label: "Value",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }]
    };

    console.log(props.bookings);

    for (let bucket in BOOKING_BUCKETS) {
        const val = props.bookings.reduce((prev, current) => {
            const price = current.event.price;
            const {min, max} =  BOOKING_BUCKETS[bucket];
            if (price >= min && price < max)
                return prev + 1;
            return prev;
        }, 0);
        data_chart_output.datasets[0].data.push(val);
    }

    console.log(data_chart_output);

    return (
        <div className="bookings-chart">
            <Bar className="bookings-chart-bar" data={data_chart_output}  />
        </div>
    )
}


export default BookingsChart;
