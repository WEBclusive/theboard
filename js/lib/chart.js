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
            labels: { enabled: false },
            gridLineWidth: 1,
            gridLineColor: '#222',
            min: 0
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
            { name: 'Low', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Normal', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'High', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Urgent', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
    },

    // Setup the chart
    setup: function() {
        Chart.container = new Highcharts.Chart(Chart.options);
        Meteor.autosubscribe(Chart.update);
    },

    // Update chart data
    update: function() {
        var counts = IssuesCountHistory.find({});
        counts.forEach(function(priority) {
            switch (priority.type) {
                case 'low': Chart.container.series[0].setData(priority.counts); break;
                case 'normal': Chart.container.series[1].setData(priority.counts); break;
                case 'high': Chart.container.series[2].setData(priority.counts); break;
                case 'urgent': Chart.container.series[3].setData(priority.counts); break;
            }
        });
    }
};