let AFTCPreloader = function (args) {

    me = this;

    options = {
        onProgressHandler: false,
        onCompleteHandler: false,
    }

    queue = [];
    noOfFilesToLoad = 0;

    json = false;

    noOfThreads = 3;
    thread = []; // [0] > [noOfThreads] = "available" || "filled"

    queueCompleted = false;

    head = false;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Constructor (function class forced auto run)
    function constructor() {
        log("AFTCPreloader()");

        objectToObject(args, options, true);

        head = document.getElementsByTagName('head')[0] || document.body;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    this.add = function (src, autoAttach) {
        if (!autoAttach) {
            autoAttach = true;
        }

        let entry = this.ItemVo();
        entry.src = src;
        entry.autoAttach = autoAttach;
        queue.push(entry);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    init = function (jsonFilePath) {
        // init
        for (let i = 0; i < noOfThreads; i++) {
            thread[i] = "available";
        }

        if (jsonFilePath) {
            // Using JSON file to add files to the queue
            loadConfig(jsonFilePath);
        } else {
            // Using add() to add files to the queue
            noOfFilesToLoad = queue.length;
            processThreadPool();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    loadConfig = function (path) {
        // log("AFTCPreloader.loadConfig(path:" + path + ")");

        let xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                json = JSON.parse(xhr.responseText);
                // log(json);
                json.forEach(jsonEntry => {
                    // log(jsonEntry);
                    let vo = new ItemVo();
                    if (jsonEntry.hasOwnProperty("autoAttach")) {
                        vo.autoAttach = jsonEntry.autoAttach;
                    }
                    vo.src = jsonEntry.src;
                    vo.ext = getFileExtension(vo.src);
                    queue.push(vo);
                });

                // log(this.queue);
                noOfFilesToLoad = queue.length;
                processThreadPool();
            }
        };

        xhr.send();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    processThreadPool = function () {
        // log("AFTCPreloader.processThreadPool()");

        let activeThreads = 0;

        for (let threadIndex = 0; threadIndex < noOfThreads; threadIndex++) {
            if (thread[threadIndex] === "available") {
                let v = getNext();
                // log(v);
                let queueIndex = v[0];
                let itemVo = v[1];

                // log(itemVo);
                if (itemVo !== false) {
                    // log("\n########## threadIndex: " + threadIndex + "   queueIndex: " + queueIndex);
                    // log(itemVo);
                    thread[threadIndex] = "filled";
                    itemVo.loading = true;
                    new XHRLoader(this, threadIndex, queueIndex, itemVo.src);
                    activeThreads++;
                }
            }
        }

        // If all threads are inactive then we are done
        let preloaderComplete = true;
        for (let i = 0; i < noOfThreads; i++) {
            if (thread[i] !== "available") {
                preloaderComplete = false;
            }
        }

        if (preloaderComplete) {
            log("AFTCPreloader(): Complete!");
            if (this.options.onCompleteHandler) {
                this.options.onCompleteHandler();
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    onFileLoaded = function (threadIndex, queueIndex) {
        // log("AFTCPreloader.onFileLoaded(threadIndex:"+threadIndex+",queueIndex:"+queueIndex+")");
        let vo = this.queue[queueIndex];
        vo.loading = false;
        vo.loaded = true;
        this.thread[threadIndex] = "available";

        // Handle attach to dom

        if (this.queue[queueIndex].autoAttach === true) {
            if (vo.ext == "js") {
                // Attach JS to DOM
                let script = document.createElement('script');
                // script.onload = ()=> {
                //     console.log("Script attached to DOM: " + vo.src);
                // }
                script.src = vo.src;
                document.head.appendChild(script);

            } else if (vo.ext == "css") {
                // Attach CSS to DOM
                let link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = vo.src;
                link.media = 'all';
                head.appendChild(link);
            }
        }

        if (this.options.onProgressHandler) {
            let percent = 0;
            let noOfFilesLoaded = 0;
            for (let i = 0; i < queue.length; i++) {
                let vo = queue[i];
                if (vo.loaded) {
                    noOfFilesLoaded++;
                }
            }
            percent = Math.round((100 / noOfFilesToLoad) * noOfFilesLoaded);

            options.onProgressHandler(percent, queue[queueIndex].src);
        }

        processThreadPool();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    getNext = function () {
        let queueIndex = -1;
        let itemVo = false;

        for (let i = 0; i < queue.length; i++) {
            let entry = queue[i];
            if (entry.loaded === false && entry.loading === false) {
                queueIndex = i;
                itemVo = entry;
                break;
            }
        }
        return [queueIndex, itemVo];
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -







    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Public functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    this.help = function () {
        let msg = "";
        msg += "AFTCPreloader.help()" + "\n";
        msg += "JSON: [ {src:path,autoAttach=true} ]" + "\n";
        msg += "autoAttach is optional, defaults to true, only works for css and js file extensions" + "\n";
        log(msg);
    }

    this.start = function (jsonFilePath) {
        log("AFTCPreloader.start()");

        init(jsonFilePath);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -








    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Utility functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    log = function (arg) {
        console.log(arg);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    ItemVo = function () {
        this.id = false;
        this.src = false;
        this.ext = false;
        this.loaded = false;
        this.loading = false;
        this.autoAttach = true;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    XHRLoader = function (parent, threadIndex, queueIndex, src) {
        // log("XHRLoader(parent, threadIndex, queueIndex, src)");

        let me = this;
        let xhr = new XMLHttpRequest();

        xhr.onload = function (e) {
            // log(parent);
            parent.onFileLoaded(threadIndex, queueIndex);
            xhr = null;
        };

        // this.xhr.addEventListener("progress", () => this.updateHandler, false);
        // this.xhr.addEventListener("load", transferComplete);
        // this.xhr.addEventListener("error", transferFailed);
        // this.xhr.addEventListener("abort", transferCanceled);
        // Detect abort, load, or error using the loadend event
        // this.xhr.addEventListener("loadend", () => this.loadEndHandler, false);

        xhr.open('GET', src, true);
        xhr.send();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    getFileExtension = function (input) {
        return input.slice((input.lastIndexOf(".") - 1 >>> 0) + 2);
        // return (input.match(/(?:.+..+[^\/]+$)/ig) != null) ? input.split('.').slice(-1) : 'null';

    }

    objectToObject = function (a, b, strict) {

        if (strict == undefined) { strict = true; }

        for (var key in a) {
            if (strict) {
                if (b.hasOwnProperty(key)) {
                    b[key] = a[key];
                } else {
                    console.warn("argsToObject(): Argument [" + key + "] is not available.");
                }
            } else {
                b[key] = a[key];
            }
        }
    }



    // Constructor autorun simulation
    constructor();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}