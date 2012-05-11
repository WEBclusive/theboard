// Chart object
var Chart = {
    // Chart container
    container: null,

    // Chart options
    options: {
        chart: {
            renderTo: 'chart',
            type: 'spline',
            animation: false,
            backgroundColor: null,
            borderRadius: 0,
            height: 200
        },
        colors: ['#4572A7', '#fff', '#DB843D', '#FF5858'],
        title: { text: ''},
        xAxis: {
            lineWidth: 0,
            labels: { enabled: false },
            tickWidth: 0
        },
        yAxis: {
            title: { text: '' },
            labels: { style: { color: '#fff', fontSize: '1.1em'}},
            gridLineWidth: 1,
            gridLineColor: '#333',
            min: 0,
            opposite: true
        },
        tooltip: {
            backgroundColor: '#000',
            borderWidth: 0,
            style: { color: '#fff' },
            formatter: function() { return this.y + ' issues'; }
        },
        plotOptions: {
            spline: {
                lineWidth: 5,
                marker: { symbol: 'circle', lineColor: null, lineWidth: 1 }
            }
        },
        legend: { enabled: false },
        credits: { enabled: false },
        series: [
            { name: 'Low', data: [] },
            { name: 'Normal', data: [] },
            { name: 'High', data: [] },
            { name: 'Urgent', data: [] }
        ]
    },

    // Setup the chart
    setup: function() {
        Chart.container = new Highcharts.Chart(Chart.options);
        Meteor.autosubscribe(Chart.update);
    },

    // Update chart data
    update: function() {
        var lowData = [];
        var normalData = [];
        var highData = [];
        var urgentData = [];

        // Construct chart data from database
        var counts = IssuesCountHistory.find({}, {date: 1});
        counts.forEach(function(count) {
            lowData.push(count.low);
            normalData.push(count.normal);
            highData.push(count.high);
            urgentData.push(count.urgent);
        });

        // Add the chart data to the chart
        Chart.container.series[0].setData(lowData);
        Chart.container.series[1].setData(normalData);
        Chart.container.series[2].setData(highData);
        Chart.container.series[3].setData(urgentData);
    }
};