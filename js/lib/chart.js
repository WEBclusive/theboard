// Chart object
var Chart = {
    // Chart container
    container: null,

    // Chart options
    options: {
        chart: {
            renderTo: 'chart',
            type: 'line',
            animation: false,
            backgroundColor: false
        },
        colors: [
            '#FF5858',
            '#DB843D',
            '#fff',
            '#4572A7'
        ],
        title: {
            text: ''
        },
        xAxis: {
            categories: [
                '14',
                '13',
                '12',
                '11',
                '10',
                '9',
                '8',
                '7',
                '6',
                '5',
                '4',
                '3',
                '2',
                '1',
                'today'
            ],
            lineWidth: 0,
            labels: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 1,
            gridLineColor: '#222',
            min: 0
        },
        plotOptions: {
            line: {
                lineWidth: 3,
                marker: {
                    enabled: false
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [
            {
                name: 'Urgent',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'High',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Normal',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Low',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
    },

    // Setup the chart
    setup: function() {
        Chart.container = new Highcharts.Chart(Chart.options);
    },

    // Update chart data
    update: function() {
        Chart.container.series[0].setData([1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 2, 1, 1, 0]);
        Chart.container.series[1].setData([1, 0, 1, 0, 3, 0, 2, 0, 0, 1, 2, 4, 1, 0, 1]);
        Chart.container.series[2].setData([20, 21, 22, 19, 20, 23, 24, 25, 30, 32, 30, 22, 26, 20, 21]);
        Chart.container.series[3].setData([10, 8, 7, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    }
};