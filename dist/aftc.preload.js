// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var AFTC = AFTC || {}


// From aftc.js (modified for some missing functions in aftc.js)
function onReady(fn) {
    // IE9+
    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            // Adds a little delay but is a good thing
            setTimeout(fn, 10);
        });
    }
}


AFTC.log = {
    enabled: true,
    elementId: "",
    element: false
};
function log(arg) {
    if (console) {
        if (AFTC.log.enabled) {
            if (typeof (arg) == "undefined") {
                console.error("AFTC.LOG(arg) ERROR: Your log variable (arg) is \"undefined\"!");
            } else {
                console.log(arg);
            }
            if (AFTC.log.element != false) {
                if (typeof (arg) == "object") {
                    AFTC.log.element.innerHTML += "[Object]<br>";
                    for (var key in arg) {
                        AFTC.log.element.innerHTML += ("&nbsp;&nbsp;&nbsp;&nbsp;" + key + " = " + arg[key] + "<br>");
                    }
                } else {
                    AFTC.log.element.innerHTML += (arg + "<br>");
                }

            }
        }
    }
}
function logTo(elementOrElementId) {
    if (elementOrElementId){
        AFTC.log.element = document.getElementById(elementOrElementId);
    } else {
        AFTC.log.element = false;
    }
    
}



/*
// Image preload mode css backgrounds with id on .add() for style id (maybe add user style injector)
// Image preload mode js into array of img tags and retrieved on id

TO DO (maybe):
// param: jsMode : sequential || batch (handle via .add())
// maybe 2/10 param: cssMode : ajax || standard (css files are not really that big no need for ajax)
// param: imageMode : ajax || css || dom || js
*/

