// Chart object
var StatusChart = {
    // Chart container
    container: null,

    // Chart options
    options: {
        chart: {
            renderTo: 'status-chart',
            type: 'pie',
            animation: false,
            backgroundColor: null,
            borderRadius: 0,
            height: 300
        },
        plotOptions: {
            pie: {
                borderColor: '#000',
                borderWidth: 3,
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        colors: ['#FFF','#4572A7','#F5B858','#FF5858','#B3FF97',],
        title: { text: ''},

        tooltip: {
            backgroundColor: '#000',
            borderWidth: 0,
            style: { color: '#fff' },
            percentageDecimals: 0,
            pointFormat: '{series.name}: <b>{point.percentage}%</b>'
        },
        legend: {
            enabled: true,
            style: { color: "#FFF" },
            itemStyle: { color: '#fff' }
        },
        credits: { enabled: false },
        series: [
            { name: 'Status', data: [] }
        ]
    },

    // Setup the chart
    setup: function() {
        StatusChart.container = new Highcharts.Chart(StatusChart.options);
        Meteor.autosubscribe(StatusChart.update);
    },

    // Update chart data
    update: function() {

        var issueCount = IssuesCountVersion.findOne({});

        console.log(issueCount);
        console.log(StatusChart);

        if (issueCount ==  undefined) {
            return;
        }

        var data = [];
        _.each(issueCount.status, function(element, index) {
            data.push([index, element]);
        });

        console.log(data);
        StatusChart.container.series[0].setData(data);
    }
};
