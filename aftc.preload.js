/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0.1
 * https://w3c.github.io/preload/
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { if (console) { console.log(arg); } } }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var AFTC = AFTC || {}

AFTC.Preloader = function () {

    // Var defs
    var params = {
        que: [],
        noOfJSFiles: 0,
        noOfJSFilePreloaded: 0,
        noOfCSSFiles: 0,
        noOfCSSFilesPreloaded: 0,
        error: false,
        batchSize: 4,
        batch: [],
        percentLoaded: 0,
        noOfFilesLoaded: 0,
        onComplete: null,
        onProgress: null,
        onError: null
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // Process arguments
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (arguments[0].hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            }
        }

        // if (arguments[0].onComplete) { params.onComplete = arguments[0].onComplete; }
        // if (arguments[0].onProgress) { params.onProgress = arguments[0].onProgress; }
        // if (arguments[0].batchSize) { params.batchSize = arguments[0].batchSize; }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function start() {
        //console.log("AFTC.preload.start()");

        params.noOfFilesLoaded = 0;
        params.noOfJSFiles = 0;
        params.noOfCSSFiles = 0;

        // Do counts for certain file types
        for (var i = 0; i < params.que.length; i++) {
            var queItem = params.que[i];
            if (queItem.type == "javascript") {
                params.noOfJSFiles++;
            }
            if (queItem.type == "css") {
                params.noOfCSSFiles++;
            }
        }

        batchProcessor();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function getItemFromQue() {
        //log("AFTC.preload.getItemFromQue()");

        for (var i = 0; i < params.que.length; i++) {
            var queItem = params.que[i];
            if (!queItem.preloading && !queItem.preloaded) {

                // Process order
                // 1. JavaScript
                // 2. CSS (No need - but left in just encase)
                // 3. Everything else

                // Are we looking for "javascript", "css" or * file types
                if (params.noOfJSFilePreloaded < params.noOfJSFiles) {
                    //log("AFTC.preload.getItemFromQue(): JavaScript files:  noOfJSFilePreloaded:" + params.noOfJSFilePreloaded + "  noOfJSFiles:" + params.noOfJSFiles);
                    // JS
                    if (queItem.type == "javascript") {
                        queItem.preloading = true;
                        queItem.index = i;
                        return queItem;
                    }
                    // } else if (params.noOfCSSFilesPreloaded < params.noOfCSSFiles) {
                    //     log("AFTC.preload.getItemFromQue(): CSS files:  noOfCSSFilesPreloaded:" + params.noOfCSSFilesPreloaded + "  noOfCSSFiles:" + params.noOfCSSFiles);
                    //     // CSS
                    //     if (queItem.type == "css") {
                    //         queItem.preloading = true;
                    //         queItem.index = i;
                    //         return queItem;
                    //     }
                } else {
                    //log("AFTC.preload.getItemFromQue(): Generic");
                    // Any file type other than JS and CSS
                    //if (queItem.type != "javascript" && queItem.type != "css") {
                    if (queItem.type != "javascript") {
                        queItem.preloading = true;
                        queItem.index = i;
                        return queItem;
                    }
                }

            }
        }

        // Got here? Que is complete mark it as complete and run this
        return null;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function batchProcessor() {
        if (params.error) {
            onError();
            return false;
        }

        //log("AFTC.preload.batchProcessor()");


        var allBatchItemsNull = true,
            queItem;

        if (params.noOfJSFilePreloaded < params.noOfJSFiles) {
            // We want singular sequential execution to maintain load and execute sequence
            queItem = getItemFromQue();
            preloadFile(queItem);
        } else {
            // We can preload in batchs when type is not javascript

            // Debug
            var batchesInUse = 0;
            for (var i = 0; i < params.batchSize; i++) {
                if (params.batch[i] != null) {
                    batchesInUse++;
                }
            }

            //log("----BATCH---- " + batchesInUse + "/" + (params.batchSize-1));
            //log(params.batch);

            // This calls loaders on each iteration, resulting in sequential loading
            for (var i = 0; i < params.batchSize; i++) {
                if (params.batch[i] == null) {
                    queItem = getItemFromQue();

                    if (queItem != null) {
                        //log("--- Attaching " + queItem.url + " to batch @ [" + i + "]");
                        queItem.batchIndex = i; // Once preloading completes we need to remove it from batch
                        params.batch[i] = queItem;
                        preloadFile(queItem);
                    }
                }

                if (params.batch[i] != null) {
                    allBatchItemsNull = false;
                }
            }


            if (allBatchItemsNull) {
                onComplete();
            }

        }




    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function preloadFile(queItem) {
        //log("AFTC.preload.preloadFile(): " + queItem.url);
        //log(queItem);

        var ext = queItem.url.split('.').pop();

        $.ajax({
            url: queItem.url,
            success: function () {
                //log("AFTC.preload.preloadFile(): Sucesss: " + queItem.url);

                // Attach any JavaScript to the page that is on the preload list
                if (queItem.type == "javascript") {
                    var script = document.createElement('script');
                    script.onload = function () {
                        // Load & Parse Complete, Next!
                        queItem.preloading = false;
                        queItem.preloaded = true;
                        params.noOfJSFilePreloaded++;
                        params.noOfFilesLoaded++;
                        //log("AFTC.preload.preloadFile(): JS File [" + queItem.url + "] has been attached to the DOM!");
                        onItemLoaded(queItem);
                        batchProcessor();
                    };
                    script.src = queItem.url;
                    document.head.appendChild(script); //or something of the likes

                } else if (queItem.type == "css") {
                    var head = document.getElementsByTagName('head')[0];
                    var link = document.createElement('link');
                    //link.id   = cssId;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = queItem.url;
                    link.media = 'all';
                    link.onload = function () {
                        // Load & Parse Complete, Next!
                        queItem.preloading = false;
                        queItem.preloaded = true;
                        params.noOfCSSFilesPreloaded++;
                        params.batch[queItem.batchIndex] = null;
                        params.noOfFilesLoaded++;
                        //log("AFTC.preload.preloadFile(): CSS File [" + queItem.url + "] has been attached to the DOM!");
                        onItemLoaded(queItem);
                        batchProcessor();
                    };
                    head.appendChild(link);
                } else {
                    queItem.preloading = false;
                    queItem.preloaded = true;
                    params.batch[queItem.batchIndex] = null;
                    params.noOfFilesLoaded++;
                    onItemLoaded(queItem);
                    batchProcessor();
                }


            },
            error: function (a, b, c) {
                var msg = "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n";
                msg += "AFTC.preload(): ERROR: PRELOADER STOPPED! \n";
                msg += "Error on [" + queItem.url + "]" + "\n";
                msg += "Error [" + b + "]" + "\n";
                msg += "Error [" + c + "]" + "\n";
                msg += "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #";
                console.error(msg);
                params.error = true;
            }
        });


    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function loadNow(url, onComplete) {
        //log("AFTC.preload.loadNow(url,onComplete): " + url);

        if (typeof (url) == "array") {
            for (var i = 0; i < url.length; i++) {
                if (i = (url.length - 1)) {
                    loadNow(url[i], onComplete);
                } else {
                    loadNow(url[i], null);
                }

            }
            return;
        }

        var ext = url.split('.').pop();

        $.ajax({
            url: url,
            success: function () {
                //log("AFTC.preload.loadNow(): Sucesss: " + url);

                // Attach any JavaScript to the page that is on the preload list
                if (ext == "js") {
                    var script = document.createElement('script');
                    script.onload = function () {
                        if (onComplete || onComplete != undefined) {
                            onComplete();
                        }
                    };
                    script.src = url;
                    document.head.appendChild(script); //or something of the likes

                } else if (ext == "css") {
                    var head = document.getElementsByTagName('head')[0];
                    var link = document.createElement('link');
                    //link.id   = cssId;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = queItem.url;
                    link.media = 'all';
                    link.onload = function () {
                        if (onComplete || onComplete != undefined) {
                            onComplete();
                        }
                    };
                    head.appendChild(link);
                } else {
                    if (onComplete || onComplete != undefined) {
                        onComplete();
                    }
                }


            },
            error: function (a, b, c) {
                var msg = "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n";
                msg += "AFTC.preload.loadNow(): !ERROR! \n";
                msg += "Error on [" + url + "]" + "\n";
                msg += "Error [" + b + "]" + "\n";
                msg += "Error [" + c + "]" + "\n";
                msg += "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #";
                console.error(msg);
                params.error = true;
            }

        });
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function onComplete() {
        //log("AFTC.preload.onComplete()");

        if (params.onComplete) {
            params.onComplete();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function onError() {
        if (params.onError) {
            params.onError();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function onItemLoaded(item) {
        //log("AFTC.preload.onItemLoaded(): " + item.url);
        params.percentLoaded = ((100 / params.que.length) * params.noOfFilesLoaded) * 100;
        params.percentLoaded = Math.round(params.percentLoaded) / 100;
        //log("AFTC.preload.onItemLoaded(): percentLoaded: " + params.percentLoaded);
        if (params.onProgress) {
            params.onProgress(params.percentLoaded);
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Public / Return exposed
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    return {
        add: function () {
            var o = {
                id: null,
                url: "",
                type: null,
                preloading: false,
                preloaded: false,
                index: -1,
                batchIndex: -1
            }

            // Process object arguments
            if (arguments[0] && typeof (arguments[0]) == "object") {

                for (var key in arguments[0]) {
                    if (arguments[0].hasOwnProperty(key)) {
                        o[key] = arguments[0][key];
                    }
                }
            }

            params.que.push(o);
        },

        start: function () {
            start();
        },

        noOfFilesLoaded: function () {
            return params.noOfFilesLoaded;
        },

        percent: function () {
            return params.percentLoaded;
        },

        debug: function () {
            log("");
            log("AFTC Preloader:");
            log(params);
            log("");
        },

        loadNow: function (url, onComplete) {
            loadNow(url, onComplete);
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -