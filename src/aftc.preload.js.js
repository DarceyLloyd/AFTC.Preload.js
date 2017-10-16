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




