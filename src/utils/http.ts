export function httpGet<T>(url: string, callback: (result: T) => void) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(JSON.parse(xmlHttp.responseText) as T);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}