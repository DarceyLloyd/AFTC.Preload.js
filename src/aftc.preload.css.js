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
        fileVo.loaded = 100;
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
        fileVo.loaded = 0;
        me.params.noOfFilesFailed++;

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    }
    head.appendChild(link);

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




