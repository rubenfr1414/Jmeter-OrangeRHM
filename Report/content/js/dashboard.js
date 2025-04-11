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
var seriesFilter = "((^1. Home)|(^2. Auth/validate)|(^3. Action-summary)|(^4. Leaves)|(^5. Locations)|(^6. ViewAdminModule)|(^7 ViewPimModule)|(^8. ViewMyDetails)|(^9. Personal-details)|(^10. Bloodtype)|(^11. Logout))(-success|-failure)?";
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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9402985074626866, 1000, 2000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5034722222222222, 1000, 2000, "2. Auth/validate"], "isController": false}, {"data": [0.9964028776978417, 1000, 2000, "7 ViewPimModule"], "isController": false}, {"data": [1.0, 1000, 2000, "10. Bloodtype"], "isController": false}, {"data": [1.0, 1000, 2000, "4. Leaves"], "isController": false}, {"data": [1.0, 1000, 2000, "5. Locations"], "isController": false}, {"data": [0.8669064748201439, 1000, 2000, "8. ViewMyDetails"], "isController": false}, {"data": [1.0, 1000, 2000, "9. Personal-details"], "isController": false}, {"data": [0.9964539007092199, 1000, 2000, "6. ViewAdminModule"], "isController": false}, {"data": [0.993103448275862, 1000, 2000, "1. Home"], "isController": false}, {"data": [1.0, 1000, 2000, "3. Action-summary"], "isController": false}, {"data": [1.0, 1000, 2000, "11. Logout"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1541, 0, 0.0, 644.2693056456859, 316, 1492, 677.0, 1039.8, 1108.0, 1170.58, 13.123270172450502, 83.17422523685332, 12.636922503725783], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["2. Auth/validate", 144, 0, 0.0, 1112.7708333333333, 977, 1492, 1108.5, 1170.0, 1188.75, 1419.1000000000017, 1.2562046915755773, 11.154950449703833, 2.062221661243468], "isController": false}, {"data": ["7 ViewPimModule", 139, 0, 0.0, 772.6978417266188, 680, 1144, 762.0, 855.0, 878.0, 1081.1999999999991, 1.2301973625984601, 11.664049017059032, 1.5990162984556155], "isController": false}, {"data": ["10. Bloodtype", 136, 0, 0.0, 392.544117647059, 339, 492, 381.0, 446.6, 464.4000000000001, 489.78, 1.2305910456404503, 1.4856534489349957, 0.8499281919586303], "isController": false}, {"data": ["4. Leaves", 141, 0, 0.0, 361.09219858156024, 317, 542, 351.0, 411.2, 439.5, 507.560000000001, 1.2524427074080653, 1.3759746541348374, 0.7864459578744004], "isController": false}, {"data": ["5. Locations", 141, 0, 0.0, 361.27659574468106, 316, 541, 351.0, 410.0, 431.8, 506.98000000000104, 1.2523648378587227, 1.7048794765381439, 0.7704978982919876], "isController": false}, {"data": ["8. ViewMyDetails", 139, 0, 0.0, 969.0647482014388, 870, 1317, 963.0, 1040.0, 1080.0, 1233.3999999999987, 1.22821899409748, 28.07631856819708, 1.6120374297529425], "isController": false}, {"data": ["9. Personal-details", 137, 0, 0.0, 374.59124087591226, 324, 546, 362.0, 430.40000000000003, 449.3999999999999, 522.4400000000003, 1.2399087716757773, 1.7714712235953733, 0.790684011625276], "isController": false}, {"data": ["6. ViewAdminModule", 141, 0, 0.0, 767.9219858156026, 656, 1183, 758.0, 833.5999999999999, 874.3000000000001, 1104.8800000000024, 1.2480195434549786, 14.828763462125705, 1.613650269076554], "isController": false}, {"data": ["1. Home", 145, 0, 0.0, 882.7103448275867, 817, 1117, 878.0, 925.4, 946.0, 1073.7599999999993, 1.2663755458515285, 5.362274836244541, 0.6905874727074236], "isController": false}, {"data": ["3. Action-summary", 142, 0, 0.0, 379.1619718309858, 331, 506, 367.0, 430.40000000000003, 448.7, 502.55999999999995, 1.2615942286506272, 1.6656986300152814, 0.7823362648370589], "isController": false}, {"data": ["11. Logout", 136, 0, 0.0, 689.7426470588234, 599, 948, 673.5, 754.3, 796.9000000000001, 923.5799999999997, 1.2276695041478982, 7.303515755468094, 1.6101173281939718], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1541, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
