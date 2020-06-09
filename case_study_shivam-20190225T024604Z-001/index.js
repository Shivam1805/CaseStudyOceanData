var jsonData;
function getXMLData() {
    $.get("http://localhost:9999/code/", function (data) {
        $(".result").html(data);
        console.log("Load was performed.", data);
        $.each(data, function () {
            $("#select").append($("<option/>").val(this.code).text(this.code));
        });
    });
}

function submit() {
    var table = document.getElementsByTagName('table');
    if (table.length > 0) {
        document.getElementsByTagName('body')[0].removeChild(table[0]);
    }
    var e = document.getElementById("databaseSelect");
    var strDatabase = e.options[e.selectedIndex].value;
    var e = document.getElementById("select");
    var strProjectReference = e.options[e.selectedIndex].value;
    if (strDatabase == "mongo") {
        $.get("http://localhost:9999/mongodb/" + strProjectReference, function (data) {
            bulidUI(data[0]);
        });
    }
    if (strDatabase == "mysql") {
        $.get("http://localhost:9999/sql/" + strProjectReference, function (data) {
            bulidUI(data[0]);
            console.log("Load was performed.", data);
        });
    }
}
function bulidUI(data) {
    
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < data.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
        }
    }
    document.getElementsByTagName('body')[0].append(table);

}
