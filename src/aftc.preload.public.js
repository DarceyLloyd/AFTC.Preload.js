/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.public - Public functions go in here
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.add = function (obj) {
    //log("AFTC.Preloader.prototype.add(obj): " + arguments[0].url);

    var o = new AFTC.Preloader.FileVo();

    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {
        for (var key in arguments[0]) {
            if (o.hasOwnProperty(key)) {
                o[key] = arguments[0][key];
            } else {
                console.error("AFTC.Preloader.prototype.add(): ERROR: Unknown paramater: [" + key + "]");
            }
        }
    }

    if (o.url != null || o.url != "") {

        o.ext = o.url.split('.').pop();

        // Cache
        if (!this.params.cache || !o.cache){
            o.urlCacheString = ("?c=" + Math.round(Math.random() * 9999999999));
        }

        // isImage
        if (o.ext == "png" || o.ext == "jpg" || o.ext == "jpeg" || o.ext == "png" || o.ext == "gif" || o.ext == "bmp" || o.ext == "svg"){
            o.isImage = true;
        }

        if (o.ext == "js") {
            this.params.noOfJSFiles++;

        }

        this.params.que.push(o);


    } else {
        console.error("AFTC.Preloader.prototype.add(): ERROR: Function argument object.url missing!");
    }

    // Allow chaining
    return this;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.start = function () {
    //log("AFTC.Preloader.prototype.start()");
    this.init();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.loadNow = function (obj) {
    //log("AFTC.Preloader.prototype.loadNow(obj)");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




AFTC.Preloader.prototype.getSVGById = function(id){
    for (var i=0; i < this.params.svgs.length; i++){
        var oSVG = this.params.svgs[i];
        if (oSVG.id == id){
            // You can access to the SVG DOM when you attach it to the DOM via innerHTML

            //var xmlns = "http://www.w3.org/2000/svg";
            //var svg = document.createElementNS (xmlns, "svg");

            //var element = document.getElementById("preloader");
            //element.innerHTML = oSVG.svg;
            //var layer1 = document.getElementById("Layer1");
            //log(layer1.style.opacity = 0.5);

            return(oSVG.svg);
        }
    }

    return null;
}