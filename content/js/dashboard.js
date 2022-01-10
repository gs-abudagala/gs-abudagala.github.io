/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.47368421052632, "KoPercent": 8.526315789473685};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2831578947368421, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3675, 500, 1500, "C360 Revamp Feature Evalute Call"], "isController": false}, {"data": [0.0, 500, 1500, "Search Config Call"], "isController": false}, {"data": [0.0, 500, 1500, "Get Relationship PreConfig"], "isController": false}, {"data": [0.2415, 500, 1500, "C360 Layout Listing State Call"], "isController": false}, {"data": [0.0, 500, 1500, "Get Relaitonship types"], "isController": false}, {"data": [0.3915, 500, 1500, "Get R360 BootStrap Config"], "isController": false}, {"data": [0.105, 500, 1500, "Get Global Sections for Relationship"], "isController": false}, {"data": [0.032, 500, 1500, "Get Global Sections Under Company"], "isController": false}, {"data": [0.0, 500, 1500, "Get Layouts Under Relationship"], "isController": false}, {"data": [0.239, 500, 1500, "Get R360 Layout State Call"], "isController": false}, {"data": [0.0, 500, 1500, "Get All Object Association"], "isController": false}, {"data": [0.9915, 500, 1500, "Get SummaryRibbon Config for Preconfig"], "isController": false}, {"data": [0.882, 500, 1500, "Get Company Layout Info "], "isController": false}, {"data": [0.0755, 500, 1500, "Get Layouts Under Company"], "isController": false}, {"data": [0.397, 500, 1500, "C360 Boot Strap API"], "isController": false}, {"data": [0.569, 500, 1500, "Get Company Manage Assignments"], "isController": false}, {"data": [0.0, 500, 1500, "Preview Assignment For an Company and User"], "isController": false}, {"data": [0.99, 500, 1500, "Get Assignment under Layout"], "isController": false}, {"data": [0.0985, 500, 1500, "Get Relationship Manage Assignments"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19000, 1620, 8.526315789473685, 10802.090736842105, 0, 66429, 2938.0, 29736.9, 60866.75, 63515.98, 128.7908572048317, 158.8052963969063, 660.9463583431904], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["C360 Revamp Feature Evalute Call", 1000, 110, 11.0, 1141.1789999999994, 0, 7346, 870.0, 2346.0, 3690.0, 4533.330000000001, 40.57453542156942, 34.356012385376935, 195.8969476537775], "isController": false}, {"data": ["Search Config Call", 1000, 0, 0.0, 5228.412999999999, 1531, 16993, 4869.5, 7647.0, 8075.849999999999, 10137.62, 36.284470246734394, 57.367731767053705, 193.64709951015965], "isController": false}, {"data": ["Get Relationship PreConfig", 1000, 212, 21.2, 34757.316999999995, 9728, 66429, 26846.0, 63163.7, 63646.9, 64372.22, 10.767623908432126, 4.334936026854455, 57.50794448751494], "isController": false}, {"data": ["C360 Layout Listing State Call", 1000, 180, 18.0, 1476.799, 0, 8405, 1030.5, 3054.9, 4648.699999999998, 6968.260000000002, 42.299395118649805, 44.8800713009179, 186.46845654794637], "isController": false}, {"data": ["Get Relaitonship types", 1000, 0, 0.0, 24737.327999999994, 4656, 55254, 24143.0, 26897.3, 28686.7, 54218.47, 11.635618956750404, 3.8520261975960812, 62.12102425444772], "isController": false}, {"data": ["Get R360 BootStrap Config", 1000, 0, 0.0, 1788.2249999999995, 441, 15632, 874.0, 4534.099999999999, 6825.599999999986, 10888.79, 39.47576188220433, 65.49738226354019, 210.94860255802936], "isController": false}, {"data": ["Get Global Sections for Relationship", 1000, 0, 0.0, 4305.882999999989, 245, 9190, 4621.0, 7506.5, 7776.65, 8151.0, 18.971012293215963, 15.784475072089846, 101.26518866671725], "isController": false}, {"data": ["Get Global Sections Under Company", 1000, 0, 0.0, 4868.715999999993, 374, 9425, 4989.0, 7465.0, 7768.699999999998, 9209.0, 31.529827216546852, 6.496868694034556, 168.14881487261948], "isController": false}, {"data": ["Get Layouts Under Relationship", 1000, 0, 0.0, 15262.655999999999, 2061, 30373, 15295.0, 24085.1, 25749.8, 28000.86, 18.174548362473192, 11.181606902693469, 97.13799139435136], "isController": false}, {"data": ["Get R360 Layout State Call", 1000, 523, 52.3, 591.937000000001, 0, 6972, 1.0, 1882.199999999998, 3042.0, 4879.0, 18.890022290226305, 30.541771742415655, 48.44045525544033], "isController": false}, {"data": ["Get All Object Association", 1000, 595, 59.5, 48555.95099999993, 10124, 65585, 60964.5, 63646.9, 64072.55, 65121.46, 8.848382958014422, 6.642940787727293, 47.25762343494226], "isController": false}, {"data": ["Get SummaryRibbon Config for Preconfig", 1000, 0, 0.0, 252.52199999999976, 218, 861, 233.0, 295.9, 339.94999999999993, 542.95, 15.727474324898166, 117.92533971344542, 84.08976750861079], "isController": false}, {"data": ["Get Company Layout Info ", 1000, 0, 0.0, 471.6139999999997, 231, 1750, 467.0, 574.9, 706.0, 1042.96, 15.573655604179969, 9.520613679899084, 83.46506050365203], "isController": false}, {"data": ["Get Layouts Under Company", 1000, 0, 0.0, 4074.1780000000026, 424, 9243, 3472.5, 7884.0, 8151.0, 9187.85, 35.36818278276862, 32.77773970785881, 188.86056978142463], "isController": false}, {"data": ["C360 Boot Strap API", 1000, 0, 0.0, 1727.3080000000011, 442, 15741, 868.0, 4335.199999999995, 6244.7, 10917.94, 38.99851805631386, 89.688974631464, 208.3983308634272], "isController": false}, {"data": ["Get Company Manage Assignments", 1000, 0, 0.0, 1310.2839999999985, 242, 6223, 597.0, 3791.9, 4609.0, 5944.780000000001, 13.098606308288797, 12.215985375406058, 70.08521871397883], "isController": false}, {"data": ["Preview Assignment For an Company and User", 1000, 0, 0.0, 49737.504, 22074, 65584, 60311.5, 61452.4, 62042.99999999999, 63082.85, 10.75118531818133, 3.695719953124832, 59.45699458677819], "isController": false}, {"data": ["Get Assignment under Layout", 1000, 0, 0.0, 281.8670000000002, 229, 1733, 259.0, 348.9, 408.89999999999986, 540.9300000000001, 15.675209655929146, 8.220300376205032, 84.07055803746375], "isController": false}, {"data": ["Get Relationship Manage Assignments", 1000, 0, 0.0, 4670.042999999998, 248, 10299, 4962.0, 7398.7, 7894.0, 9367.650000000001, 19.095630919645583, 7.421934673846623, 102.26605465169568], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 813, 50.18518518518518, 4.278947368421052], "isController": false}, {"data": ["500/Internal Server Error", 807, 49.81481481481482, 4.247368421052632], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19000, 1620, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 813, "500/Internal Server Error", 807, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["C360 Revamp Feature Evalute Call", 1000, 110, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 110, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Relationship PreConfig", 1000, 212, "500/Internal Server Error", 212, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["C360 Layout Listing State Call", 1000, 180, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 180, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get R360 Layout State Call", 1000, 523, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 523, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Get All Object Association", 1000, 595, "500/Internal Server Error", 595, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
