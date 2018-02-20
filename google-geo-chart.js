<script type="text/javascript" src="//www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript" src="//www.google.com/jsapi"></script>
<script type="text/javascript" src="//portal.catchpoint.com/ui/js/3genlabs/framework/coordinates.js"></script>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function(event) {

    var selector = CPVisualization.getContainerSelector();

    var summary = CPVisualization.getSummaryData();
    var data = summary.data;
    var theme = CPVisualization.getTheme();

    if (theme == 'dark') {
        mapColor = '#4d4d4d';
    } else {
        mapColor = '#eee';
    }

    var total = new Array();
    var largest = new Array();
    var re = /\[.*\]\s-\s/;

    $(selector).html('<div class="g_chart_type ' + theme +'">' +
        'Region: <select id="g_region">' +
        '<option value="world">Global</option>' +
        '<option value="002">Africa</option>' +
        '<option value="150">Europe</option>' +
        '<option value="021">North America</option>' +
        '<option value="142">Asia</option>' +
        '<option value="009">Oceania</option>' +
        '</select>' +
        ' Acceptable Range: ' +
        '<input type="text" id="g_minRange" name="g_minRange" size="6"/> - ' +
        '<input type="text" id="g_maxRange" name="g_maxRange" size="6"/>' +
        '</div><hr /><div id="geoChart"></div>');

    $(function() {
        $('#g_region').change(function() {
            localStorage.setItem('g_region', this.value);
            location.reload();
        });
        gridPrefs('g_region', "world", false);

        $('#g_minRange').change(function() {
            localStorage.setItem('g_minRange', this.value);
            location.reload();
        });
        gridPrefs('g_minRange', null, true);

        $('#g_maxRange').change(function() {
            localStorage.setItem('g_maxRange', this.value);
            location.reload();
        });
        gridPrefs('g_maxRange', null, true);
    });

    switch (localStorage.getItem('g_region')) {
        case "150":
            region = "Europe";
            break;
        case "002":
            region = "Africa";
            break;
        case "021":
            region = "North America";
            break;
        case "142":
            region = "Asia";
            break;
        case "009":
            region = "Oceania";
            break;
        case "world":
            region = 'World';
            break;
    }

    for (var i = 0; i < data.length; i++) {
        var lat = null;
        var long = null;
        var arr = new Array();
        if (data[i].dimension == region) {
            var extractCityId = data[i].breakdown1.match(/\d+/)[0];

            for (j = 0; j < __cpCoordinates.length; j++) {
                if (extractCityId == __cpCoordinates[j].id) {
                    var lat = __cpCoordinates[j].latitude;
                    var long = __cpCoordinates[j].longitude;
                }
            }

            largest.push(parseInt(data[i].metrics[0]));
            var city = data[i].breakdown1.replace(re, "");
            var test = data[i].breakdown2.replace(re, "");
            arr.push(lat, long, city + ' : ' + test, parseInt(data[i].metrics[0]));
            total.push(arr);

        } else if (region == "World") {
            var extractCityId = data[i].breakdown1.match(/\d+/)[0];
            for (j = 0; j < __cpCoordinates.length; j++) {
                if (extractCityId == __cpCoordinates[j].id) {
                    var lat = __cpCoordinates[j].latitude;
                    var long = __cpCoordinates[j].longitude;
                } 
            }

            largest.push(parseInt(data[i].metrics[0]));
            var city = data[i].breakdown1.replace(re, "");
            var test = data[i].breakdown2.replace(re, "");
            arr.push(lat, long, city + ' : ' + test, parseInt(data[i].metrics[0]));
            total.push(arr);
        }
    }

    if (Object.keys(total).length == 0) {
        $('#geoChart').text('There is no data available!');
        return;
    }

    //var max = (Math.max(...largest));
    var max = Math.max.apply(Math, largest);

    var minRange = localStorage.getItem('g_minRange') ? parseInt(localStorage.getItem('g_minRange')) : 0;
    var maxRange = localStorage.getItem('g_maxRange') ? parseInt(localStorage.getItem('g_maxRange')) : max;

    total.unshift(["Lat", "Long", "City", summary.headers.metrics[0]]);

    google.charts.load('current', {
        'packages': ['geochart']
    });

    google.charts.setOnLoadCallback(drawMarkersMap);

    function drawMarkersMap() {

        var data = google.visualization.arrayToDataTable(total);

        var options = {
            sizeAxis: {
                minValue: 0,
                maxValue: max
            },
            colorAxis: {
              minValue: minRange,
              maxValue: maxRange,
                colors: ['#8BC34A', '#FFC107', '#F44336']
            },
            displayMode: 'markers',
            keepAspectRatio: false,
            enableRegionInteractivity: true,
            backgroundColor: {
                fill: 'transparent'
            },
            datalessRegionColor: mapColor,
            region: localStorage.getItem('g_region'),
            width: $("#geoChart").offsetWidth,
            height: $("#geoChart").offsetHeight - 200
        };

        var chart = new google.visualization.GeoChart(document.getElementById('geoChart'));

        chart.draw(data, options);
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
div .g_chart_type select,
div .g_chart_type input {
    vertical-align: middle;
}

.g_chart_type {
  font-size: 11px;
}

.g_chart_type.dark{
  color: #fff;
}

#geoChart {
  margin: 0 auto;
  height: 700px;
  width: 70vw;
}
</style>
