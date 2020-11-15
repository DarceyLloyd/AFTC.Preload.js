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