AFTC.Preloader = function () {
    //log("AFTC.Preloader()");

    // Var defs
    this.params = {
        que: [],
        jsQue: [],

        svgs:[],

        cache: true,

        batch: [],
        batchSize: 3,
        filesInBatch: 0,

        types: [], // array of {ext,count,loaded}

        attachImagesToDom: false,
        domElementToAttachImagesTo: "",

        attachScriptsToDom: true,
        attachStyleSheetsToDom: true,

        noOfJSFiles: 0,
        noOfJSFilePreloaded: 0,

        noOfFilesToPreload: 0,
        noOfFilesLoaded: 0,
        noOfFilesFailed: 0,
        percentLoaded: 0,

        error: false,

        onComplete: null,
        onProgress: null,
        onError: null,

        xhrAvailable: false,

        files:[]
    };


    // File definition / Value Object
    AFTC.Preloader.FileVo = function () {
        this.id = null;
        this.url = "";
        this.urlCacheString = "";
        this.ext = "";

        this.data = "";

        this.processed = false;
        this.done = false;

        this.cache = true;

        this.loading = false;

        this.xhr = null;
        this.xhrLoading = false;
        this.xhrProgress = 0;
        this.xhrSuccess = false;
        this.xhrReadyState = "";
        this.xhrStatus = 0;
        this.xhrStatusText = "";
        this.xhrProcessed = false;

        this.isImage = false;
        this.imgWidth = 200;
        this.imgHeight = 150;
        this.imgClass = null;

        this.jsLoading = false; // The setup of css = createElement(link) || script = createElement(script) || img = createElement(img)
        this.jsSuccess = false; // css.load||error = fn(); || script.load||error = fn(); || img.load||error = fn();
        this.jsProcessed = false;

        this.batchIndex = -1;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (this.params.hasOwnProperty(key)) {
                this.params[key] = arguments[0][key];
            } else {
                console.error("AFTC.Preloader: Usage Error - Unknown paramater [" + key + "]");
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    this.init = function () {
        //log("AFTC.Preloader.init()");

        // var ini
        this.params.noOfFilesToPreload = (this.params.que.length + this.params.jsQue.length);
        this.params.noOfJSFilePreloaded = 0;
        this.params.noOfJSFiles = this.params.jsQue.length;
        this.params.noOfFilesLoaded = 0;
        this.params.noOfFilesFailed = 0;
        this.params.percentLoaded = 0;

        // init batch array with nulls
        for (var b=0; b < this.params.batchSize; b++){
            this.params.batch[b] = null;
        }

        // XHR Check
        var xhrTemp;
        if (XMLHttpRequest) {
            xhrTemp = new XMLHttpRequest()
        } else {
            xhrTemp = new ActiveXObject('Microsoft.XMLHTTP')
        }

        if (xhrTemp) {
            this.params.xhrAvailable = true;
            xhrTemp = "";
            delete xhrTemp;
        }

        ////log(this.params.que);

        // var Img10mb = "./img/big.jpg"; //"http://dev.aftc.co.uk/img/big.jpg";
        //var file1 = {url:"./img/img01.jpg"}
        //var file2 = {url:"./img/img02.jpg"}
        //this.xhrOpen(file1);
        //this.xhrOpen(file2);


        // We are going to run both the batch loader and the javascript sequence loader at the same time

        // JavaScript Sequential loader
        //this.preloadJS();
        //batchProcessor();

        // Start the batch preloading by getting the first batch to preload
        this.getBatchFilesToLoad();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

        //log("xhrReadyState = " + fileVo.xhrReadyState + "   :   xhrStatus = " + fileVo.xhrStatus);
        //log(e.target.statusText);

        if (fileVo.xhrReadyState === 4) {
            if (fileVo.xhrStatus === 200) {
                //log(e.target._url + " SUCCESS");
                fileVo.xhrSuccess = true;
            } else {
                //log(e.target._url + " FAILED");
                fileVo.xhrSuccess = false;
            }
            fileVo.xhrStatusText = e.target.statusText;
            //log("xhrReadyState = " + fileVo.xhrReadyState + "   :   xhrStatus = " + fileVo.xhrStatus + "   :   xhrStatusText = " + fileVo.xhrStatusText);
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
    if (fileVo.urlCacheString != "") {
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
    // log(e.currentTarget.responseText);

    var batchIndex = e.target._batchIndex;
    var me = e.target._me;
    var fileVo = me.params.batch[batchIndex];
    //log("fileVo.ext = " + fileVo.ext);

    fileVo.ext = fileVo.ext.toLowerCase();
    if (
        fileVo.ext == "css" || fileVo.ext == "js" ||
        fileVo.ext == "svg" || fileVo.ext == "json" ||
        fileVo.ext == "csv" || fileVo.ext == "txt"
    ) {
        fileVo.data = e.currentTarget.responseText;
    }
    //log("AFTC.Preloader.prototype.xhrLoadEndHandler(e): " + fileVo.url);

    // Flag xhr is done
    fileVo.xhrProcessed = true;
    fileVo.xhrLoading = false;

    // Next up, JS Preload or done
    // Detect type, attach to DOM if possible
    if (fileVo.isImage) {
        // Start JS:Image loader
        //log("0");
        if (fileVo.ext == "svg") {
            me.params.svgs.push(
                { id: fileVo.id, svg: e.target.responseText, url: fileVo.url }
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
/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.public - Public functions go in here
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.add = function () {
    //log("AFTC.Preloader.prototype.add(obj): " + arguments[0].url);

    var o = new AFTC.Preloader.FileVo();

    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {
        for (var key in arguments[0]) {
            if (o.hasOwnProperty(key)) {
                o[key] = arguments[0][key];
            } else {
                console.error("AFTC.Preloader.prototype.add(): ERROR: Unknown paramater: [" + key + "]");
            }
        }
    }

    if (o.url != null || o.url != "") {

        o.ext = o.url.split('.').pop();

        // Cache
        if (!o.cache) {
            o.urlCacheString = ("?c=" + Math.round(Math.random() * 9999999999));
        }

        // isImage
        if (o.ext == "png" || o.ext == "jpg" || o.ext == "jpeg" || o.ext == "png" || o.ext == "gif" || o.ext == "bmp" || o.ext == "svg") {
            o.isImage = true;
        }

        if (o.ext == "js") {
            this.params.noOfJSFiles++;

        }

        this.params.que.push(o);
        //log(o);
        // log(o.id + "," + o.url + "," + o.cache);


    } else {
        console.error("AFTC.Preloader.prototype.add(): ERROR: Function argument url missing!");
    }

    // Allow chaining
    return this;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.start = function () {
    //log("AFTC.Preloader.prototype.start()");
    this.init();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.loadNow = function (obj) {
    //log("AFTC.Preloader.prototype.loadNow(obj)");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


AFTC.Preloader.prototype.getItemById = function (id) {
    // log("AFTC.Preloader.getItemById(id:" + id + ")");
    var found = false;
    for (var i = 0; i < this.params.que.length; i++) {
        if (this.params.que[i].id == id) {
            found = true;
            break;
        }
    }

    if (!found) {
        console.error("AFTC.Preloader.getItemById(): Error, unable to find a preload item with an id of [" + id + "]");
        return false;
    } else {
        switch (this.params.que[i].ext.toLowerCase()) {
            case "jpg":
                return this.fetchImage(this.params.que[i]);
                break;
            case "gif":
                return this.fetchImage(this.params.que[i]);
                break;
            case "png":
                return this.fetchImage(this.params.que[i]);
                break;
            case "bmp":
                return this.fetchImage(this.params.que[i]);
                break;
            case "js":
                return this.params.que[i].data;
                break;
            case "css":
                return this.params.que[i].data;
                break;
            case "json":
                return this.params.que[i].data;
                break;
            case "svg":
                return this.getSVGById(id);
                break;
            case "txt":
                return this.params.que[i].data;
                break;
        }
    }
}

AFTC.Preloader.prototype.fetchImage = function (fileVo) {
    // log("AFTC.Preloader.fetchImage(fileVo): fileVo.url = " + fileVo.url);
    var img = new Image();
    // img.onload = function(){ };
    img.src = fileVo.url;
    return img;
}




AFTC.Preloader.prototype.getSVGById = function (id) {
    for (var i = 0; i < this.params.svgs.length; i++) {
        var oSVG = this.params.svgs[i];
        if (oSVG.id == id) {
            // You can access to the SVG DOM when you attach it to the DOM via innerHTML

            //var xmlns = "http://www.w3.org/2000/svg";
            //var svg = document.createElementNS (xmlns, "svg");

            //var element = document.getElementById("preloader");
            //element.innerHTML = oSVG.svg;
            //var layer1 = document.getElementById("Layer1");
            //log(layer1.style.opacity = 0.5);

            return (oSVG.svg);
        }
    }

    return null;
}
/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.batch.js - Batch processing related stuff here
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.getBatchFilesToLoad = function () {
    //log("\n");
    //log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
    //log("AFTC.Preloader.prototype.getBatchFilesToLoad()");

    // No need to run this function as it should only be run when batch has free slots
    if (this.params.filesInBatch >= this.params.batchSize) {
        return false;
    }

    var me = this; // scope accessor


    // returns -1 if there are none
    function getIndexOfNextBatchSlotAvailable() {
        for (var b = 0; b < me.params.batchSize; b++) {
            if (me.params.batch[b] == null) {
                return b;
            }
        }
        return -1;
    }


    // Loop through que and fill the batch array slots up (no slicing or popping as index references are in use)
    var foundFileToAddToBatch = false;
    var fileAddedToBatch = false;

    for (var i = 0; i < this.params.que.length; i++) {

        // No need to keep looping if batch is full
        if (this.params.filesInBatch >= this.params.batchSize) {
            //log("AFTC.Preloader.prototype.getBatchFilesToLoad(): BATCH IS FULL");
            break;
        }

        // NOTE: fileVo is a link to que[i], changes in fileVo will be reflected in que[i]
        var fileVo = this.params.que[i];
        // log(fileVo);

        // Ensure we dont add files to the batch which are already in the batch que
        if (!fileVo.loading && !fileVo.processed) {
            foundFileToAddToBatch = true;

            //log("AFTC.Preloader.prototype.getBatchFilesToLoad(): PROCESSING FILE: " + fileVo.url);

            var indexOfNextAvailableBatchSlot = getIndexOfNextBatchSlotAvailable();
            if (indexOfNextAvailableBatchSlot != -1) {
                //log("AFTC.Preloader.prototype.getBatchFilesToLoad(): BATCH SLOT AVAILABLE AT: " + indexOfNextAvailableBatchSlot);
                this.params.batch[indexOfNextAvailableBatchSlot] = fileVo;
                fileAddedToBatch = true;
                fileVo.processed = true;
                fileVo.batchIndex = indexOfNextAvailableBatchSlot;
                this.params.filesInBatch++;
            } else {
                //log("AFTC.Preloader.prototype.getBatchFilesToLoad(): NO BATCH SLOTS AVAILABLE");
                break;
            }

        }
    }


    // Do check here to see if we are done
    if (!foundFileToAddToBatch) {

        var complete = true;
        for (var i = 0; i < this.params.que.length; i++) {
            var fileVo = this.params.que[i];
            if (!fileVo.done){
                complete = false;
            }
        }

        if (complete){
            if (this.params.onComplete){
                this.params.onComplete();
            }
        }
        return false;

        // // Check everything is complete
        // var everythingHasbeenProcessed = true;
        // for (var i = 0; i < this.params.que.length; i++) {
        //     var fileVo = this.params.que[i];
        //     if (!fileVo.done){
        //         everythingHasbeenProcessed = false;
        //     }
        // }
        //
        // log("AFTC.Preloader.prototype.getBatchFilesToLoad(): No files found to add to batch! Que is done?");
        // if (this.params.onComplete && everythingHasbeenProcessed){
        //     this.params.onComplete();
        // }
    } else {
        this.processBatchQue();
    }


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.processBatchQue = function () {
    //log("AFTC.Preloader.prototype.processBatchQue()");

    for (var i = 0; i < this.params.batch.length; i++) {
        if (this.params.batch[i] != null) {
            var fileVo = this.params.batch[i];
            // Ensure we don't start loading file in the batch which are already loading
            if (!fileVo.loading) {
                fileVo.loading = true;

                if (this.params.xhrAvailable) {
                    // XHR Load the file
                    this.xhrLoad(fileVo);
                } else {
                    // JS Loading only (only image, css and javascript will be loaded!)
                    if (fileVo.isImage) {
                        this.jsLoadImage(fileVo);
                    } else if (fileVo.ext == "js") {
                        //log("TODO: jsLoadScript()");
                        this.jsLoadScript(fileVo);
                    } else if (fileVo.ext == "css") {
                        this.jsLoadStyleSheet(fileVo);
                    } else {
                        //log("TODO: The file you are trying to preload is not supported, please use a browser that supports XHR.");
                    }
                }
            }
        }
    }


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.removeFileFromBatch = function (fileVo) {
    //log("AFTC.Preloader.prototype.removeFileFromBatch(fileVo): " + fileVo.url);

    this.onProgress(fileVo);

    this.params.batch[fileVo.batchIndex] = null;
    this.params.filesInBatch--;
    //fileVo = null;
    // //log(this.params.batch);
    // //log(this.params.que);

    this.getBatchFilesToLoad();

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.img.js
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.jsLoadImage = function (fileVo) {
    //log("AFTC.Preloader.prototype.jsLoadImage()");
    fileVo.jsLoading = true;

    var me = this;

    var newElement = document.createElement("img");
    if (fileVo.id != null && fileVo.id != ""){
        newElement.id = fileVo.id;
    }
    newElement.width = fileVo.imgWidth;
    newElement.height = fileVo.imgHeight;
    newElement.className = "img-test";
    newElement.onload = function(e){

        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesLoaded++;
        //log("AFTC.Preloader.prototype.jsLoadImage(fileVo): SUCCESS - " + fileVo.url);

        if (me.params.attachImagesToDom){
            var imageContainer = document.getElementById(me.params.domElementToAttachImagesTo);
            if (imageContainer){
                imageContainer.appendChild(newElement);
            }
        }

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    }
    newElement.onerror = function(e){
        //log("AFTC.Preloader.prototype.jsLoadImage(fileVo): ERROR - " + fileVo.url);
        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesFailed++;

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    }


    var url = fileVo.url;
    if (fileVo.urlCacheString != ""){
        url = url + fileVo.urlCacheString;
    }
    newElement.src = url;

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.css.js
*/



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.jsLoadStyleSheet = function (fileVo) {
    //log("AFTC.Preloader.prototype.jsLoadStyleSheet(fileVo)");
    //log(fileVo);

    fileVo.processed = true;

    var me = this; // Scope accessor
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    if (fileVo.id != null && fileVo.id != ""){
        link.id = fileVo.id;
    }
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'all';
    var url = fileVo.url;
    if (fileVo.urlCacheString != ""){
        url = url + fileVo.urlCacheString;
    }
    link.href = url;
    //log(link);

    link.onload = function () {
        //log("AFTC.Preloader.prototype.jsLoadStyleSheet(fileVo): SUCCESS - " + fileVo.url);
        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesLoaded++;

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    };

    link.onerror = function () {
        //log("AFTC.Preloader.prototype.jsLoadStyleSheet(fileVo): ERROR - " + fileVo.url);

        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesFailed++;

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    }
    head.appendChild(link);

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.js.js
*/

/*
   var me = this; // Scope accessor
    var script = document.createElement('script');

    script.onload = function () {
        //log("AFTC.Preloader.prototype.preloadJSFile: Success preloading [" + file.url + "]");
        // Load, Attach/Parse, Complete, Next!
        file.loading = false;
        file.loaded = true;
        file.success = true;
        me.params.noOfJSFilePreloaded++;
        me.params.noOfFilesLoaded++;
        me.onProgress(file);
        me.getJSFileFromJSQue();
    };
    script.onerror = function () {
        // Error - Probably can't find script or cross origin issue
        console.error("AFTC.Preloader.prototype.preloadJSFile: Error preloading [" + file.url + "]");
        file.loading = false;
        file.loaded = false;
        file.success = false;
        me.params.error = true;
        me.params.noOfFilesFailed++;
        me.onProgress(file);
        me.getJSFileFromJSQue();
    }
    script.src = file.url;
    document.head.appendChild(script);
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.jsLoadScript = function (fileVo) {
    //log("AFTC.Preloader.prototype.jsLoadScript(fileVo)");
    //log(fileVo);

    fileVo.processed = true;

    var me = this; // Scope accessor
    var script = document.createElement('script');
    if (fileVo.id != null && fileVo.id != ""){
        script.id = fileVo.id;
    }

    script.onload = function () {
        //log("AFTC.Preloader.prototype.jsLoadScript(fileVo): SUCCESS - " + fileVo.url);
        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesLoaded++;

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    };

    script.onerror = function () {
        //log("AFTC.Preloader.prototype.jsLoadScript(fileVo): ERROR - " + fileVo.url);

        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesFailed++;

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    }


    var url = fileVo.url;
    if (fileVo.urlCacheString != ""){
        url = url + fileVo.urlCacheString;
    }
    script.src = url;
    document.head.appendChild(script);

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.on - Event Handlers go in here
*/






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.onProgress = function(fileVo) {

    var step = 100 / this.params.noOfFilesToPreload;
    // We still want to complete the preloader even though some items will fail so we work with a total of both
    this.params.percentLoaded = step * (this.params.noOfFilesLoaded + this.params.noOfFilesFailed);
    this.params.percentLoaded = parseFloat( this.params.percentLoaded.toFixed(2) );

    // var msg = "AFTC.Preloader.prototype.onProgress():\n";
    // msg += "\t" + "noOfFilesToPreload = " + this.params.noOfFilesToPreload + "\n";
    // msg += "\t" + "noOfFilesLoaded = " + this.params.noOfFilesLoaded + "\n";
    // msg += "\t" + "noOfFilesFailed = " + this.params.noOfFilesLoaded + "\n";
    // msg += "\t" + "totalLoaded = " + this.params.percentLoaded.toFixed(2) + "\n";
    // msg += "\t" + "file.url = " + fileVo.url + "\n";
    // msg += "\t" + "xhrProgress = " + fileVo.xhrProgress + "\n";
    // log(msg);


    if (this.params.onProgress) {

        this.params.onProgress({
            percentLoaded:this.params.percentLoaded,
            noOfFilesToPreload:this.params.noOfFilesToPreload,
            noOfFilesLoaded:this.params.noOfFilesLoaded,
            noOfFilesFailed:this.params.noOfFilesFailed,
            url:fileVo.url,
            urlCacheString:fileVo.urlCacheString,
            ext:fileVo.ext,
            xhrProgress:fileVo.xhrProgress,
            xhrReadyState:fileVo.xhrReadyState,
            xhrSuccess:fileVo.xhrSuccess,
            jsPreloading:fileVo.jsLoading,
            jsPreloadSuccess:fileVo.jsSuccess,
        });
    }
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



