/*
 * Author: Darcey@AllForTheCode.co.uk
 * AFTC.Preloader.public - Public functions go in here
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Preloader.prototype.add = function () {
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
        if (!o.cache) {
            o.urlCacheString = ("?c=" + Math.round(Math.random() * 9999999999));
        }

        // isImage
        if (o.ext == "png" || o.ext == "jpg" || o.ext == "jpeg" || o.ext == "png" || o.ext == "gif" || o.ext == "bmp" || o.ext == "svg") {
            o.isImage = true;
        }

        if (o.ext == "js") {
            this.params.noOfJSFiles++;

        }

        this.params.que.push(o);
        //log(o);
        // log(o.id + "," + o.url + "," + o.cache);


    } else {
        console.error("AFTC.Preloader.prototype.add(): ERROR: Function argument url missing!");
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


AFTC.Preloader.prototype.getItemById = function (id) {
    // log("AFTC.Preloader.getItemById(id:" + id + ")");
    var found = false;
    for (var i = 0; i < this.params.que.length; i++) {
        if (this.params.que[i].id == id) {
            found = true;
            break;
        }
    }

    if (!found) {
        console.error("AFTC.Preloader.getItemById(): Error, unable to find a preload item with an id of [" + id + "]");
        return false;
    } else {
        switch (this.params.que[i].ext.toLowerCase()) {
            case "jpg":
                return this.fetchImage(this.params.que[i]);
                break;
            case "gif":
                return this.fetchImage(this.params.que[i]);
                break;
            case "png":
                return this.fetchImage(this.params.que[i]);
                break;
            case "bmp":
                return this.fetchImage(this.params.que[i]);
                break;
            case "js":
                return this.params.que[i].data;
                break;
            case "css":
                return this.params.que[i].data;
                break;
            case "json":
                return this.params.que[i].data;
                break;
            case "svg":
                return this.getSVGById(id);
                break;
            case "txt":
                return this.params.que[i].data;
                break;
        }
    }
}

AFTC.Preloader.prototype.fetchImage = function (fileVo) {
    // log("AFTC.Preloader.fetchImage(fileVo): fileVo.url = " + fileVo.url);
    var img = new Image();
    // img.onload = function(){ };
    img.src = fileVo.url;
    return img;
}




AFTC.Preloader.prototype.getSVGById = function (id) {
    for (var i = 0; i < this.params.svgs.length; i++) {
        var oSVG = this.params.svgs[i];
        if (oSVG.id == id) {
            // You can access to the SVG DOM when you attach it to the DOM via innerHTML

            //var xmlns = "http://www.w3.org/2000/svg";
            //var svg = document.createElementNS (xmlns, "svg");

            //var element = document.getElementById("preloader");
            //element.innerHTML = oSVG.svg;
            //var layer1 = document.getElementById("Layer1");
            //log(layer1.style.opacity = 0.5);

            return (oSVG.svg);
        }
    }

    return null;
}