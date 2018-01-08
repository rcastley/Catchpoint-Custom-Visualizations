<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js"></script>
<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery.gridster/0.5.6/jquery.gridster.min.js'></script>
<link rel='stylesheet' type='text/css' href='//cdnjs.cloudflare.com/ajax/libs/jquery.gridster/0.5.6/jquery.gridster.min.css'>

<script type='text/javascript'>

        /* Version 2.7 - 19 December 2017 */
        /* ChangeLog */
        /* Fixed rounding issue on metrics */
        /* Fixed issue with % Availability */
        /* Added SLA entry field to override average */
        /* Removed settings from dashboard view */
        /* Added small,medium,large widget selector */
        /* Hide Avg/SLA widget and code optimisation */
        /* Fixed % Avail bug in summary widget */
        /* Fixed bug in % calc for SLA levels */
        
        /* Name: Grid */
        /* Chart Icon: Heatmap */
        /* Summary Data: Hide */
        /* Dimension: Time */
        /* Breakdown 1: Any */
        /* Breakdown 2: None/Omit */
        /* Limit: 1 */
        

    document.addEventListener('DOMContentLoaded', function(event) {

          /* Thresholds */
          var t_availability = localStorage.getItem('g_sla') ? localStorage.getItem('g_sla') : 98;
          var t_metric_min = localStorage.getItem('g_warning') ? localStorage.getItem('g_warning') : 10;
          var t_metric_max = localStorage.getItem('g_critical') ? localStorage.getItem('g_critical') : 25;
          var t_grid_size = 80;
          var upChar = "&utrif;";
          var downChar = "&dtrif;";
          var selector = CPVisualization.getContainerSelector();
          //var selector = "div#Chart2";

          if (selector == "div#Chart2") {
            $(selector).html('<div class="g_chart_type">' +
              'Chart Type: <select id="g_chart_type">' +
              '<option value="line">Line</option>' +
              '<option value="bar">Bar</option>' +
              '</select>' +
              ' Hide Avg/SLA: <select id="g_avg_sla">' +
              '<option value="0">No</option>' +
              '<option value="1">Yes</option>' +
              '</select>' +
              ' Grid Size: <select id="g_grid_size">' +
              '<option value="80">Small</option>' +
              '<option value="100">Medium</option>' +
              '<option value="120">Large</option>' +
              '</select>' +
              ' SLA: <input type="text" id="g_sla" name="g_sla" size="6"/>' +
              ' Warning: <input type="text" id="g_warning" name="g_warning" size="3"/>% ' +
              ' Critcal: <input type="text" id="g_critical" name="g_critical" size="3"/>%' +
              '</div><hr />');
          }

          $(function() {
            $('#g_chart_type').change(function() {
              localStorage.setItem('g_chart_type', this.value);
              location.reload();
            });

            gridPrefs('g_chart_type', 'line', false);

            $('#g_avg_sla').change(function() {
              localStorage.setItem('g_avg_sla', this.value);
              location.reload();
            });

            gridPrefs('g_avg_sla', '0', false);

            $('#g_grid_size').change(function() {
              localStorage.setItem('g_grid_size', this.value);
              location.reload();
            });

            gridPrefs('g_grid_size', '80', false);

            $('#g_sla').change(function() {
              localStorage.setItem('g_sla', this.value);
              location.reload();
            });

            gridPrefs('g_sla', null, true);

            $('#g_warning').change(function() {
              localStorage.setItem('g_warning', this.value);
              location.reload();
            });

            gridPrefs('g_warning', null, true);

            $('#g_critical').change(function() {
              localStorage.setItem('g_critical', this.value);
              location.reload();
            });

            gridPrefs('g_critical', null, true);

          });

          var g_size = parseInt(localStorage.getItem('g_grid_size'));

          /* Get Catchpoint data */

          var summary = CPVisualization.getSummaryData();
          var chartData = CPVisualization.getData();
          var data = summary.data;
          var headers = summary.headers;

          var c_data = chartData.data;
          var c_headers = chartData.headers;

          $(selector).append("<div class='gridster'><ul></ul></div>");

          var gridster = $(".gridster>ul").gridster({
            widget_margins: [3, 3],
            widget_base_dimensions: [g_size, g_size]
          }).data('gridster');

          var total = 0;

          for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var metric = obj.metrics[0];
            total += parseFloat(metric);
          }

          if (!localStorage.getItem('g_sla')) {
            var avg = Math.round((total / data.length) * 100) / 100;
          } else {
            //var avg = parseInt(localStorage.getItem('g_sla'));
            var avg = parseFloat(localStorage.getItem('g_sla')).toFixed(2)
          }

          var arr = [],
            d, b1, b2, found, a;

          for (var i = 0; i < c_data.length; i++) {
            d = c_data[i];

            b1 = d.breakdown1;
            b2 = d.breakdown2;

            found = false;
            for (var j = 0; j < arr.length; j++) {
              a = arr[j];
              if (a[0] == b1 && a[1] == b2) {
                found = true;
                break;
              }
            }

            if (found) {
              for (var j = 0; j < d.metrics.length; j++) {
                a[j + 2].push(d.metrics[j]);
              }
            } else {
              a = [b1, b2];
              for (var j = 0; j < d.metrics.length; j++) {
                a.push([d.metrics[j]]);
              }

              arr.push(a);
            }
          }

          var w_title = localStorage.getItem('g_sla') ? 'SLA' : 'Overall';

          if (headers.metrics[0] == " % Availability") {
            w_footer = "% Availability";
          } else {
            w_footer = localStorage.getItem('g_sla') ? headers.metrics[0].substring(4) : headers.metrics[0];
          }

          if (localStorage.getItem('g_avg_sla') == 0) {
            gridster.add_widget("<li class='default'>" +
                "<div class='big-widget'>" +
                "<h2 class='widget_size_" + g_size + "'>" + w_title + "</h2>" +
                "<h1 class='large_" + g_size + "'>" + avg + "</h1>" +
                "<h2 class='widget_size_" + g_size + "'>" + w_footer + "</h2></div></li>", 2, 2);
          }

          var re = /\[.*\]\s-/;

          for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var name = obj.breakdown1.replace(re, "");
            var text = name.substring(0, 20);

            if (text.length == 22) {
              text = text + "...";
            }

            var metric = Math.round(obj.metrics[0] * 100) / 100;
            var p = (avg - metric) / avg * 100;
            p = Math.round(p);

            showPercent = '';

            if (headers.metrics[0] != " % Availability") {
              if (p < 0) {
                showPercent = '<span class="small" style=""> / ' + Math.abs(p) + '% ' + downChar + '</span>';
              } else if (p == 0) {
                showPercent = '<span class="small" style=""> / ' + Math.abs(p) + '%</span>';
              } else if (p >= t_metric_min && p <= t_metric_max || p >= t_metric_max) {
                showPercent = '<span class="small"> / ' + Math.abs(p) + '% ' + upChar + '</span>';
              } else if (p > 0 && p < t_metric_min) {
                showPercent = '<span class="small"> / ' + Math.abs(p) + '% ' + upChar + '</span>';
              }
            }

            var wc = widgetColor(metric, headers.metrics[0], avg);

            gridster.add_widget("<li class='" + wc + "'>" +
              "<div class='small-widget'>" +
              "<h2 class='widget_size_" + g_size + "'>" + text + "</h2>" +
              "<h1 class='widget_size_" + g_size + "'>" + metric + "" + showPercent + "</h1>" +
              "<span class='inlinesparkline'>" + arr[i][2] + "</span></div></li>", 2, 1);
          }

          $('.inlinesparkline').sparkline('html', {
            type: localStorage.getItem('g_chart_type'),
            lineColor: 'rgba(255, 255, 255, 0.7)',
            fillColor: null,
            barColor: 'rgba(255,255,255,0.7)',
            spotColor: null,
            minSpotColor: null,
            maxSpotColor: null,
            width: '' + (g_size * 2) - 5 + '',
            height: 25 + (g_size - 80) / 4,
            lineWidth: 1,
            normalRangeMin: 0,
            normalRangeMax: avg,
            normalRangeColor: 'rgba(255, 255, 255, 0.3)',
            barWidth: Math.round(((g_size * 2) - (arr[0][2].length - 1) * 1) / arr[0][2].length),
          });

          function widgetColor(data, type, avg) {
            avg = parseInt(avg);
            var availColor = "ok";
            if (type == ' % Availability') {
              if (data == 100) {
                availColor = 'ok';
              } else if (data < 100 && data >= t_availability) {
                availColor = 'warning';
              } else if (data < t_availability) {
                availColor = 'critical';
              }
            } else {
              if (data <= avg) {
                availColor = 'ok';
              } else if (data > (avg + (avg * (t_metric_min / 100))) && data <= (avg + (avg * (t_metric_max / 100)))) {
                availColor = 'warning';
              } else if (data > (avg + (avg * (t_metric_max / 100)))) {
                availColor = 'critical';
              }
            }
            return availColor;
          }

          function gridPrefs(id, val, remove) {
            if (localStorage.getItem(id)) {
              $('#' + id).val(localStorage.getItem(id));
            } else {
                if (remove == true) {
                    localStorage.removeItem(id);
                } else {
                    localStorage.setItem(id, val);
                }
            }
          }

        });
