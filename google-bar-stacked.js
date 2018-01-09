<script type = "text/javascript" src = "https://www.gstatic.com/charts/loader.js"></script>
<script type = 'text/javascript'>
  document.addEventListener('DOMContentLoaded', function(event) {

    /* Name: Google Bar Stacked */
    /* Chart Icon: Bar */
    /* Summary Data: Hide */
    /* Dimension: Time */
    /* Breakdown 1: Any */
    /* Breakdown 2: Omit Field */
    /* Limit: 10 */

    var selector = CPVisualization.getContainerSelector();
    var summary = CPVisualization.getSummaryData();

    var headers = summary.headers;
    var data = summary.data;

    var re = /\[.*\]\s-\s/;

    var legend = new Array();
    var obj = new Array();

    for (var i = 0; i < headers.metrics.length; i++) {
      legend.push(headers.metrics[i]);
    }
    legend.unshift("Test Name");

    for (var i = 0; i < data.length; i++) {
      var da = new Array();
      da.push(data[i].breakdown1.replace(re, ""));
      for (var j = 0; j < data[i].metrics.length; j++) {
        da.push(Math.round(data[i].metrics[j]));
      }
      obj.push(da);
    }

    obj.unshift(legend);

    $(selector).append("<div id='stackedBarChart' style='width:85%; height:100%'></div>");

    google.charts.load('current', {
      'packages': ['bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(obj);

      var options = {
        bars: 'vertical',
        isStacked: true,
        height: 300,
        colors: ['#0B6CB3'],
        legend: {
          textStyle: {
            fontSize: 12
          }
        },
      };

      var chart = new google.charts.Bar(document.getElementById('stackedBarChart'));

      chart.draw(data, google.charts.Bar.convertOptions(options));
    }
  });
</script>
