/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0
 * https://w3c.github.io/preload/
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { console.log(arg); } }

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
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if (arguments[0] && typeof (arguments[0]) == "object") {

        if (arguments[0].app) {
            // Access to DThree can be had via app but is not necessary: var app = arguments[0].app;
            // var scene = app.getScene();
            // var sceneParams = app.getSceneParams();
            app = arguments[0].app;
            renderer = app.getRenderer();
            scene = app.getScene();
        }

        if (arguments[0].onComplete) { params.onComplete = arguments[0].onComplete; }
        if (arguments[0].onComplete) { params.onProgress = arguments[0].onProgress; }
        if (arguments[0].batchSize) { params.batchSize = arguments[0].batchSize; }

    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function start() {
        //console.log("AFTC.Preloader.start()");

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
        //log("AFTC.Preloader.getItemFromQue()");

        for (var i = 0; i < params.que.length; i++) {
            var queItem = params.que[i];
            if (!queItem.preloading && !queItem.preloaded) {

                // Process order
                // 1. JavaScript
                // 2. CSS (No need - but left in just encase)
                // 3. Everything else

                // Are we looking for "javascript", "css" or * file types
                if (params.noOfJSFilePreloaded < params.noOfJSFiles) {
                    //log("AFTC.Preloader.getItemFromQue(): JavaScript files:  noOfJSFilePreloaded:" + params.noOfJSFilePreloaded + "  noOfJSFiles:" + params.noOfJSFiles);
                    // JS
                    if (queItem.type == "javascript") {
                        queItem.preloading = true;
                        queItem.index = i;
                        return queItem;
                    }
                    // } else if (params.noOfCSSFilesPreloaded < params.noOfCSSFiles) {
                    //     log("AFTC.Preloader.getItemFromQue(): CSS files:  noOfCSSFilesPreloaded:" + params.noOfCSSFilesPreloaded + "  noOfCSSFiles:" + params.noOfCSSFiles);
                    //     // CSS
                    //     if (queItem.type == "css") {
                    //         queItem.preloading = true;
                    //         queItem.index = i;
                    //         return queItem;
                    //     }
                } else {
                    //log("AFTC.Preloader.getItemFromQue(): Generic");
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

        //log("AFTC.Preloader.batchProcessor()");


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
        //log("AFTC.Preloader.preloadFile(): " + queItem.url);
        //log(queItem);

        var ext = queItem.url.split('.').pop();

        $.ajax({
            url: queItem.url,
            success: function () {
                //log("AFTC.Preloader.preloadFile(): Sucesss: " + queItem.url);

                // Attach any JavaScript to the page that is on the preload list
                if (queItem.type == "javascript") {
                    var script = document.createElement('script');
                    script.onload = function () {
                        // Load & Parse Complete, Next!
                        queItem.preloading = false;
                        queItem.preloaded = true;
                        params.noOfJSFilePreloaded++;
                        params.noOfFilesLoaded++;
                        //log("AFTC.Preloader.preloadFile(): JS File [" + queItem.url + "] has been attached to the DOM!");
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
                        //log("AFTC.Preloader.preloadFile(): CSS File [" + queItem.url + "] has been attached to the DOM!");
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
                msg += "AFTC.Preloader(): ERROR: PRELOADER STOPPED! \n";
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
        //log("AFTC.Preloader.loadNow(url,onComplete): " + url);
        
        if (typeof(url) == "array"){
            for (var i = 0; i < url.length; i++) {
                if (i = (url.length-1)){
                    loadNow(url[i],onComplete);
                } else {
                    loadNow(url[i],null);
                }
                
            }
            return;
        }

        var ext = url.split('.').pop();

        $.ajax({
            url: url,
            success: function () {
                //log("AFTC.Preloader.loadNow(): Sucesss: " + url);

                // Attach any JavaScript to the page that is on the preload list
                if (ext == "js") {
                    var script = document.createElement('script');
                    script.onload = function () {
                        if (onComplete || onComplete != undefined){
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
                        if (onComplete || onComplete != undefined){
                            onComplete();
                        }
                    };
                    head.appendChild(link);
                } else {
                    if (onComplete || onComplete != undefined){
                        onComplete();
                    }
                }


            },
            error: function (a, b, c) {
                var msg = "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n";
                msg += "AFTC.Preloader.loadNow(): !ERROR! \n";
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
        //log("AFTC.Preloader.onComplete()");

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
        //log("AFTC.Preloader.onItemLoaded(): " + item.url);
        params.percentLoaded = ((100 / params.que.length) * params.noOfFilesLoaded) * 100;
        params.percentLoaded = Math.round(params.percentLoaded) / 100;
        //log("AFTC.Preloader.onItemLoaded(): percentLoaded: " + params.percentLoaded);
        if (params.onProgress) {
            params.onProgress(params.percentLoaded);
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Public / Return exposed
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    return {
        add: function (id, url, type) {
            var o = {
                id: id,
                url: url,
                type: type,
                preloading: false,
                preloaded: false,
                index: -1,
                batchIndex: -1
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