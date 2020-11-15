/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.img.js
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.jsLoadImage = function (fileVo) {
    //log("AFTC.Preloader.prototype.jsLoadImage()");
    fileVo.jsLoading = true;

    var me = this;

    var newElement = document.createElement("img");
    if (fileVo.id != null && fileVo.id != ""){
        newElement.id = fileVo.id;
    }
    newElement.width = fileVo.imgWidth;
    newElement.height = fileVo.imgHeight;
    newElement.className = "img-test";
    newElement.onload = function(e){

        fileVo.jsLoading = false;
        fileVo.jsSuccess = true;
        fileVo.jsProcessed = true;
        fileVo.done = true;
        me.params.noOfFilesLoaded++;
        //log("AFTC.Preloader.prototype.jsLoadImage(fileVo): SUCCESS - " + fileVo.url);

        if (me.params.attachImagesToDom){
            var imageContainer = document.getElementById(me.params.domElementToAttachImagesTo);
            if (imageContainer){
                imageContainer.appendChild(newElement);
            }
        }

        // Batch proceed
        me.removeFileFromBatch(fileVo);
    }
    newElement.onerror = function(e){
        //log("AFTC.Preloader.prototype.jsLoadImage(fileVo): ERROR - " + fileVo.url);
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
    newElement.src = url;

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

