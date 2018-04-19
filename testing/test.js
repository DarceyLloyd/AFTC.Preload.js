log("Darcey@AllForTheCode.co.uk - Development Tests for AFTC.Preload.js");
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var myPreloader,
    i,
    noOfCSSFilesGenerated = 10,
    noOfStylesGenerated = 2500,
    noOfJSFilesGenerated = 10,
    noOfJSFunctionsGenerated = 2500,
    html = "",
    fileNo = 0;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function setupVisualTestContent() {
    html = "";
    for (fileNo = 1; fileNo <= noOfCSSFilesGenerated; fileNo++) {
        html += "<div id='css-" + fileNo + "-complete' class='bg-red'>CSS File " + fileNo + " Parsed</div>";
    }
    document.getElementById("css-check-1").innerHTML = html;

    html = "";
    for (fileNo = 1; fileNo <= noOfCSSFilesGenerated; fileNo++) {
        for (styleNo = 0; styleNo <= noOfStylesGenerated; styleNo += 5) {
            if (styleNo <= noOfStylesGenerated && styleNo > 0) {
                html += "<span id='f-" + fileNo + "-st-" + styleNo + "' class='bg-red css-item'>" + fileNo + ":" + styleNo + "</span>";
            }
        }
        html += "<hr>";
    }
    //document.getElementById("css-check-2").innerHTML = html;


}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var preloaderBar,
    preloaderMessage,
    preloaderDetailsBox;

var js = [
    false, false, false, false, false, false, false, false, false, false, false
]
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var onProgressHandler = function (obj) {
    //log("window.onProgressHandler(obj): " + obj.xhrProgress + " " + obj.url);
    //log(obj.percentLoaded);

    if (preloaderBar) {
        preloaderBar.style.width = obj.percentLoaded + "%";
    }
    if (preloaderMessage) {
        preloaderMessage.innerHTML = "Total loaded " + obj.percentLoaded + "%";
    }


    // var html = "<table>";
    // for (var i=0; i < myPreloader.params.que.length; i++){
    //     var fileVo = myPreloader.params.que[i];
    //     html += "<tr>";
    //     html += "<td>" + fileVo.url + "</td>";
    //     html += "<td>" + fileVo.xhrProgress + "%</td>";
    //     html += "</tr>";
    // }
    // html += "</table>";
    // preloaderDetailsBox.innerHTML = html;

    var html = "";
    for (var i = 0; i < myPreloader.params.que.length; i++) {
        var fileVo = myPreloader.params.que[i];
        html += "<div class='subItem'>";
        html += "<span class='subItemTitle'>" + fileVo.url + "</span>";
        var cssBgClass = "bg-red";
        if (fileVo.xhrProgress >= 100) {
            cssBgClass = "bg-green";
        }
        html += "<span class='subItemBar " + cssBgClass + "'>" + fileVo.xhrProgress + "%</span>";
        html += "</div>";
    }
    html += "";
    preloaderDetailsBox.innerHTML = html;


    // run js functions as they become available
    if (obj.ext == "js") {

        for (var i = 1; i <= 10; i++) {
            var fn = "logFunctionFile" + i + "Complete";
            var jsFileFlag = "jsFile" + i + "FnCompleteRun";
            if (window[fn]) {
                if (!js[i]) {
                    js[i] = true;
                    window[fn]();
                }
            }
        }
    }

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



var t = 0;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var onCompleteHandler = function () {
    log("window.onCompleteHandler()");

    //var a = myPreloader.getItemById("json1");
    var img = new Image();
    img.onload = function(){
        log("10mb image loaded!");
    }
    img.src = "./img/10mb.jpg";
    //log(a);

    return;
    // Example of how to retrieve an SVG and access its DOM
    // NOTE: SVG Attached via preloader image attachment is image tag based and its DOM is not accessible
    // To access an SVG you need to retrieve the SVG as a string from the preloader via getSVGById
    // Then inject it into the DOM of your page via innerHTML, eg see below (make sure you set ids correctly on svg)

    // Attach SVG to DOM
    var mySVG = myPreloader.getSVGById("svg1");
    var svgContainer1 = document.querySelector("#svgDebug .svgContainer1");
    svgContainer1.innerHTML = mySVG;

    var svgInSVGContainer1 = document.getElementById("testSVG1");
    svgInSVGContainer1.setAttribute("width","300px");
    svgInSVGContainer1.setAttribute("height","300px");

    var svgLayer1 = document.querySelector("#testSVG1 #Layer1"); // Example of using querySelector
    var svgLayer2 = document.getElementById("Layer2"); // Example of using getElementBy

    var t = 0;

    function animate(){
        t += 0.1;
        var o1 = 0.5 + (Math.sin(t) * 0.5);
        var o2 = 0.5 + (Math.cos(t) * 0.5);
        svgLayer1.style.opacity = o1;
        svgLayer2.style.opacity = o2;
        requestAnimationFrame(animate);
    }
    animate();

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function init() {
    // var ini
    preloaderBar = document.querySelector("#preloader .bar");
    preloaderMessage = document.querySelector("#preloader .message");
    preloaderDetailsBox = document.querySelector("#preloader .details");


    setupVisualTestContent();


    myPreloader = new AFTC.Preloader({
        batchSize: 3,
        onComplete: onCompleteHandler,
        onProgress: onProgressHandler,
        cache: false,
        attachImagesToDom: true,
        domElementToAttachImagesTo: "imgDebug"
    });


    myPreloader
        .add({id:"img1", url: "img/img01.jpg", cache: true})
        .add({id:"img2", url: "img/img02.jpg"})
        .add({id:"img3", url: "img/img03.jpg"})
        .add({id:"img4", url: "img/img04.jpg"})
        .add({id:"img5", url: "img/img05.jpg"})
        .add({id:"img6", url: "img/img06.jpg"})
        .add({id:"img7", url: "img/img07.jpg"})
        .add({id:"img8", url: "img/img08.jpg"})
        .add({id:"img9", url: "img/img09.jpg"})
        .add({id:"img10", url: "img/img10.jpg"})
        .add({id:"img11", url: "img/10mb.jpg", cache: true})
        //
        .add({url: "generated/styles1.css", cache: true})
        .add({url: "generated/styles2.css"})
        .add({url: "generated/styles3.css"})
        .add({url: "generated/styles4.css"})
        .add({url: "generated/styles5.css"})
        .add({url: "generated/styles6.css"})
        .add({url: "generated/styles7.css"})
        .add({url: "generated/styles8.css"})
        .add({url: "generated/styles9.css"})
        .add({url: "generated/styles10.css"})
        // //
        .add({url: "generated/javascript1.js"})
        .add({url: "generated/javascript2.js"})
        .add({url: "generated/javascript3.js"})
        .add({url: "generated/javascript4.js"})
        .add({url: "generated/javascript5.js"})
        .add({url: "generated/javascript6.js"})
        .add({url: "generated/javascript7.js"})
        .add({url: "generated/javascript8.js"})
        .add({url: "generated/javascript9.js"})
        .add({url: "generated/javascript10.js"})
        // //
        .add({id: "json1", url: "names.json"});

    // var svgUID,
    //     file;

    // for (var i = 1; i <= 20; i++) {
    //     svgUID = "svg"+i;
    //     file = "svg/icons/icon_"+i+".svg";
    //     myPreloader.add({id:svgUID,url: file});
    // }

    // for (var i = 1; i <= 6; i++) {
    //     svgUID = "svgTrace"+i;
    //     file = "svg/trace_"+i+".svg";
    //     myPreloader.add({id:svgUID,url: file});
    // }



    myPreloader.start();



}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

