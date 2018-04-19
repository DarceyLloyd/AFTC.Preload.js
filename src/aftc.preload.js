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