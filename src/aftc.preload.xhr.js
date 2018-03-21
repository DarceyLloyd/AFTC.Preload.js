/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.xhr - XHR related functionality goes in here
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
*/


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.xhrLoad = function (fileVo) {
    //log("AFTC.Preloader.prototype.xhrLoad(fileVo): " + fileVo.url);

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, me, batchIndex, user, password) {
        this._url = url;
        this._me = me;
        this._batchIndex = batchIndex;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }

        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement(e) {
        ////log(e);
        if (e.target.readyState == 4) {
            //log(e.target._url + " readyState:" + e.target.readyState + "  status:" + e.target.status);
        }


        var batchIndex = e.target._batchIndex;
        var me = e.target._me;
        var fileVo = me.params.batch[batchIndex]

        fileVo.xhrReadyState = e.target.readyState;
        fileVo.xhrStatus = e.target.status;

        ////log("xhrReadyState = " + fileVo.xhrReadyState + "   :   xhrStatus = " + fileVo.xhrStatus);
        ////log(e.target.statusText);

        if (fileVo.xhrReadyState === 4) {
            if (fileVo.xhrStatus === 200) {
                ////log(e.target._url + " SUCCESS");
                fileVo.xhrSuccess = true;
            } else {
                ////log(e.target._url + " FAILED");
                fileVo.xhrSuccess = false;
            }
            fileVo.xhrStatusText = e.target.statusText;
            ////log("xhrReadyState = " + fileVo.xhrReadyState + "   :   xhrStatus = " + fileVo.xhrStatus + "   :   xhrStatusText = " + fileVo.xhrStatusText);
        }


    }

    XMLHttpRequest.prototype.open = openReplacement;
    XMLHttpRequest.prototype.send = sendReplacement;

    if (XMLHttpRequest) {
        fileVo.xhr = new XMLHttpRequest()
    } else {
        fileVo.xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    fileVo.xhr.addEventListener("progress", this.xhrProgressHandler);
    fileVo.xhr.addEventListener("load", this.xhrLoadHandler);
    fileVo.xhr.addEventListener("error", this.xhrErrorHandler);
    fileVo.xhr.addEventListener("abort", this.xhrUserAbortHandler);
    fileVo.xhr.addEventListener("loadend", this.xhrLoadEndHandler);
    //var Img10mb = "http://127.0.0.1/git/AFTC.Preload.js/testing/img/big.jpg"; //"http://dev.aftc.co.uk/img/big.jpg";
    // var Img10mb = "./img/big.jpg"; //"http://dev.aftc.co.uk/img/big.jpg";
    // fileVo.xhr.open("GET", Img10mb,true);
    // fileVo.xhr.send();

    // Update fileVo.xhrLoading flag
    fileVo.xhrLoading = true;

    var url = fileVo.url;
    if (fileVo.urlCacheString != ""){
        url = url + fileVo.urlCacheString;
    }
    //log("---- xhr " + url + "     fileVo.urlCacheString = " + fileVo.urlCacheString);

    fileVo.xhr.open("GET", url, true, this, fileVo.batchIndex);
    fileVo.xhr.send();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.xhrProgressHandler = function (e) {
    ////log(e);

    var percentComplete = 0;

    if (e.lengthComputable) {
        percentComplete = (100 / e.total) * e.loaded;
        percentComplete = parseFloat(percentComplete.toFixed(2));
    } else {
        percentComplete = 0;
    }

    //log("AFTC.Preloader.prototype.xhrProgressHandler(e): " + e.target._url + " : " + percentComplete);


    // Update fileVo
    var batchIndex = e.target._batchIndex;
    var me = e.target._me;
    var fileVo = me.params.batch[batchIndex];
    fileVo.xhrProgress = percentComplete;

    me.onProgress(fileVo);


    /*
    var id = "out" + e.target._batchIndex;
    var out = document.getElementById(id);
    if (out) {
        out.innerHTML = "Batch[" + e.target._batchIndex + "] " + percentComplete + "%";
    }
    */

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.xhrLoadHandler = function (e) {
    ////log("AFTC.Preloader.prototype.xhrLoadHandler(e): " + e.target._url);

    // Update fileVo
    var batchIndex = e.target._batchIndex;
    var me = e.target._me;
    var fileVo = me.params.batch[batchIndex];
    fileVo.xhrLoading = false;
    fileVo.xhrComplete = true;
    fileVo.xhr = null;
    delete fileVo.xhr;


    // var ext = e.target._url.split('.').pop();
    // if (ext == "jpg" || ext == "gif" || ext == "png") {
    //     var imgContainer = document.getElementById("imgs");
    //     //imgContainer.innerHTML = "<img src=\"./img/big.jpg\" width=\"200px\"/>";
    //     imgContainer.innerHTML += "<img src='" + e.target._url + "' width='200px'/>";
    // }


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.xhrErrorHandler = function (e) {
    //log("AFTC.Preloader.prototype.xhrErrorHandler(e)");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.xhrUserAbortHandler = function (e) {
    //log("AFTC.Preloader.prototype.xhrUserAbortHandler(e)");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.xhrLoadEndHandler = function (e) {
    var batchIndex = e.target._batchIndex;
    var me = e.target._me;
    var fileVo = me.params.batch[batchIndex];
    //log("AFTC.Preloader.prototype.xhrLoadEndHandler(e): " + fileVo.url);

    // Flag xhr is done
    fileVo.xhrProcessed = true;
    fileVo.xhrLoading = false;

    // Next up, JS Preload or done
    // Detect type, attach to DOM if possible
    if (fileVo.isImage) {
        // Start JS:Image loader
        //log("0");
        if (fileVo.ext == "svg"){
            me.params.svgs.push(
                {id:fileVo.id,svg:e.target.responseText,url:fileVo.url}
            )
            // log(e.target.responseText);
        }

        me.jsLoadImage(fileVo);
    } else {
        if (fileVo.ext == "js" && me.params.attachScriptsToDom) {
            //log("1");
            me.jsLoadScript(fileVo);
        } else if (fileVo.ext == "css" && me.params.attachStyleSheetsToDom) {
            //log("2");
            me.jsLoadStyleSheet(fileVo);
        } else {
            //log("3");
            fileVo.done = true;
            me.params.noOfFilesLoaded++;
            me.removeFileFromBatch(fileVo);
        }
    }
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -