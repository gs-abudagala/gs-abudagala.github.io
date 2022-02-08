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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6475247524752475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 500, 1500, "C360 Revamp Feature Evalute Call"], "isController": false}, {"data": [0.5, 500, 1500, "Preview R360 Assignment"], "isController": false}, {"data": [0.4, 500, 1500, "Get R360 BootStrap Config"], "isController": false}, {"data": [1.0, 500, 1500, "Get Relationship Pre-Config"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "Get Layouts Under Relationship"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Global Sections Under Relationsihp"], "isController": false}, {"data": [0.5, 500, 1500, "Resolve Cid c360"], "isController": false}, {"data": [0.7, 500, 1500, "Get All Object Association"], "isController": false}, {"data": [1.0, 500, 1500, "Get SummaryRibbon Config for Preconfig"], "isController": false}, {"data": [0.8, 500, 1500, "RelationshipSearch"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Get R360 Assignment under Layout"], "isController": false}, {"data": [0.6, 500, 1500, "Preview Assignment For an Company and User"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Global Section under Company"], "isController": false}, {"data": [0.5, 500, 1500, "EmbedPage Global Section"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Get Relationship PreConfig"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Layout under R360"], "isController": false}, {"data": [0.5, 500, 1500, "Adding BM sections under Layout"], "isController": false}, {"data": [0.5, 500, 1500, "Get all relationship Layouts"], "isController": false}, {"data": [0.8, 500, 1500, "Get Relaitonship types"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "R360 Consumption "], "isController": false}, {"data": [0.0, 500, 1500, "Get all company Layouts under c360"], "isController": false}, {"data": [0.0, 500, 1500, "C360 Company Messenger call"], "isController": false}, {"data": [1.0, 500, 1500, "Get Company Layout Info "], "isController": false}, {"data": [1.0, 500, 1500, "C360 consumption "], "isController": false}, {"data": [0.5, 500, 1500, "Create R360 Custom Layout"], "isController": false}, {"data": [0.5, 500, 1500, "Update EmbedPage Global Section"], "isController": false}, {"data": [1.0, 500, 1500, "Company Search"], "isController": false}, {"data": [0.4, 500, 1500, "C360 Boot Strap API"], "isController": false}, {"data": [0.0, 500, 1500, "C360 Messenger Tenant request"], "isController": false}, {"data": [0.0, 500, 1500, "R360 Messenger TenantId Request"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Layout from C360"], "isController": false}, {"data": [1.0, 500, 1500, "Get Assignment under Layout"], "isController": false}, {"data": [0.8, 500, 1500, "Create C360 Assignment"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "Get Relationship Manage Assignments"], "isController": false}, {"data": [0.9, 500, 1500, "Search Config Call"], "isController": false}, {"data": [0.5, 500, 1500, "Update Summary Global Section"], "isController": false}, {"data": [0.5, 500, 1500, "Create Attribute Global section"], "isController": false}, {"data": [0.5, 500, 1500, "Global Summary Section"], "isController": false}, {"data": [0.5, 500, 1500, "Hierarchy Global Section"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Get R360 Layout State Call"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "Adding sections under Rel Layout"], "isController": false}, {"data": [0.0, 500, 1500, "R360 Relationship Messenger Call"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Create R360 Assignment"], "isController": false}, {"data": [0.5, 500, 1500, "Udpate Global Hierarchy Section"], "isController": false}, {"data": [1.0, 500, 1500, "Get Company Manage Assignments"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Update Gloabl Attribute Section"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Configured Global Sections"], "isController": false}, {"data": [0.5, 500, 1500, "Get Relationship Types"], "isController": false}, {"data": [0.8, 500, 1500, "C360 Layout Listing State Call"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "Get Global Sections for Relationship"], "isController": false}, {"data": [0.5, 500, 1500, "Get Global Sections Under Company"], "isController": false}, {"data": [0.9, 500, 1500, "R360 Externalsharing Layout"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "C360 Custom Layout Creation"], "isController": false}, {"data": [1.0, 500, 1500, "Get Layouts Under Company"], "isController": false}, {"data": [0.0, 500, 1500, "AuthToken"], "isController": false}, {"data": [0.5, 500, 1500, "C360 Externalsharing Layout"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Get Relationship Layout info"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 505, 40, 7.920792079207921, 649.8178217821784, 0, 2691, 529.0, 1108.0000000000002, 1282.1, 1999.8599999999997, 6.23325968623869, 25.845933087345866, 16.919083629824605], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["C360 Revamp Feature Evalute Call", 5, 0, 0.0, 472.0, 339, 581, 534.0, 581.0, 581.0, 581.0, 1.242544731610338, 4.318570995899602, 3.201008791003976], "isController": false}, {"data": ["Preview R360 Assignment", 15, 0, 0.0, 985.8, 776, 1163, 1001.0, 1131.8, 1163.0, 1163.0, 2.265176683781335, 7.133979301948052, 6.160661195635759], "isController": false}, {"data": ["Get R360 BootStrap Config", 15, 0, 0.0, 1508.0666666666668, 1271, 2691, 1291.0, 2313.0, 2691.0, 2691.0, 2.2498875056247187, 10.831977932353382, 5.69502774861257], "isController": false}, {"data": ["Get Relationship Pre-Config", 5, 0, 0.0, 473.6, 459, 500, 471.0, 500.0, 500.0, 500.0, 2.261420171867933, 7.369491321800091, 5.717594555630937], "isController": false}, {"data": ["Get Layouts Under Relationship", 15, 0, 0.0, 686.0666666666667, 461, 1888, 482.0, 1414.0000000000002, 1888.0, 1888.0, 2.4084778420038533, 9.346963812620425, 6.098811566714836], "isController": false}, {"data": ["Get all Global Sections Under Relationsihp", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 8.093392977150538, 6.788684475806452], "isController": false}, {"data": ["Resolve Cid c360", 5, 0, 0.0, 524.8, 505, 547, 520.0, 547.0, 547.0, 547.0, 2.0202020202020203, 18.54955808080808, 5.3444602272727275], "isController": false}, {"data": ["Get All Object Association", 15, 0, 0.0, 763.8666666666667, 455, 1868, 505.0, 1605.8000000000002, 1868.0, 1868.0, 1.8272627603849434, 5.501417080338653, 4.619905553356073], "isController": false}, {"data": ["Get SummaryRibbon Config for Preconfig", 5, 0, 0.0, 335.6, 333, 343, 334.0, 343.0, 343.0, 343.0, 2.127659574468085, 21.93151595744681, 5.391871675531915], "isController": false}, {"data": ["RelationshipSearch", 15, 0, 0.0, 553.0, 414, 1267, 464.0, 959.2000000000002, 1267.0, 1267.0, 1.9159535061949162, 8.380425541256866, 5.0967356942138204], "isController": false}, {"data": ["Get R360 Assignment under Layout", 15, 0, 0.0, 376.79999999999995, 345, 664, 355.0, 491.2000000000001, 664.0, 664.0, 2.557980900409277, 8.518276240620738, 6.524849718622101], "isController": false}, {"data": ["Preview Assignment For an Company and User", 5, 0, 0.0, 558.0, 493, 757, 516.0, 757.0, 757.0, 757.0, 1.793400286944046, 5.648160083393114, 4.874055662661406], "isController": false}, {"data": ["Get all Global Section under Company", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 32.071141412466844, 6.685697115384615], "isController": false}, {"data": ["EmbedPage Global Section", 5, 0, 0.0, 1028.0, 742, 1131, 1094.0, 1131.0, 1131.0, 1131.0, 1.1921793037672865, 4.059696515855984, 3.2354162941106344], "isController": false}, {"data": ["Get Relationship PreConfig", 15, 0, 0.0, 643.4000000000001, 462, 1255, 534.0, 985.0000000000002, 1255.0, 1255.0, 1.7622180451127818, 5.742696891153665, 4.455451678512688], "isController": false}, {"data": ["Delete Layout under R360", 18, 0, 0.0, 828.3333333333334, 745, 1160, 782.0, 1025.0000000000002, 1160.0, 1160.0, 1.2070815450643777, 3.636568912620708, 3.1697678463653434], "isController": false}, {"data": ["Adding BM sections under Layout", 5, 0, 0.0, 865.0, 817, 1037, 821.0, 1037.0, 1037.0, 1037.0, 1.614987080103359, 7.690114260335917, 7.627028827519379], "isController": false}, {"data": ["Get all relationship Layouts", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 22.04188327032136, 4.786817698487712], "isController": false}, {"data": ["Get Relaitonship types", 15, 0, 0.0, 565.1999999999999, 455, 800, 485.0, 760.4, 800.0, 800.0, 1.7611835153222966, 5.751364917224375, 4.449396244276154], "isController": false}, {"data": ["R360 Consumption ", 15, 0, 0.0, 431.2000000000001, 355, 789, 401.0, 612.6000000000001, 789.0, 789.0, 1.9139977032027562, 8.140097653757815, 4.85602151652418], "isController": false}, {"data": ["Get all company Layouts under c360", 1, 0, 0.0, 1590.0, 1590, 1590, 1590.0, 1590.0, 1590.0, 1590.0, 0.6289308176100629, 3.323997641509434, 1.5895243710691822], "isController": false}, {"data": ["C360 Company Messenger call", 5, 5, 100.0, 329.8, 328, 331, 330.0, 331.0, 331.0, 331.0, 2.208480565371025, 6.664262643551237, 5.63119409783569], "isController": false}, {"data": ["Get Company Layout Info ", 5, 0, 0.0, 360.4, 350, 373, 357.0, 373.0, 373.0, 373.0, 2.0938023450586263, 9.970097885259632, 5.33265284757119], "isController": false}, {"data": ["C360 consumption ", 5, 0, 0.0, 359.4, 352, 372, 354.0, 372.0, 372.0, 372.0, 2.1739130434782608, 9.245499320652174, 5.5154551630434785], "isController": false}, {"data": ["Create R360 Custom Layout", 18, 0, 0.0, 907.2222222222222, 747, 1140, 807.0, 1129.2, 1140.0, 1140.0, 2.394890899414582, 8.32598789249601, 6.742646936535391], "isController": false}, {"data": ["Update EmbedPage Global Section", 5, 0, 0.0, 903.0, 731, 1077, 964.0, 1077.0, 1077.0, 1077.0, 1.297016861219196, 5.6972478923476, 5.400859273670558], "isController": false}, {"data": ["Company Search", 5, 0, 0.0, 439.4, 401, 472, 457.0, 472.0, 472.0, 472.0, 2.066115702479339, 9.017061596074381, 5.5607567148760335], "isController": false}, {"data": ["C360 Boot Strap API", 5, 0, 0.0, 1417.6, 1283, 1841, 1300.0, 1841.0, 1841.0, 1841.0, 0.9432182607055273, 5.230992678268251, 2.3875212224108657], "isController": false}, {"data": ["C360 Messenger Tenant request", 5, 5, 100.0, 335.4, 334, 339, 334.0, 339.0, 339.0, 339.0, 2.204585537918871, 6.745084463183422, 5.6492504409171085], "isController": false}, {"data": ["R360 Messenger TenantId Request", 15, 15, 100.0, 382.73333333333335, 334, 625, 343.0, 544.6, 625.0, 625.0, 1.9191402251791196, 5.8717444584826, 4.917796827021495], "isController": false}, {"data": ["Delete Layout from C360", 5, 0, 0.0, 882.4, 751, 1236, 776.0, 1236.0, 1236.0, 1236.0, 1.1327594019030358, 3.41265894030358, 2.928138805505211], "isController": false}, {"data": ["Get Assignment under Layout", 5, 0, 0.0, 353.8, 349, 361, 352.0, 361.0, 361.0, 361.0, 2.1114864864864864, 7.031414959881757, 5.385940139358109], "isController": false}, {"data": ["Create C360 Assignment", 5, 0, 0.0, 487.0, 375, 684, 446.0, 684.0, 684.0, 684.0, 1.7774617845716318, 7.154978003910416, 6.830382931923213], "isController": false}, {"data": ["Get Relationship Manage Assignments", 15, 0, 0.0, 455.8, 350, 661, 476.0, 614.8000000000001, 661.0, 661.0, 2.3299161230195713, 7.014776764911463, 5.924903890959926], "isController": false}, {"data": ["Search Config Call", 5, 0, 0.0, 486.6, 365, 917, 368.0, 917.0, 917.0, 917.0, 1.4001680201624196, 6.139408604032484, 3.5346038399607953], "isController": false}, {"data": ["Update Summary Global Section", 5, 0, 0.0, 1033.6, 877, 1102, 1056.0, 1102.0, 1102.0, 1102.0, 1.098177026136613, 5.751487686690094, 6.568685825280035], "isController": false}, {"data": ["Create Attribute Global section", 5, 0, 0.0, 802.0, 757, 870, 776.0, 870.0, 870.0, 870.0, 1.2559658377292138, 4.27568057648832, 3.4072979464958553], "isController": false}, {"data": ["Global Summary Section", 5, 0, 0.0, 1013.0, 741, 1157, 1049.0, 1157.0, 1157.0, 1157.0, 1.0933741526350316, 3.716831470041548, 2.960865747321233], "isController": false}, {"data": ["Hierarchy Global Section", 5, 0, 0.0, 1021.6, 800, 1092, 1070.0, 1092.0, 1092.0, 1092.0, 1.2703252032520325, 4.343172399009147, 3.464861613948171], "isController": false}, {"data": ["Get R360 Layout State Call", 15, 0, 0.0, 436.0666666666666, 342, 697, 356.0, 643.0, 697.0, 697.0, 2.3219814241486065, 9.553079044117647, 5.9455422794117645], "isController": false}, {"data": ["Adding sections under Rel Layout", 18, 0, 0.0, 1105.2222222222224, 783, 2484, 1085.5, 1342.8000000000018, 2484.0, 2484.0, 2.3834745762711864, 9.799246060646187, 9.215015476032839], "isController": false}, {"data": ["R360 Relationship Messenger Call", 15, 15, 100.0, 354.80000000000007, 325, 529, 333.0, 469.00000000000006, 529.0, 529.0, 1.9541427826993227, 5.896778514200104, 4.982682427371026], "isController": false}, {"data": ["Create R360 Assignment", 18, 0, 0.0, 645.5, 369, 1356, 606.0, 1122.0000000000005, 1356.0, 1356.0, 2.611344842593936, 10.603488140142174, 10.12661168939504], "isController": false}, {"data": ["Udpate Global Hierarchy Section", 5, 0, 0.0, 1031.4, 833, 1103, 1090.0, 1103.0, 1103.0, 1103.0, 1.266784899923993, 6.180524765644793, 6.142174832151], "isController": false}, {"data": ["Get Company Manage Assignments", 5, 0, 0.0, 353.8, 347, 375, 348.0, 375.0, 375.0, 375.0, 1.9091256204658267, 5.747885046773577, 4.845524890225277], "isController": false}, {"data": ["JSR223 Sampler", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 0.0, 0.0], "isController": false}, {"data": ["Update Gloabl Attribute Section", 5, 0, 0.0, 1040.8, 751, 1451, 1068.0, 1451.0, 1451.0, 1451.0, 1.169864295741694, 5.1889879211511465, 5.890449520355639], "isController": false}, {"data": ["Delete Configured Global Sections", 20, 0, 0.0, 800.1500000000001, 727, 1299, 750.0, 1050.8000000000004, 1287.6, 1299.0, 1.2492192379762648, 3.7635169425359147, 3.210883822610868], "isController": false}, {"data": ["Get Relationship Types", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 5.033294040930979, 4.048893960674158], "isController": false}, {"data": ["C360 Layout Listing State Call", 5, 0, 0.0, 469.0, 342, 673, 357.0, 673.0, 673.0, 673.0, 1.3044612575006522, 5.196188934907383, 3.3401341964518654], "isController": false}, {"data": ["Get Global Sections for Relationship", 15, 0, 0.0, 568.6, 367, 1163, 493.0, 934.4000000000001, 1163.0, 1163.0, 2.2304832713754648, 6.715410083643123, 5.6328415427509295], "isController": false}, {"data": ["Get Global Sections Under Company", 5, 0, 0.0, 689.4, 682, 693, 690.0, 693.0, 693.0, 693.0, 1.6886187098953056, 20.414146930935495, 4.25617665062479], "isController": false}, {"data": ["R360 Externalsharing Layout", 15, 0, 0.0, 443.33333333333337, 335, 1144, 376.0, 790.6000000000003, 1144.0, 1144.0, 1.9422504208209246, 5.8476152806551855, 4.937185395895377], "isController": false}, {"data": ["Debug Sampler", 16, 0, 0.0, 0.1875, 0, 1, 0.0, 1.0, 1.0, 1.0, 0.2203067771872332, 2.612028362776416, 0.0], "isController": false}, {"data": ["C360 Custom Layout Creation", 5, 0, 0.0, 1008.6, 753, 1414, 941.0, 1414.0, 1414.0, 1414.0, 1.3854253255749516, 4.686634109171516, 3.782860556940981], "isController": false}, {"data": ["Get Layouts Under Company", 5, 0, 0.0, 361.0, 354, 383, 355.0, 383.0, 383.0, 383.0, 1.9069412662090006, 9.78759951849733, 4.8194960907704045], "isController": false}, {"data": ["AuthToken", 1, 0, 0.0, 2299.0, 2299, 2299, 2299.0, 2299.0, 2299.0, 2299.0, 0.43497172683775553, 3.1616157840365378, 0.1779815952588082], "isController": false}, {"data": ["C360 Externalsharing Layout", 5, 0, 0.0, 612.2, 528, 734, 586.0, 734.0, 734.0, 734.0, 2.010454362685967, 8.426630981101729, 5.11055928327302], "isController": false}, {"data": ["Get Relationship Layout info", 15, 0, 0.0, 401.8666666666666, 350, 663, 356.0, 638.4, 663.0, 663.0, 2.5684931506849313, 9.92849689640411, 6.541630993150685], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 505, 40, "400", 20, "500", 20, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["C360 Company Messenger call", 5, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["C360 Messenger Tenant request", 5, 5, "400", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["R360 Messenger TenantId Request", 15, 15, "400", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["R360 Relationship Messenger Call", 15, 15, "500", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
