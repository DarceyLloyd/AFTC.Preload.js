/*
 * Author: Darcey@AllForTheCode.co.uk
 * Version: 1.0.4
*/

// Ensure my lazy logger is available
if (!log) { function log(arg) { if (console) { console.log(arg); } } }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var AFTC = AFTC || {}

AFTC.Preloader = function () {
    log("AFTC.Preloader()");

    // Var defs
    var me = this;

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
        onError: null,
        stopOnError: false
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {

        for (var key in arguments[0]) {
            if (params.hasOwnProperty(key)) {
                params[key] = arguments[0][key];
            } else {
                console.error("AFTC.Preloader: Usage Error - Unknown paramater [" + key + "]");
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function start() {
        log("AFTC.Preloader.start()");

        params.noOfFilesLoaded = 0;
        params.noOfJSFiles = 0;
        params.noOfCSSFiles = 0;

        // Do counts for certain file types
        for (var i = 0; i < params.que.length; i++) {
            var queItem = params.que[i];
            var ext = queItem.url.split('.').pop();

            if (ext == "js") {
                params.noOfJSFiles++;
            }
            if (ext == "css") {
                params.noOfCSSFiles++;
            }
        }

        batchProcessor();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function getItemFromQue() {
        log("AFTC.Preloader.getItemFromQue()");

        for (var i = 0; i < params.que.length; i++) {
            var queItem = params.que[i];
            if (!queItem.preloading && !queItem.preloaded && !queItem.failed) {

                var ext = queItem.url.split('.').pop();

                // Process order
                // 1. JavaScript
                // 2. CSS (No need - but left in just encase)
                // 3. Everything else

                // Are we looking for "javascript", "css" or * file types
                if (params.noOfJSFilePreloaded < params.noOfJSFiles) {
                    log("AFTC.Preloader.getItemFromQue(): JavaScript files:  noOfJSFilePreloaded:" + params.noOfJSFilePreloaded + "  noOfJSFiles:" + params.noOfJSFiles);
                    // JS
                    if (ext == "js") {
                        queItem.preloading = true;
                        queItem.index = i;
                        return queItem;
                    }
                    // } else if (params.noOfCSSFilesPreloaded < params.noOfCSSFiles) {
                    //     log("AFTC.Preloader.getItemFromQue(): CSS files:  noOfCSSFilesPreloaded:" + params.noOfCSSFilesPreloaded + "  noOfCSSFiles:" + params.noOfCSSFiles);
                    //     // CSS
                    //     if (ext == "css") {
                    //         queItem.preloading = true;
                    //         queItem.index = i;
                    //         return queItem;
                    //     }
                } else {
                    log("AFTC.Preloader.getItemFromQue(): Generic");
                    // Any file type other than JS and CSS
                    //if (ext != "javascript" && ext != "css") {
                    if (ext != "js") {
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

            if (params.stopOnError){
                log("AFTC.Preloader.batchProcessor(): Stopping on error!");
                return false;
            }
        } else {
            log("AFTC.Preloader.batchProcessor()");
        }


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

            log("----BATCH---- " + batchesInUse + "/" + (params.batchSize - 1));
            log(params.batch);

            // This calls loaders on each iteration, resulting in sequential loading
            for (var i = 0; i < params.batchSize; i++) {
                if (params.batch[i] == null) {
                    queItem = getItemFromQue();

                    if (queItem != null) {
                        log("--- Attaching " + queItem.url + " to batch @ [" + i + "]");
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


    Object.prototype.extend = function(obj) {
        for (var i in obj) {
           if (obj.hasOwnProperty(i)) {
              this[i] = obj[i];
           }
        }
     };
     


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function preloadFile(queItem) {
        log("AFTC.Preloader.preloadFile(): " + queItem.url);
        log(queItem);
        if (queItem.url == "" || queItem.url == null) {
            var msg = "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n";
            msg += "AFTC.Preloader.preloadFile(): ERROR! \n";
            msg += "queItem.url: [" + queItem.url + "]" + "\n";
            msg += "queItem.id: [" + queItem.id + "]" + "\n";
            msg += "queItem.preloading: [" + queItem.preloading + "]" + "\n";
            msg += "queItem.preloaded: [" + queItem.preloaded + "]" + "\n";
            msg += "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #";
            console.error(msg);
            params.error = true;
            return false;
        }

        var ext = queItem.url.split('.').pop();

        moo();

        switch (ext) {
            case "js":
                var script = document.createElement('script');
                script.onload = function () {
                    // Load, Attach/Parse, Complete, Next!
                    queItem.preloading = false;
                    queItem.preloaded = true;
                    queItem.failed = false;
                    params.noOfJSFilePreloaded++;
                    params.noOfFilesLoaded++;
                    log("AFTC.Preloader.preloadFile(): JS File [" + queItem.url + "] has been attached to the DOM!");
                    onItemLoaded(queItem);
                    batchProcessor();
                };
                script.onerror = function (e) {
                    // Error - Probably can't find script or cross origin issue
                    console.error("AFTC.Preloader.preloadFile(): Error preloading [" + queItem.url + "]");
                    console.error(e);
                    queItem.failed = true;
                    params.error = true;
                }
                script.src = queItem.url;
                document.head.appendChild(script);
                break;
            default:

                break;
        }




        // $.ajax({
        //     url: queItem.url,
        //     success: function () {
        //         log("AFTC.Preloader.preloadFile(): Sucesss: " + queItem.url);

        //         // Attach any JavaScript to the page that is on the preload list
        //         if (ext == "js") {
        //             var script = document.createElement('script');
        //             script.onload = function () {
        //                 // Load & Parse Complete, Next!
        //                 queItem.preloading = false;
        //                 queItem.preloaded = true;
        //                 params.noOfJSFilePreloaded++;
        //                 params.noOfFilesLoaded++;
        //                 log("AFTC.Preloader.preloadFile(): JS File [" + queItem.url + "] has been attached to the DOM!");
        //                 onItemLoaded(queItem);
        //                 batchProcessor();
        //             };
        //             script.src = queItem.url;
        //             document.head.appendChild(script); //or something of the likes

        //         } else if (ext == "css") {
        //             var head = document.getElementsByTagName('head')[0];
        //             var link = document.createElement('link');
        //             //link.id   = cssId;
        //             link.rel = 'stylesheet';
        //             link.type = 'text/css';
        //             link.href = queItem.url;
        //             link.media = 'all';
        //             link.onload = function () {
        //                 // Load & Parse Complete, Next!
        //                 queItem.preloading = false;
        //                 queItem.preloaded = true;
        //                 params.noOfCSSFilesPreloaded++;
        //                 params.batch[queItem.batchIndex] = null;
        //                 params.noOfFilesLoaded++;
        //                 log("AFTC.Preloader.preloadFile(): CSS File [" + queItem.url + "] has been attached to the DOM!");
        //                 onItemLoaded(queItem);
        //                 batchProcessor();
        //             };
        //             head.appendChild(link);
        //         } else {
        //             queItem.preloading = false;
        //             queItem.preloaded = true;
        //             params.batch[queItem.batchIndex] = null;
        //             params.noOfFilesLoaded++;
        //             onItemLoaded(queItem);
        //             batchProcessor();
        //         }


        //     },
        //     error: function (a, b, c) {
        //         var msg = "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n";
        //         msg += "AFTC.Preloader.preloadFile(): ERROR! \n";
        //         msg += "Error on [" + queItem.url + "]" + "\n";
        //         msg += "Error [" + b + "]" + "\n";
        //         msg += "Error [" + c + "]" + "\n";
        //         msg += "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #";
        //         console.error(msg);
        //         params.error = true;
        //     }
        // });


    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function loadNow(url, onComplete) {
        log("AFTC.Preloader.loadNow(url,onComplete): " + url);

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

        // $.ajax({
        //     url: url,
        //     success: function () {
        //         log("AFTC.Preloader.loadNow(): Sucesss: " + url);

        //         // Attach any JavaScript to the page that is on the preload list
        //         if (ext == "js") {
        //             var script = document.createElement('script');
        //             script.onload = function () {
        //                 if (onComplete || onComplete != undefined) {
        //                     onComplete();
        //                 }
        //             };
        //             script.src = url;
        //             document.head.appendChild(script); //or something of the likes

        //         } else if (ext == "css") {
        //             var head = document.getElementsByTagName('head')[0];
        //             var link = document.createElement('link');
        //             //link.id   = cssId;
        //             link.rel = 'stylesheet';
        //             link.type = 'text/css';
        //             link.href = queItem.url;
        //             link.media = 'all';
        //             link.onload = function () {
        //                 if (onComplete || onComplete != undefined) {
        //                     onComplete();
        //                 }
        //             };
        //             head.appendChild(link);
        //         } else {
        //             if (onComplete || onComplete != undefined) {
        //                 onComplete();
        //             }
        //         }


        //     },
        //     error: function (a, b, c) {
        //         var msg = "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n";
        //         msg += "AFTC.Preloader.loadNow(): !ERROR! \n";
        //         msg += "Error on [" + url + "]" + "\n";
        //         msg += "Error [" + b + "]" + "\n";
        //         msg += "Error [" + c + "]" + "\n";
        //         msg += "# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #";
        //         console.error(msg);
        //         params.error = true;
        //     }

        // });
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function onComplete() {
        log("AFTC.Preloader.onComplete()");

        if (params.onComplete) {
            params.onComplete();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function onError() {
        log("AFTC.Preloader.onError()");

        if (params.onError) {
            params.onError();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function onItemLoaded(item) {
        log("AFTC.Preloader.onItemLoaded(): " + item.url);
        params.percentLoaded = ((100 / params.que.length) * params.noOfFilesLoaded) * 100;
        params.percentLoaded = Math.round(params.percentLoaded) / 100;
        log("AFTC.Preloader.onItemLoaded(): percentLoaded: " + params.percentLoaded);
        if (params.onProgress) {
            params.onProgress(params.percentLoaded);
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Public / Return exposed
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var public =
        {
            add: function () {
                log("AFTC.Preloader.add({}): " + arguments[0].url);
                var o = {
                    id: null,
                    url: "",
                    //type: "",
                    preloading: false,
                    preloaded: false,
                    failed: false,
                    index: -1,
                    batchIndex: -1
                }

                // Process arguments
                if (arguments[0] && typeof (arguments[0]) == "object") {

                    for (var key in arguments[0]) {
                        if (arguments[0].hasOwnProperty(key)) {
                            o[key] = arguments[0][key];
                        } else {
                            console.error("AFTC.Preloader.add(): ERROR: Unknown paramater: [" + key + "]");
                        }
                    }
                }

                if (o.url != null || o.url != "") {
                    params.que.push(o);
                } else {
                    console.error("AFTC.Preloader.add(): ERROR: Incorrect use of AFTC.Preloader.add() function! No url object passed!");
                }

                // Allows chaining
                return public;
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

    return public;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -