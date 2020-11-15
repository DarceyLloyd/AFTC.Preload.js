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





