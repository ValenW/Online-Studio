function showtime(t) {
    var b = document.getElementById('conButton');
    var tlink = b.attributes.link.value;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", tlink, true);
    xmlhttp.send();
    b.disabled=true;
    for(i = 1; i <= t; i++) {
        window.setTimeout("updateButton(" + i + ", " + t + ")", i * 1000);
    }
}

function updateButton(num, t) {
    var b = document.getElementById('conButton');
    if(num == t) {
        b.innerHTML = oldValue;
        oldValue = undefined;
        b.disabled=false;
    } else {
        if (typeof oldValue == "undefined") {
            oldValue = b.innerHTML;
        }
        printnr = t - num;
        b.innerHTML = oldValue + "(" + printnr +")";
    }
}