</script>
    <style>
        .gridster * {
            margin: 0;
            padding: 0;
            font-family: 'Open Sans', "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #fff;
        }

        .gridster ul {
            list-style-type: none;
        }

        .gridster li {
            font-size: 1em;
            font-weight: 700;
            text-align: center;
            line-height: 100%;
        }

        .gridster {
            margin: 0 auto;
        }

        .gridster .gs-w {
            background: #DDD;
            cursor: pointer;
            z-index: 2;
            position: absolute;
        }

        .gridster .player {
            background: #BBB;
        }

        .gridster .preview-holder {
            border: none !important;
            background: grey !important;
        }

        .gridster .player-revert {
            z-index: 10 !important;
            -webkit-transition: left .3s, top .3s !important;
            -moz-transition: left .3s, top .3s !important;
            -o-transition: left .3s, top .3s !important;
            transition: left .3s, top .3s !important;
        }

        .gridster .critical {
            background-color: #F44336;
        }

        .gridster .ok {
            background-color: #8BC34A;
        }

        .gridster .warning {
            background-color: #FF9800;
        }

        .gridster .default {
            background-color: #4b4b4b;
        }

        .gridster h2 {
            color: rgba(255, 255, 255, 0.7);
        }

        .gridster h2.widget_size_80 {
          font-size: 12px;
          line-height: 14px;
        }

        .gridster h2.widget_size_100 {
          font-size: 18px;
          line-height: 22px;
        }

        .gridster h2.widget_size_120 {
          font-size: 22px;
          line-height: 28px;
        }

        .gridster .widgetText {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            line-height: 14px;
            font-weight: 400;
        }

        .gridster h1 {
            color: rgba(255, 255, 255);
        }

        .gridster h1.widget_size_80 {
          font-size: 20px;
          line-height: 30px;
        }

        .gridster h1.widget_size_100 {
          font-size: 25px;
          line-height: 35px;
        }

        .gridster h1.widget_size_120 {
          font-size: 28px;
          line-height: 40px;
        }

        .gridster .large_80 {
            color: rgba(255, 255, 255);
            font-size: 35px;
            line-height: 80px;
        }

        .gridster .large_100 {
            color: rgba(255, 255, 255);
            font-size: 45px;
            line-height: 100px;
        }

        .gridster .large_120 {
            color: rgba(255, 255, 255);
            font-size: 55px;
            line-height: 120px;
        }

        div .big-widget {
            padding-top: 28px;
            text-align: center;
            width: 100%;
        }

        div .small-widget {
            padding: 5px 0 0 4px;
            text-align: left;
            width: 100%;
        }

        div .g_chart_type {
            padding: 5px;
        }

        .gridster .small {
            font-size: 14px;
        }

        div .g_chart_type select,
        div .g_chart_type input {
            vertical-align: middle;
        }

        .inlinesparkline {
          position: absolute;
          bottom: 5px;
}
</style>
