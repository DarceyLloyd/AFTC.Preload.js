import { argsToObject, objectToObject, log, getFileExtension  } from "./node_modules/aftc-modules/aftc-modules.js";


export class AFTCPreloader {  

    ItemVo = function () {
        this.id = false;
        this.src = false;
        this.ext = false;
        this.loaded = false;
        this.loading = false;
        this.autoAttach = true;
    }

    XHRLoader = function (parent, threadIndex, queueIndex, src) {
        // log("XHRLoader(parent, threadIndex, queueIndex, src)");
        this.parent = parent;
        this.threadIndex = threadIndex;
        this.queueIndex = queueIndex;
        this.src = src;

        this.xhr = new XMLHttpRequest();
        this.xhr.onload = (e) => {
            this.onLoadHandler(e);
        };

        // this.xhr.addEventListener("progress", () => this.updateHandler, false);
        // this.xhr.addEventListener("load", transferComplete);
        // this.xhr.addEventListener("error", transferFailed);
        // this.xhr.addEventListener("abort", transferCanceled);
        // Detect abort, load, or error using the loadend event
        // this.xhr.addEventListener("loadend", () => this.loadEndHandler, false);

        this.xhr.open('GET', this.src, true);
        this.xhr.send();
        this.updateHandler = function (e) {

        }
        // - - - - - - - - - - -

        this.onLoadHandler = function (e) {
            // log("XHRLoader.onLoadHandler(): " + this.src);
            this.parent.onFileLoaded(this.threadIndex, this.queueIndex);
            this.xhr = null;
        }
        // - - - - - - - - - - -
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor() {
        log("AFTCPreloader()");

        this.onProgressHandler = "";
        this.onCompleteHandler = "";
    
        this.queue = [];
        this.noOfFilesToLoad = 0;
    
        this.json = false;
    
        this.noOfThreads = 3;
        this.thread = []; // [0] > [noOfThreads] = "available" || "filled"
    
        this.queueCompleted = false;
    
        this.timer = false;

        argsToObject(arguments, this, true);

        this.head = document.getElementsByTagName('head')[0] || document.body;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    help() {
        let msg = "";
        msg += "AFTCPreloader.help()" + "\n";
        msg += "JSON: [ {src:path,autoAttach=true} ]" + "\n";
        msg += "autoAttach is optional, defaults to true, only works for css and js file extensions" + "\n";
        log(msg);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    add(id, src, autoAttach = true) {
        // log("AFTCPreloader.add(id,src,autoAttach=true)");
        let entry = this.ItemVo();
        entry.id = id;
        entry.src = src;
        entry.autoAttach = autoAttach;
        this.queue.push(entry);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    start(jsonPath) {
        log("AFTCPreloader.start()");

        // init
        for (let i = 0; i < this.noOfThreads; i++) {
            this.thread[i] = "available";
        }

        if (jsonPath) {
            // Using JSON file to add files to the queue
            this.loadConfig(jsonPath);
        } else {
            // Using add() to add files to the queue
            this.noOfFilesToLoad = this.queue.length;
            this.processThreadPool();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    loadConfig(path) {
        // log("AFTCPreloader.loadConfig(path:" + path + ")");

        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                this.json = JSON.parse(xhr.responseText);
                // log(this.json);
                this.json.forEach(jsonEntry => {
                    let vo = new this.ItemVo();
                    new objectToObject(jsonEntry, vo, false)
                    vo.ext = getFileExtension(vo.src);
                    this.queue.push(vo);
                });

                // log(this.queue);
                this.noOfFilesToLoad = this.queue.length;
                this.processThreadPool();
            }
        };

        xhr.send();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    




    processThreadPool() {
        // log("AFTCPreloader.processThreadPool()");

        let activeThreads = 0;

        for (let threadIndex = 0; threadIndex < this.noOfThreads; threadIndex++) {
            if (this.thread[threadIndex] === "available") {
                // Destructure
                let queueIndex, itemVo;
                [queueIndex, itemVo] = this.getNext();
                // log(itemVo);
                if (itemVo !== false) {
                    // log("\n#### Thread ["+ threadIndex + "] -------");
                    // log("threadIndex: " + threadIndex + "   queueIndex: " + queueIndex);
                    // log(itemVo);
                    this.thread[threadIndex] = "filled";
                    itemVo.loading = true;
                    new this.XHRLoader(this, threadIndex, queueIndex, itemVo.src);
                    activeThreads++;
                }
            }
        }

        // If all threads are inactive then we are done
        let preloaderComplete = true;
        for (let i = 0; i < this.noOfThreads; i++) {
            if (this.thread[i] !== "available") {
                preloaderComplete = false;
            }
        }

        if (preloaderComplete) {
            log("AFTCPreloader(): Complete!");
            if (this.onCompleteHandler) {
                this.onCompleteHandler();
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    onFileLoaded(threadIndex, queueIndex) {
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
                let link  = document.createElement('link');
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = vo.src;
                link.media = 'all';
                this.head.appendChild( link );
            }
        }

        if (this.onProgressHandler) {
            let percent = 0;
            let noOfFilesLoaded = 0;
            this.queue.forEach(vo => {
                if (vo.loaded) {
                    noOfFilesLoaded++;
                }
            });
            percent = Math.round((100 / this.noOfFilesToLoad) * noOfFilesLoaded);

            this.onProgressHandler(percent, this.queue[queueIndex].src);
        }



        this.processThreadPool();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    getNext() {
        let queueIndex = -1;
        let itemVo = false;

        for (let i = 0; i < this.queue.length; i++) {
            let entry = this.queue[i];
            if (entry.loaded === false && entry.loading === false) {
                queueIndex = i;
                itemVo = entry;
                break;
            }
        }
        return [queueIndex, itemVo];
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}