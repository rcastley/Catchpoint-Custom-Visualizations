<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqcloud/1.0.4/jqcloud-1.0.4.min.js"></script>
<script type="text/javascript">

  /* Name: Reverse Word Cloud */
  /* Chart Icon: ScatterPlot */
  /* Summary Data: Hide */
  /* Dimension: Time */
  /* Breakdown 1: Any */
  /* Breakdown 2: Omit Field */
  /* Limit: 1 (Metrics) */

  document.addEventListener("DOMContentLoaded", function(event) {

    var w = $("div#ChartImageContainer").width();
    var h = $("div#ChartImageContainer").height();

    var selector = CPVisualization.getContainerSelector();
    $(selector).append('<div id="words"></div>');

    var summary = CPVisualization.getSummaryData();

    var data = summary.data;
    var headers = summary.headers;
    var obj = {
      data: []
    };

    var re = /\[.*\]\s-/;
    for (var i = 0; i < data.length; i++) {
      obj.data.push({
        "text": data[i].breakdown1.replace(re, ""),
        "weight": -Math.abs(data[i].metrics)
      });
    }
  
    $('#words').jQCloud(obj.data, {
      autoResize: true,
      width: w,
      height: h + 500
    });
  });
</script>

<style>
  /* layout */

  div.jqcloud span {
    padding: 0;
  }

  /* fonts */

  div.jqcloud {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 10px;
    line-height: normal;
    overflow: hidden;
    position: relative;

  }

  div.jqcloud a {
    font-size: inherit;
    text-decoration: none;
  }

  div.jqcloud span.w10 {
    font-size: 325%;
  }

  div.jqcloud span.w9 {
    font-size: 300%;
  }

  div.jqcloud span.w8 {
    font-size: 275%;
  }

  div.jqcloud span.w7 {
    font-size: 250%;
  }

  div.jqcloud span.w6 {
    font-size: 225%;
  }

  div.jqcloud span.w5 {
    font-size: 200%;
  }

  div.jqcloud span.w4 {
    font-size: 175%;
  }

  div.jqcloud span.w3 {
    font-size: 150%;
  }

  div.jqcloud span.w2 {
    font-size: 125%;
  }

  div.jqcloud span.w1 {
    font-size: 100%;
  }

  /* colors */

  div.jqcloud {
    color: #09f;
  }

  div.jqcloud a {
    color: inherit;
  }

  div.jqcloud a:hover {
    color: #F44336;
  }

  div.jqcloud a:hover {
    color: #E57373;
  }

  div.jqcloud span.w1 {
    color: #F44336;
  }

  div.jqcloud span.w2 {
    background: linear-gradient(-270deg, #FF9800, #FF5722, #F44336);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.jqcloud span.w3 {
    background: linear-gradient(-270deg, #FF9800, #FF5722);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.jqcloud span.w4 {
    color: #FF9800;
  }

  div.jqcloud span.w5 {
    background: linear-gradient(-270deg, #FFEB3B, #FFC107, #FF9800);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.jqcloud span.w6 {
    background: linear-gradient(-270deg, #FFEB3B, #FFC107);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.jqcloud span.w7 {
    color: #FFEB3B;
  }

  div.jqcloud span.w8 {
    background: linear-gradient(-270deg, #8BC34A, #CDDC39, #FFEB3B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.jqcloud span.w9 {
    background: linear-gradient(-270deg, #8BC34A, #CDDC39);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  div.jqcloud span.w10 {
    color: #8BC34A;
  }
</style>
