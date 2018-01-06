<script type="text/javascript" src="//www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function(event) {

  /* Name: Google Calendar */
  /* Chart Icon: Heatmap */
  /* Summary Data: Hide */
  /* Dimension: Time */
  /* Breakdown 1: Test */
  /* Breakdown 2: Omit Field */
  /* Limit: 1 */
  
  var selector = CPVisualization.getContainerSelector();

  $(selector).append('<div id="calendar_basic" style="width:100%; height:100%;"></div>');

  var chartData = CPVisualization.getData();
  var data = chartData.data;
  var headers = chartData.headers;
  var obj = [];

  for (var i = 0; i < data.length; i++) {
    getDate = data[i].dimension;
    res = getDate.split("/");
    dd = parseInt(res[1]);
    mm = parseInt(res[0]) - 1;
    yy = parseInt(res[2].slice(0, +4));
    obj.push([new Date(yy, mm, dd), data[i].metrics[0]]);
  }

  var arr = obj.reduce(function (p, c) {
    return p.concat(c);
  });

  var max = Math.max.apply(null, arr); // 9
  var min = Math.min.apply(null, arr); // 1

  google.charts.load("current", {packages:["calendar"]});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Metric' });
    dataTable.addRows(obj);

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    console.log($(window).width());
    var options = {
      title: data[0].breakdown1 + " - " + headers.metrics[0],
      width: $(window).width(),
      height: $(window).height()*0.75,
      calendar: { cellSize: ($(window).width() / 2) * 0.024 },
      colorAxis: {minValue: min,  colors: ['#00FF00', '#FF0000']}
    };

    chart.draw(dataTable, options);
  }
});
</script>
