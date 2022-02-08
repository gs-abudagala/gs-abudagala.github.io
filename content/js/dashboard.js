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

    var data = {"OkPercent": 86.97395921595209, "KoPercent": 13.026040784047902};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.38614924024176694, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.979, 500, 1500, "C360 Revamp Feature Evalute Call"], "isController": false}, {"data": [0.002, 500, 1500, "Preview R360 Assignment"], "isController": false}, {"data": [0.074, 500, 1500, "Get R360 BootStrap Config"], "isController": false}, {"data": [0.572, 500, 1500, "Get Relationship Pre-Config"], "isController": false}, {"data": [0.121, 500, 1500, "Get Layouts Under Relationship"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Global Sections Under Relationsihp"], "isController": false}, {"data": [0.472, 500, 1500, "Resolve Cid c360"], "isController": false}, {"data": [0.089, 500, 1500, "Get All Object Association"], "isController": false}, {"data": [0.81, 500, 1500, "Get SummaryRibbon Config for Preconfig"], "isController": false}, {"data": [0.242, 500, 1500, "RelationshipSearch"], "isController": false}, {"data": [0.11, 500, 1500, "Get R360 Assignment under Layout"], "isController": false}, {"data": [0.475, 500, 1500, "Preview Assignment For an Company and User"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Global Section under Company"], "isController": false}, {"data": [0.0, 500, 1500, "EmbedPage Global Section"], "isController": false}, {"data": [0.069, 500, 1500, "Get Relationship PreConfig"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Layout under R360"], "isController": false}, {"data": [0.17346938775510204, 500, 1500, "Adding BM sections under Layout"], "isController": false}, {"data": [1.0, 500, 1500, "Get all relationship Layouts"], "isController": false}, {"data": [0.068, 500, 1500, "Get Relaitonship types"], "isController": false}, {"data": [0.105, 500, 1500, "R360 Consumption "], "isController": false}, {"data": [0.5, 500, 1500, "Get all company Layouts under c360"], "isController": false}, {"data": [0.0, 500, 1500, "C360 Company Messenger call"], "isController": false}, {"data": [0.759, 500, 1500, "Get Company Layout Info "], "isController": false}, {"data": [0.784, 500, 1500, "C360 consumption "], "isController": false}, {"data": [0.25, 500, 1500, "Create R360 Custom Layout"], "isController": false}, {"data": [0.0, 500, 1500, "Update EmbedPage Global Section"], "isController": false}, {"data": [0.953, 500, 1500, "Company Search"], "isController": false}, {"data": [0.311, 500, 1500, "C360 Boot Strap API"], "isController": false}, {"data": [0.0, 500, 1500, "C360 Messenger Tenant request"], "isController": false}, {"data": [0.0, 500, 1500, "R360 Messenger TenantId Request"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Layout from C360"], "isController": false}, {"data": [0.768, 500, 1500, "Get Assignment under Layout"], "isController": false}, {"data": [0.29591836734693877, 500, 1500, "Create C360 Assignment"], "isController": false}, {"data": [0.186, 500, 1500, "Get Relationship Manage Assignments"], "isController": false}, {"data": [0.946, 500, 1500, "Search Config Call"], "isController": false}, {"data": [0.04081632653061224, 500, 1500, "Update Summary Global Section"], "isController": false}, {"data": [0.30612244897959184, 500, 1500, "Create Attribute Global section"], "isController": false}, {"data": [0.04081632653061224, 500, 1500, "Global Summary Section"], "isController": false}, {"data": [0.0, 500, 1500, "Hierarchy Global Section"], "isController": false}, {"data": [0.483, 500, 1500, "Get R360 Layout State Call"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "Adding sections under Rel Layout"], "isController": false}, {"data": [0.0, 500, 1500, "R360 Relationship Messenger Call"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "Create R360 Assignment"], "isController": false}, {"data": [0.0, 500, 1500, "Udpate Global Hierarchy Section"], "isController": false}, {"data": [0.741, 500, 1500, "Get Company Manage Assignments"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.1836734693877551, 500, 1500, "Update Gloabl Attribute Section"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Configured Global Sections"], "isController": false}, {"data": [0.5, 500, 1500, "Get Relationship Types"], "isController": false}, {"data": [0.984, 500, 1500, "C360 Layout Listing State Call"], "isController": false}, {"data": [0.159, 500, 1500, "Get Global Sections for Relationship"], "isController": false}, {"data": [0.658, 500, 1500, "Get Global Sections Under Company"], "isController": false}, {"data": [0.291, 500, 1500, "R360 Externalsharing Layout"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.448, 500, 1500, "Get Layouts Under Company"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "C360 Custom Layout Creation"], "isController": false}, {"data": [0.0, 500, 1500, "AuthToken"], "isController": false}, {"data": [0.497, 500, 1500, "C360 Externalsharing Layout"], "isController": false}, {"data": [0.185, 500, 1500, "Get Relationship Layout info"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17703, 2306, 13.026040784047902, 2580.976727108401, 0, 120426, 821.0, 6799.600000000002, 10008.8, 19352.96, 49.65221293543502, 259.63951877331436, 128.83831462195687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["C360 Revamp Feature Evalute Call", 500, 0, 0.0, 366.0879999999999, 329, 1324, 341.0, 374.90000000000003, 436.95, 1154.7600000000002, 9.94431185361973, 34.562310436555286, 25.618256513524262], "isController": false}, {"data": ["Preview R360 Assignment", 500, 0, 0.0, 10129.198000000002, 1075, 41529, 8566.0, 18691.2, 23262.149999999998, 34973.54, 3.693444136657433, 11.632184903047092, 10.045158125577101], "isController": false}, {"data": ["Get R360 BootStrap Config", 500, 0, 0.0, 4315.86, 1272, 24414, 3457.0, 8349.300000000001, 10332.15, 20218.240000000023, 6.942997986530584, 33.426738353120875, 17.57446365340554], "isController": false}, {"data": ["Get Relationship Pre-Config", 500, 0, 0.0, 721.1779999999997, 445, 3718, 604.5, 1068.3000000000009, 1297.0499999999997, 3005.1100000000024, 3.2057652482224035, 10.446912727849766, 8.105201394187306], "isController": false}, {"data": ["Get Layouts Under Relationship", 500, 0, 0.0, 4539.806, 450, 23020, 3666.0, 9669.900000000001, 12165.3, 16395.020000000004, 6.47090036107624, 68.38322380660419, 16.385785777608096], "isController": false}, {"data": ["Get all Global Sections Under Relationsihp", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 7.680464764030612, 6.442323022959183], "isController": false}, {"data": ["Resolve Cid c360", 500, 0, 0.0, 816.332, 483, 3428, 685.0, 1236.0000000000005, 1630.1, 2543.330000000001, 3.1928684091213864, 29.31758499216151, 8.446758320615075], "isController": false}, {"data": ["Get All Object Association", 500, 0, 0.0, 5764.394000000005, 455, 37861, 4326.5, 12218.500000000007, 15587.649999999996, 23551.20000000001, 4.250255015300918, 12.796422082199932, 10.74600608849031], "isController": false}, {"data": ["Get SummaryRibbon Config for Preconfig", 500, 0, 0.0, 582.804, 325, 5018, 396.0, 1042.8000000000006, 1546.9999999999998, 2624.9900000000007, 3.170275496940684, 32.673490849792344, 8.03404776812605], "isController": false}, {"data": ["RelationshipSearch", 500, 1, 0.2, 2240.787999999997, 395, 4970, 2603.5, 3636.7000000000003, 3904.6499999999996, 4346.990000000002, 3.6864184969734506, 16.125316110386116, 9.806449204839529], "isController": false}, {"data": ["Get R360 Assignment under Layout", 500, 0, 0.0, 6585.4860000000035, 343, 50203, 4911.0, 14449.7, 19783.1, 31870.64000000001, 3.760416353298637, 12.522480239012063, 9.59199952618754], "isController": false}, {"data": ["Preview Assignment For an Company and User", 500, 0, 0.0, 842.4139999999999, 461, 2988, 680.5, 1476.8000000000004, 1853.9499999999996, 2503.2000000000007, 3.1504795029803536, 9.922164450304336, 8.562289508588208], "isController": false}, {"data": ["Get all Global Section under Company", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 32.071141412466844, 6.685697115384615], "isController": false}, {"data": ["EmbedPage Global Section", 49, 49, 100.0, 573.061224489796, 368, 1697, 497.0, 865.0, 1278.5, 1697.0, 9.655172413793103, 29.568965517241377, 26.202855603448274], "isController": false}, {"data": ["Get Relationship PreConfig", 500, 0, 0.0, 6663.254000000001, 456, 39433, 5361.0, 13232.600000000004, 16795.949999999997, 28947.21000000002, 3.6828071829471294, 12.001491767084543, 9.311316207666133], "isController": false}, {"data": ["Delete Layout under R360", 18, 0, 0.0, 817.388888888889, 735, 1091, 769.0, 1066.7, 1091.0, 1091.0, 1.223075355031596, 3.684753388937963, 3.2117672164843376], "isController": false}, {"data": ["Adding BM sections under Layout", 49, 0, 0.0, 1890.0204081632655, 891, 4819, 1768.0, 2655.0, 2947.5, 4819.0, 4.85629335976214, 23.124303146679882, 22.93460418731417], "isController": false}, {"data": ["Get all relationship Layouts", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 24.40793344665272, 5.297545109832636], "isController": false}, {"data": ["Get Relaitonship types", 500, 0, 0.0, 6413.951999999999, 456, 35180, 5026.0, 13651.100000000002, 17923.749999999996, 25805.46000000001, 3.7396598405409045, 12.21232666676639, 9.447753913554024], "isController": false}, {"data": ["R360 Consumption ", 500, 0, 0.0, 6193.553999999997, 348, 38038, 4773.5, 12454.300000000005, 16416.8, 25521.510000000006, 3.688702978258785, 15.687794404606452, 9.358642907730783], "isController": false}, {"data": ["Get all company Layouts under c360", 1, 0, 0.0, 1323.0, 1323, 1323, 1323.0, 1323.0, 1323.0, 1323.0, 0.7558578987150416, 3.9948270975056692, 1.9103127362055934], "isController": false}, {"data": ["C360 Company Messenger call", 500, 500, 100.0, 346.34600000000023, 319, 1479, 332.0, 358.0, 402.74999999999994, 576.95, 3.205087114267766, 9.671600764733785, 8.172346147805797], "isController": false}, {"data": ["Get Company Layout Info ", 500, 0, 0.0, 658.7800000000002, 342, 3724, 444.0, 1242.6000000000001, 1764.6999999999998, 3008.2800000000016, 3.16181538792313, 14.323017531871098, 8.05274856611672], "isController": false}, {"data": ["C360 consumption ", 500, 0, 0.0, 606.928, 344, 4273, 435.0, 1012.9000000000003, 1412.1, 3037.2000000000016, 3.179286313808276, 13.521281149057659, 8.06619711257217], "isController": false}, {"data": ["Create R360 Custom Layout", 18, 0, 0.0, 1777.3888888888887, 730, 4702, 1647.0, 3253.9000000000024, 4702.0, 4702.0, 1.3166556945358787, 4.577435813034891, 3.706951530612245], "isController": false}, {"data": ["Update EmbedPage Global Section", 49, 49, 100.0, 465.3061224489796, 324, 2970, 390.0, 532.0, 765.0, 2970.0, 7.408527366192924, 23.36869471953432, 30.328658905352285], "isController": false}, {"data": ["Company Search", 500, 2, 0.4, 447.85800000000023, 354, 1924, 416.0, 481.90000000000003, 545.6999999999999, 1410.850000000001, 3.1782152414490117, 14.09889180600492, 8.55386836468113], "isController": false}, {"data": ["C360 Boot Strap API", 500, 0, 0.0, 1644.2319999999995, 1268, 5474, 1410.0, 2315.7000000000003, 2725.85, 4174.030000000004, 9.761621210050565, 54.13695981628629, 24.709103687940495], "isController": false}, {"data": ["C360 Messenger Tenant request", 500, 500, 100.0, 353.5080000000001, 324, 1308, 338.0, 368.0, 433.95, 663.9100000000001, 3.2051898433944244, 9.806503690776104, 8.213298973698212], "isController": false}, {"data": ["R360 Messenger TenantId Request", 500, 500, 100.0, 2128.5, 326, 4955, 2377.0, 3549.000000000001, 3860.95, 4504.520000000002, 3.68916565829472, 11.287261726013044, 9.45348699938022], "isController": false}, {"data": ["Delete Layout from C360", 5, 0, 0.0, 834.8, 752, 1079, 780.0, 1079.0, 1079.0, 1079.0, 1.1978917105893627, 3.6088827413751794, 3.0965032792285574], "isController": false}, {"data": ["Get Assignment under Layout", 500, 0, 0.0, 641.4719999999995, 338, 3273, 445.0, 1182.7000000000007, 1606.5499999999984, 2801.86, 3.166140032041337, 10.543493661387656, 8.076130628605442], "isController": false}, {"data": ["Create C360 Assignment", 49, 0, 0.0, 1455.142857142857, 612, 4391, 1383.0, 2121.0, 2436.5, 4391.0, 4.912280701754386, 19.773848684210527, 18.876781798245613], "isController": false}, {"data": ["Get Relationship Manage Assignments", 500, 0, 0.0, 4640.012000000001, 339, 22287, 3679.5, 10313.900000000001, 13707.049999999996, 17888.850000000006, 5.116764567428723, 15.405258946662846, 13.011772396078511], "isController": false}, {"data": ["Search Config Call", 500, 9, 1.8, 2469.2599999999998, 347, 120426, 368.0, 418.80000000000007, 1009.9999999999975, 119631.44, 3.05470363265356, 13.373420909140895, 7.711336807040482], "isController": false}, {"data": ["Update Summary Global Section", 49, 37, 75.51020408163265, 765.061224489796, 332, 2286, 453.0, 1802.0, 2263.5, 2286.0, 9.182908545727138, 33.65004509464018, 54.43951608180284], "isController": false}, {"data": ["Create Attribute Global section", 49, 12, 24.489795918367346, 1269.8571428571427, 464, 4161, 1066.0, 2157.0, 3072.0, 4161.0, 7.330939557151407, 24.343055711400357, 19.8880371970377], "isController": false}, {"data": ["Global Summary Section", 49, 37, 75.51020408163265, 970.1224489795923, 390, 3210, 796.0, 1593.0, 2369.5, 3210.0, 8.189871302022397, 25.75722359184356, 22.1782354692462], "isController": false}, {"data": ["Hierarchy Global Section", 49, 49, 100.0, 579.8367346938776, 383, 2895, 497.0, 741.0, 1139.0, 2895.0, 7.303622000298107, 22.367342375912955, 19.920914303547473], "isController": false}, {"data": ["Get R360 Layout State Call", 500, 0, 0.0, 1508.4059999999997, 333, 4157, 1042.0, 3357.2000000000003, 3557.65, 3997.88, 6.276360715003013, 25.82250481318412, 16.07091581517373], "isController": false}, {"data": ["Adding sections under Rel Layout", 18, 0, 0.0, 1874.9444444444443, 1077, 5323, 1430.0, 4082.800000000002, 5323.0, 5323.0, 1.2012012012012012, 4.938532282282282, 4.644097222222222], "isController": false}, {"data": ["R360 Relationship Messenger Call", 500, 500, 100.0, 2011.9980000000007, 323, 4885, 2163.0, 3392.6000000000004, 3864.25, 4040.9300000000003, 3.6884308677402458, 11.130128302067735, 9.404778316083771], "isController": false}, {"data": ["Create R360 Assignment", 18, 0, 0.0, 2360.4444444444443, 855, 6969, 1617.0, 6717.900000000001, 6969.0, 6969.0, 0.8650519031141869, 3.5125838019031144, 3.354610456314879], "isController": false}, {"data": ["Udpate Global Hierarchy Section", 49, 49, 100.0, 637.1632653061225, 328, 2592, 434.0, 1243.0, 2551.5, 2592.0, 6.483196612860546, 20.4499268159566, 30.97879006516274], "isController": false}, {"data": ["Get Company Manage Assignments", 500, 0, 0.0, 671.0039999999999, 336, 4930, 454.5, 1188.5000000000005, 1905.399999999999, 2879.1600000000017, 3.1504993541476325, 9.48534131722378, 7.996238106864937], "isController": false}, {"data": ["JSR223 Sampler", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 0.0, 0.0], "isController": false}, {"data": ["Update Gloabl Attribute Section", 49, 12, 24.489795918367346, 1426.7959183673465, 368, 3971, 1175.0, 2572.0, 3640.0, 3971.0, 7.209062821833162, 29.714108706046787, 36.17462207591585], "isController": false}, {"data": ["Delete Configured Global Sections", 20, 0, 0.0, 783.0500000000001, 730, 1100, 746.5, 1018.8000000000005, 1097.1499999999999, 1100.0, 1.2768945923514015, 3.846894352933665, 3.2820181319032113], "isController": false}, {"data": ["Get Relationship Types", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 4.751124526515151, 3.8219105113636362], "isController": false}, {"data": ["C360 Layout Listing State Call", 500, 0, 0.0, 369.0140000000003, 331, 1445, 347.0, 385.80000000000007, 455.95, 1177.4700000000041, 9.945103031267404, 39.61524960343901, 25.464902488264777], "isController": false}, {"data": ["Get Global Sections for Relationship", 500, 0, 0.0, 4809.698000000002, 353, 37264, 3874.5, 9513.900000000003, 12239.349999999999, 20214.85, 4.7149350281953115, 14.195453800709126, 11.907052717688549], "isController": false}, {"data": ["Get Global Sections Under Company", 500, 0, 0.0, 768.9559999999993, 360, 5365, 570.5, 1490.500000000001, 1814.0499999999997, 3161.94, 3.134344263836563, 73.32100523905643, 7.900139204064618], "isController": false}, {"data": ["R360 Externalsharing Layout", 500, 0, 0.0, 2077.5859999999975, 327, 4857, 2183.5, 3651.000000000001, 3896.9, 4332.59, 3.687669171823257, 11.102621149151469, 9.374026224859316], "isController": false}, {"data": ["Debug Sampler", 60, 0, 0.0, 0.016666666666666666, 0, 1, 0.0, 0.0, 0.0, 1.0, 0.27533671385632014, 1.138820253883395, 0.0], "isController": false}, {"data": ["Get Layouts Under Company", 500, 0, 0.0, 1058.4100000000003, 352, 5548, 792.0, 1754.3000000000013, 2335.7499999999995, 4533.130000000003, 3.134147793873368, 63.37902439268051, 7.921068838422145], "isController": false}, {"data": ["C360 Custom Layout Creation", 49, 0, 0.0, 1517.30612244898, 739, 5050, 1440.0, 2320.0, 2447.5, 5050.0, 5.083514887436456, 17.196577705156137, 13.880378540305012], "isController": false}, {"data": ["AuthToken", 1, 0, 0.0, 2247.0, 2247, 2247, 2247.0, 2247.0, 2247.0, 2247.0, 0.4450378282153983, 3.234781792389853, 0.18210043947485538], "isController": false}, {"data": ["C360 Externalsharing Layout", 500, 0, 0.0, 607.6899999999999, 517, 2032, 586.0, 662.9000000000001, 742.95, 902.7900000000002, 3.2000409605242948, 13.412671682197534, 8.134479121332754], "isController": false}, {"data": ["Get Relationship Layout info", 500, 0, 0.0, 5958.853999999995, 348, 37280, 4271.0, 13746.000000000005, 17282.15, 25551.420000000002, 3.7855558331629835, 15.5427233099386, 9.641337512586974], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 1000, 43.365134431916736, 5.648760097158673], "isController": false}, {"data": ["500", 1304, 56.548135299219425, 7.36598316669491], "isController": false}, {"data": ["503", 2, 0.08673026886383348, 0.011297520194317347], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17703, 2306, "500", 1304, "400", 1000, "503", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["RelationshipSearch", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["EmbedPage Global Section", 49, 49, "500", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["C360 Company Messenger call", 500, 500, "500", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update EmbedPage Global Section", 49, 49, "500", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Company Search", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["C360 Messenger Tenant request", 500, 500, "400", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["R360 Messenger TenantId Request", 500, 500, "400", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Config Call", 500, 9, "500", 7, "503", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Update Summary Global Section", 49, 37, "500", 37, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Create Attribute Global section", 49, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Global Summary Section", 49, 37, "500", 37, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Hierarchy Global Section", 49, 49, "500", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["R360 Relationship Messenger Call", 500, 500, "500", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Udpate Global Hierarchy Section", 49, 49, "500", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Gloabl Attribute Section", 49, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
