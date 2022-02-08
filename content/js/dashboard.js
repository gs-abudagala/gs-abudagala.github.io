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

    var data = {"OkPercent": 92.07920792079207, "KoPercent": 7.920792079207921};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7168316831683168, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "C360 Revamp Feature Evalute Call"], "isController": false}, {"data": [0.5, 500, 1500, "Create Assignment-1"], "isController": false}, {"data": [1.0, 500, 1500, "Create Assignment-3"], "isController": false}, {"data": [1.0, 500, 1500, "Create Assignment-2"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "Preview R360 Assignment"], "isController": false}, {"data": [0.5, 500, 1500, "Get R360 BootStrap Config"], "isController": false}, {"data": [1.0, 500, 1500, "Get Relationship Pre-Config"], "isController": false}, {"data": [1.0, 500, 1500, "Create Assignment-5"], "isController": false}, {"data": [0.5, 500, 1500, "Create Assignment-4"], "isController": false}, {"data": [0.9, 500, 1500, "Get Layouts Under Relationship"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Global Sections Under Relationsihp"], "isController": false}, {"data": [0.8, 500, 1500, "Resolve Cid c360"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Get All Object Association"], "isController": false}, {"data": [1.0, 500, 1500, "Get SummaryRibbon Config for Preconfig"], "isController": false}, {"data": [1.0, 500, 1500, "RelationshipSearch"], "isController": false}, {"data": [1.0, 500, 1500, "Get R360 Assignment under Layout"], "isController": false}, {"data": [0.6, 500, 1500, "Preview Assignment For an Company and User"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Global Section under Company"], "isController": false}, {"data": [0.5, 500, 1500, "EmbedPage Global Section"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Get Relationship PreConfig"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Layout under R360"], "isController": false}, {"data": [0.5, 500, 1500, "Adding BM sections under Layout"], "isController": false}, {"data": [0.5, 500, 1500, "Get all relationship Layouts"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Get Relaitonship types"], "isController": false}, {"data": [1.0, 500, 1500, "R360 Consumption "], "isController": false}, {"data": [0.5, 500, 1500, "Get all company Layouts under c360"], "isController": false}, {"data": [0.0, 500, 1500, "C360 Company Messenger call"], "isController": false}, {"data": [1.0, 500, 1500, "Get Company Layout Info "], "isController": false}, {"data": [1.0, 500, 1500, "C360 consumption "], "isController": false}, {"data": [0.5, 500, 1500, "Create R360 Custom Layout"], "isController": false}, {"data": [0.5, 500, 1500, "Update EmbedPage Global Section"], "isController": false}, {"data": [1.0, 500, 1500, "Company Search"], "isController": false}, {"data": [0.5, 500, 1500, "C360 Boot Strap API"], "isController": false}, {"data": [0.0, 500, 1500, "C360 Messenger Tenant request"], "isController": false}, {"data": [0.0, 500, 1500, "R360 Messenger TenantId Request"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Layout from C360"], "isController": false}, {"data": [0.9, 500, 1500, "Get Assignment under Layout"], "isController": false}, {"data": [1.0, 500, 1500, "Get Relationship Manage Assignments"], "isController": false}, {"data": [0.9, 500, 1500, "Search Config Call"], "isController": false}, {"data": [0.5, 500, 1500, "Update Summary Global Section"], "isController": false}, {"data": [0.5, 500, 1500, "Create Attribute Global section"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-6"], "isController": false}, {"data": [0.5, 500, 1500, "Global Summary Section"], "isController": false}, {"data": [0.5, 500, 1500, "Hierarchy Global Section"], "isController": false}, {"data": [1.0, 500, 1500, "Get R360 Layout State Call"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "Adding sections under Rel Layout"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-5"], "isController": false}, {"data": [0.0, 500, 1500, "R360 Relationship Messenger Call"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-4"], "isController": false}, {"data": [0.5, 500, 1500, "Create R360 Assignment-3"], "isController": false}, {"data": [1.0, 500, 1500, "Create R360 Assignment-2"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-1"], "isController": false}, {"data": [0.5, 500, 1500, "Udpate Global Hierarchy Section"], "isController": false}, {"data": [1.0, 500, 1500, "Get Company Manage Assignments"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Update Gloabl Attribute Section"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-9"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-8"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Configured Global Sections"], "isController": false}, {"data": [0.75, 500, 1500, "Create R360 Assignment-7"], "isController": false}, {"data": [0.5, 500, 1500, "Get Relationship Types"], "isController": false}, {"data": [1.0, 500, 1500, "C360 Layout Listing State Call"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Get Global Sections for Relationship"], "isController": false}, {"data": [1.0, 500, 1500, "Get Global Sections Under Company"], "isController": false}, {"data": [1.0, 500, 1500, "R360 Externalsharing Layout"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "C360 Custom Layout Creation"], "isController": false}, {"data": [1.0, 500, 1500, "Get Layouts Under Company"], "isController": false}, {"data": [0.0, 500, 1500, "AuthToken"], "isController": false}, {"data": [0.5, 500, 1500, "C360 Externalsharing Layout"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Get Relationship Layout info"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 505, 40, 7.920792079207921, 570.223762376238, 0, 2165, 457.0, 1075.6000000000001, 1187.5, 1430.6799999999998, 6.6809546488860665, 27.693120311755838, 18.13427261519686], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["C360 Revamp Feature Evalute Call", 5, 0, 0.0, 399.4, 321, 614, 351.0, 614.0, 614.0, 614.0, 1.1125945705384956, 3.866918043502448, 2.8662348408989766], "isController": false}, {"data": ["Create Assignment-1", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 6.279860569422777, 5.994966361154446], "isController": false}, {"data": ["Create Assignment-3", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 9.584263392857142, 9.149460565476192], "isController": false}, {"data": ["Create Assignment-2", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 9.86615349264706, 9.418562346813726], "isController": false}, {"data": ["Preview R360 Assignment", 15, 0, 0.0, 1064.0666666666666, 819, 2165, 905.0, 1725.2000000000003, 2165.0, 2165.0, 2.7891409445890667, 8.784159713183339, 7.585700713555225], "isController": false}, {"data": ["Get R360 BootStrap Config", 15, 0, 0.0, 1230.6, 1184, 1474, 1221.0, 1336.0, 1474.0, 1474.0, 2.5505866349260327, 12.279679795102874, 6.456172419656521], "isController": false}, {"data": ["Get Relationship Pre-Config", 5, 0, 0.0, 479.8, 463, 499, 476.0, 499.0, 499.0, 499.0, 1.150483202945237, 3.749182078347906, 2.9087900511965024], "isController": false}, {"data": ["Create Assignment-5", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 11.119863604972377, 10.615396236187845], "isController": false}, {"data": ["Create Assignment-4", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 5.4397170608108105, 5.192937077702703], "isController": false}, {"data": ["Get Layouts Under Relationship", 15, 0, 0.0, 504.0, 439, 790, 471.0, 735.4000000000001, 790.0, 790.0, 2.93140512018761, 11.376371042603088, 7.422981910787571], "isController": false}, {"data": ["Get all Global Sections Under Relationsihp", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 7.307626668689321, 6.129588895631068], "isController": false}, {"data": ["Resolve Cid c360", 5, 0, 0.0, 514.4, 488, 573, 500.0, 573.0, 573.0, 573.0, 1.11333778668448, 10.221180207637499, 2.945343812625251], "isController": false}, {"data": ["Get All Object Association", 15, 0, 0.0, 510.0, 435, 1036, 476.0, 712.6000000000001, 1036.0, 1036.0, 2.920560747663551, 8.793055454147195, 7.384113062207944], "isController": false}, {"data": ["Get SummaryRibbon Config for Preconfig", 5, 0, 0.0, 331.2, 317, 343, 339.0, 343.0, 343.0, 343.0, 1.1446886446886448, 11.796105912316849, 2.9008467118818677], "isController": false}, {"data": ["RelationshipSearch", 15, 0, 0.0, 419.6666666666667, 383, 477, 412.0, 477.0, 477.0, 477.0, 3.2658393207054215, 14.284857731874592, 8.68764288047028], "isController": false}, {"data": ["Get R360 Assignment under Layout", 15, 0, 0.0, 341.4666666666667, 325, 364, 336.0, 362.8, 364.0, 364.0, 3.115911923556294, 10.376230136061487, 7.948009711258829], "isController": false}, {"data": ["Preview Assignment For an Company and User", 5, 0, 0.0, 515.2, 468, 560, 507.0, 560.0, 560.0, 560.0, 1.080613788631943, 3.4033002620488437, 2.9368634509401343], "isController": false}, {"data": ["Get all Global Section under Company", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 33.67241753472222, 7.001410590277778], "isController": false}, {"data": ["EmbedPage Global Section", 5, 0, 0.0, 998.6, 778, 1096, 1059.0, 1096.0, 1096.0, 1096.0, 0.9349289454001496, 3.183688703721017, 2.537272987565445], "isController": false}, {"data": ["Get Relationship PreConfig", 15, 0, 0.0, 514.2, 448, 994, 465.0, 792.4000000000001, 994.0, 994.0, 2.9148853478429846, 9.498996489992226, 7.369763833560047], "isController": false}, {"data": ["Delete Layout under R360", 18, 0, 0.0, 771.6666666666666, 726, 890, 759.5, 847.7, 890.0, 890.0, 1.29543001079525, 3.9027359211946746, 3.4017688467074487], "isController": false}, {"data": ["Adding BM sections under Layout", 5, 0, 0.0, 963.2, 757, 1129, 1062.0, 1129.0, 1129.0, 1129.0, 1.027749229188078, 4.893852774922919, 4.853706320657759], "isController": false}, {"data": ["Get all relationship Layouts", 1, 0, 0.0, 789.0, 789, 789, 789.0, 789.0, 789.0, 789.0, 1.2674271229404308, 15.268536121673003, 3.2094126267427123], "isController": false}, {"data": ["Get Relaitonship types", 15, 0, 0.0, 479.4666666666666, 432, 694, 464.0, 583.6, 694.0, 694.0, 2.91601866251944, 9.522623444790046, 7.3669338671267495], "isController": false}, {"data": ["R360 Consumption ", 15, 0, 0.0, 347.53333333333336, 330, 373, 346.0, 371.8, 373.0, 373.0, 3.3624747814391394, 14.300368821452588, 8.530966291190316], "isController": false}, {"data": ["Get all company Layouts under c360", 1, 0, 0.0, 1410.0, 1410, 1410, 1410.0, 1410.0, 1410.0, 1410.0, 0.7092198581560284, 3.755263741134752, 1.7924423758865249], "isController": false}, {"data": ["C360 Company Messenger call", 5, 5, 100.0, 315.8, 308, 326, 314.0, 326.0, 326.0, 326.0, 1.1773016246762422, 3.5525996291499884, 3.001889201200848], "isController": false}, {"data": ["Get Company Layout Info ", 5, 0, 0.0, 346.8, 330, 369, 337.0, 369.0, 369.0, 369.0, 1.1353315168029066, 5.035594417007267, 2.891547456857402], "isController": false}, {"data": ["C360 consumption ", 5, 0, 0.0, 360.0, 329, 403, 348.0, 403.0, 403.0, 403.0, 1.1405109489051093, 4.850512873517335, 2.893601020757299], "isController": false}, {"data": ["Create R360 Custom Layout", 18, 0, 0.0, 858.5555555555557, 707, 1126, 779.0, 1084.6000000000001, 1126.0, 1126.0, 3.1982942430703623, 11.119069829424307, 9.00457256130064], "isController": false}, {"data": ["Update EmbedPage Global Section", 5, 0, 0.0, 967.2, 757, 1103, 1073.0, 1103.0, 1103.0, 1103.0, 0.9859988168014198, 4.331076833957799, 4.105760698087162], "isController": false}, {"data": ["Company Search", 5, 0, 0.0, 436.2, 392, 473, 452.0, 473.0, 473.0, 473.0, 1.1103708638685321, 4.845944717410615, 2.9884590828336663], "isController": false}, {"data": ["C360 Boot Strap API", 5, 0, 0.0, 1247.8, 1206, 1359, 1223.0, 1359.0, 1359.0, 1359.0, 0.954380606986066, 5.292897917064326, 2.41577591143348], "isController": false}, {"data": ["C360 Messenger Tenant request", 5, 5, 100.0, 325.4, 302, 346, 320.0, 346.0, 346.0, 346.0, 1.1750881316098707, 3.5952647620446534, 3.0111633372502937], "isController": false}, {"data": ["R360 Messenger TenantId Request", 15, 15, 100.0, 332.3333333333333, 307, 355, 339.0, 352.0, 355.0, 355.0, 3.373819163292848, 10.322436951754387, 8.645411605937923], "isController": false}, {"data": ["Delete Layout from C360", 5, 0, 0.0, 885.2, 819, 1004, 872.0, 1004.0, 1004.0, 1004.0, 1.12943302462164, 3.402637579060312, 2.9195402501694154], "isController": false}, {"data": ["Get Assignment under Layout", 5, 0, 0.0, 398.4, 320, 639, 351.0, 639.0, 639.0, 639.0, 1.1361054305839582, 3.783319842081345, 2.897956430356737], "isController": false}, {"data": ["Get Relationship Manage Assignments", 15, 0, 0.0, 336.4, 317, 370, 332.0, 369.4, 370.0, 370.0, 2.997601918465228, 9.025006557254198, 7.622808003597123], "isController": false}, {"data": ["Search Config Call", 5, 0, 0.0, 429.0, 349, 671, 372.0, 671.0, 671.0, 671.0, 1.0434056761268782, 4.575089341611019, 2.6339879617070117], "isController": false}, {"data": ["Update Summary Global Section", 5, 0, 0.0, 1025.0, 758, 1144, 1081.0, 1144.0, 1144.0, 1144.0, 0.9201324990798675, 4.81901425055208, 5.5037222235001835], "isController": false}, {"data": ["Create Attribute Global section", 5, 0, 0.0, 864.8, 737, 1044, 785.0, 1044.0, 1044.0, 1044.0, 0.9652509652509653, 3.2860008445945947, 2.6186202944015444], "isController": false}, {"data": ["Create R360 Assignment-6", 2, 0, 0.0, 447.0, 351, 543, 447.0, 543.0, 543.0, 543.0, 0.711997152011392, 2.8910978106087573, 2.761074893200427], "isController": false}, {"data": ["Global Summary Section", 5, 0, 0.0, 884.0, 730, 1126, 753.0, 1126.0, 1126.0, 1126.0, 0.9710623422023694, 3.301042981646922, 2.6296444091085647], "isController": false}, {"data": ["Hierarchy Global Section", 5, 0, 0.0, 1004.0, 738, 1099, 1062.0, 1099.0, 1099.0, 1099.0, 0.9895111814763506, 3.383084615574906, 2.698930400257273], "isController": false}, {"data": ["Get R360 Layout State Call", 15, 0, 0.0, 333.0666666666667, 316, 362, 333.0, 353.0, 362.0, 362.0, 2.9934144881261227, 12.315678943823588, 7.664778113151067], "isController": false}, {"data": ["Adding sections under Rel Layout", 18, 0, 0.0, 982.9444444444443, 772, 1507, 1041.0, 1174.9000000000005, 1507.0, 1507.0, 3.1931878658861095, 13.128243081426291, 12.345537852581161], "isController": false}, {"data": ["Create R360 Assignment-5", 2, 0, 0.0, 458.0, 369, 547, 458.0, 547.0, 547.0, 547.0, 0.7880220646178093, 3.1998005319148937, 3.055894158786446], "isController": false}, {"data": ["R360 Relationship Messenger Call", 15, 15, 100.0, 317.6, 302, 345, 312.0, 339.6, 345.0, 345.0, 3.3768572714993246, 10.189930633723547, 8.610326499887437], "isController": false}, {"data": ["Create R360 Assignment-4", 2, 0, 0.0, 458.0, 349, 567, 458.0, 567.0, 567.0, 567.0, 0.7037297677691766, 2.857527709359606, 2.729014558409571], "isController": false}, {"data": ["Create R360 Assignment-3", 2, 0, 0.0, 732.0, 723, 741, 732.0, 741.0, 741.0, 741.0, 0.5330490405117271, 2.164470615671642, 2.0671266990938166], "isController": false}, {"data": ["Create R360 Assignment-2", 2, 0, 0.0, 354.5, 349, 360, 354.5, 360.0, 360.0, 360.0, 0.8988764044943821, 3.649929775280899, 3.4857794943820224], "isController": false}, {"data": ["Create R360 Assignment-1", 2, 0, 0.0, 479.0, 387, 571, 479.0, 571.0, 571.0, 571.0, 0.7209805335255948, 2.927575252343187, 2.795911815068493], "isController": false}, {"data": ["Udpate Global Hierarchy Section", 5, 0, 0.0, 1002.6, 742, 1079, 1065.0, 1079.0, 1079.0, 1079.0, 0.9962143853357243, 4.860436590954373, 4.830277757023311], "isController": false}, {"data": ["Get Company Manage Assignments", 5, 0, 0.0, 351.6, 339, 377, 347.0, 377.0, 377.0, 377.0, 1.1205737337516808, 3.3737586144105784, 2.8441124355670104], "isController": false}, {"data": ["JSR223 Sampler", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 0.0, 0.0], "isController": false}, {"data": ["Update Gloabl Attribute Section", 5, 0, 0.0, 812.4, 727, 1090, 746.0, 1090.0, 1090.0, 1090.0, 0.9691800736576855, 4.298843647024618, 4.879973105252956], "isController": false}, {"data": ["Create R360 Assignment-9", 2, 0, 0.0, 529.5, 348, 711, 529.5, 711.0, 711.0, 711.0, 0.7779074290159471, 3.158729579929988, 3.01667031310774], "isController": false}, {"data": ["Create R360 Assignment-8", 2, 0, 0.0, 466.5, 353, 580, 466.5, 580.0, 580.0, 580.0, 0.8035355564483728, 3.2627937926878268, 3.116054389312977], "isController": false}, {"data": ["Delete Configured Global Sections", 20, 0, 0.0, 773.4499999999999, 703, 1064, 740.5, 862.8000000000001, 1054.1499999999999, 1064.0, 1.2922400982102475, 3.893125686502552, 3.3214608774310266], "isController": false}, {"data": ["Create R360 Assignment-7", 2, 0, 0.0, 516.0, 400, 632, 516.0, 632.0, 632.0, 632.0, 0.701508242721852, 2.8485071027709576, 2.7203996404770256], "isController": false}, {"data": ["Get Relationship Types", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 5.183044938016529, 4.169356921487603], "isController": false}, {"data": ["C360 Layout Listing State Call", 5, 0, 0.0, 344.2, 324, 376, 333.0, 376.0, 376.0, 376.0, 1.1118523460084502, 4.428950897820769, 2.8469500500333558], "isController": false}, {"data": ["Get Global Sections for Relationship", 15, 0, 0.0, 369.8666666666667, 332, 606, 350.0, 468.0000000000001, 606.0, 606.0, 2.985074626865672, 8.987290111940299, 7.53847947761194], "isController": false}, {"data": ["Get Global Sections Under Company", 5, 0, 0.0, 352.2, 342, 362, 355.0, 362.0, 362.0, 362.0, 1.1180679785330947, 13.518359025603756, 2.8180990747987473], "isController": false}, {"data": ["R360 Externalsharing Layout", 15, 0, 0.0, 324.9333333333333, 302, 351, 324.0, 342.0, 351.0, 351.0, 3.369272237196766, 10.144010065700808, 8.564663704514825], "isController": false}, {"data": ["Debug Sampler", 16, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.23609615015715152, 2.798915248860098, 0.0], "isController": false}, {"data": ["C360 Custom Layout Creation", 5, 0, 0.0, 934.8, 720, 1109, 1036.0, 1109.0, 1109.0, 1109.0, 0.9976057462090981, 3.374713188347965, 2.7239313148443736], "isController": false}, {"data": ["Get Layouts Under Company", 5, 0, 0.0, 352.6, 331, 393, 341.0, 393.0, 393.0, 393.0, 1.1241007194244603, 5.68483201719874, 2.8409889276079134], "isController": false}, {"data": ["AuthToken", 1, 0, 0.0, 1603.0, 1603, 1603, 1603.0, 1603.0, 1603.0, 1603.0, 0.6238303181534622, 4.534344783218964, 0.2552586946350593], "isController": false}, {"data": ["C360 Externalsharing Layout", 5, 0, 0.0, 577.4, 531, 631, 584.0, 631.0, 631.0, 631.0, 1.1103708638685321, 4.654015378636465, 2.8225540611814344], "isController": false}, {"data": ["Get Relationship Layout info", 15, 0, 0.0, 355.6666666666666, 323, 578, 336.0, 458.6000000000001, 578.0, 578.0, 3.0889621087314665, 12.130209405889621, 7.867200370675453], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 20, 50.0, 3.9603960396039604], "isController": false}, {"data": ["500", 20, 50.0, 3.9603960396039604], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 505, 40, "400", 20, "500", 20, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["C360 Company Messenger call", 5, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["C360 Messenger Tenant request", 5, 5, "400", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["R360 Messenger TenantId Request", 15, 15, "400", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["R360 Relationship Messenger Call", 15, 15, "500", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
