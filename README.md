# <b>AFTC.PreloadJS</b>
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

### AFTC.Preload is a light weight (10kb), quick, no fuss, easy to use preloader with advanced features should you want to use them.

## Working examples can be seen @:
http://dev.aftc.io/git/AFTC.Preload.js/testing/complex.htm

and

http://dev.aftc.io/git/AFTC.Preload.js/testing/simple.htm

## Why did I make this?
I wanted something quick and easy, just like a preloader should be with no other nonsense that came with it.

### 1. Setup and Start the preload:
```
var preloader = new AFTC.Preloader({
    onProgress:onProgressHandler,
    onComplete:onCompleteHandler
    });

preloader
   .add({id: "img1", url:"images/img1.jpg"})
   .add({id: "svg1", url:"images/svg1.svg"})
   .add({url:"js/script1.js"})
   .add({url:"css/styles1.css"})
   .add({id: "json1", url:"data/country_codes.json"});
preloader.start();
```

### 2. Do some stuff while it's preloading:
```
function onProgressHandler(e) {
    var message = document.getElementById("percentage");
    message.innerHTML = e.percentLoaded + "%<br>Currently loading: " + e.url;
}
```

### 3. Preloading is complete! How to use your assets
```
// CSS is attached to the DOM on load complete
// (add sequence matters if you override lots of styles)

// JS is attached to the DOM on load complete and executed
// (add sequence is important if coding on global scope)

// The rest relies on the browser cache, code as normal

function onCompleteHandler(){
    // Preloader complete
    document.getElementById("loading-message").innerHTML = "LOADING COMPELTE!";

    // Example of how to load a preloaded image
    var img1 = preloader.getItemById("img1");
    img1.width = 100;
    img1.height = 100;
    log("img1 = " + img1);
    document.getElementById("image-container").appendChild(img1);

    // Example of retrieving JSON data from the preloader
    var data1 = JSON.parse(preloader.getItemById("json1"));
    log(data1.list[0]);
    log("data1.list[0].item = " + data1.list[0].item);

    // Example of retrieving text data from the preloader
    var txt1 = preloader.getItemById("txt1");
    log(txt1);
    log("txt1 = \"" + txt1 + "\"");

    // Example of retrieving an svg from the preloader
    var svg1 = preloader.getItemById("svg1");
    var svg1Container = document.createElement("div");
    svg1Container.style.width = "150px";
    svg1Container.style.height = "150px";
    svg1Container.innerHTML = svg1;
    document.getElementById("logo").appendChild(svg1Container);


}
```


### Dependencies
<b>None, just include aftc.preload.min.js and your good to go.</b>

### Compatibility
I've tested it on FireFox, Chrome, IE, Edge and Opera, as well as mobile versions including safari and all appeard to be fine. NOTE XHR is a requirement, but if it's unavailable it will preload DOM attachable file types only, eg images, css and javascript.


<br>
<br>
<br>

## AFTC.Preloader({parameters}); Parameter definitions

### cache:true||false
```
// Allow the browser to cache all files or disable caching alltogether
var myPreloader = new AFTC.Preloader({cache:true});
```

### batchSize:number
```
// Batch size, number of items to preload at the same time
var myPreloader = new AFTC.Preloader({batchSize:1});
```

### attachImagesToDom:true||false
```
// Want to dump all loaded images into a dom element?
var myPreloader = new AFTC.Preloader({
   attachImagesToDom:true
   domElementToAttachImagesTo:string(element id)
});
```

<br>
<br>

## Adding files for preloading ".add({params})"

### .add({uid:string,url:string,cache:boolean});
- uid : string - optional(yes) : Specify a unique id for your ID if you to use the more advanced features such asset retrieval
- url : string - optional(no) : URL / Path to the file you wish to preload
- cache : boolean - optional(yes) : turn file caching off or on at the single file level


<br>
<br>


## Most common usage example:
Please see tests/simple.htm
```
var preloader, percentage, imgContainer;

function onCompleteHandler() {
    log("onCompleteHandler()");
    percentage.innerHTML = "Preloader has completed!";

    // Example of how to load a preloaded image
    var img1 = preloader.getItemById("img1");
    img1.width = 100;
    img1.height = 100;
    log("img1 = " + img1);
    imgContainer.appendChild(img1);

    // Example of retrieving JSON data from the preloader
    var data1 = JSON.parse(preloader.getItemById("json1"));
    log(data1.list[0]);
    log("data1.list[0].item = " + data1.list[0].item);

    // Example of retrieving text data from the preloader
    var txt1 = preloader.getItemById("txt1");
    log(txt1);
    log("txt1 = \"" + txt1 + "\"");

    // Example of retrieving an svg from the preloader
    var svg1 = preloader.getItemById("svg1");
    var svg1Container = document.createElement("div");
    svg1Container.style.width = "150px";
    svg1Container.style.height = "150px";
    svg1Container.innerHTML = svg1;
    imgContainer.appendChild(svg1Container);
}



function onProgressHandler(e) {
    percentage.innerHTML = e.percentLoaded + "%<br>Currently loading: " + e.url;
}



onReady(function () {
    logTo("out"); // set log to output to a html element also
    log("AFTC.PRELOAD.JS"); // log to console and html element set above

    // Var defs
    percentage = document.getElementById("percentage");
    imgContainer = document.getElementById("content");

    preloader = new AFTC.Preloader({
        batchSize: 3,
        onProgress: onProgressHandler,
        onComplete: onCompleteHandler
    });

    preloader
        .add({ id: "img1", url: "img/img01.jpg", cache: false })
        .add({ id: "img2", url: "img/img02.jpg" })
        .add({ id: "img3", url: "img/img03.jpg" })
        //
        .add({ id: "svg1", url: "svg/trace_1.svg", cache: false })
        //
        .add({ id: "css1", url: "generated/styles1.css", cache: false })
        .add({ id: "css2", url: "generated/styles2.css" })
        .add({ id: "css3", url: "generated/styles3.css" })
        //
        .add({ id: "js1", url: "generated/javascript1.js", cache: false })
        .add({ id: "js2", url: "generated/javascript2.js" })
        .add({ id: "js3", url: "generated/javascript3.js" })
        //
        .add({ id: "json1", url: "generated/data1.json" })
        .add({ id: "json2", url: "generated/data2.json" })
        .add({ id: "json3", url: "generated/data3.json" })
        //
        .add({ id: "txt1", url: "test.txt" });

    for(var i=0; i<preloader.params.que.length; i++){
        log("Adding [" + preloader.params.que[i].url + "] for preload!");
    }
    log("- - STARTING PRELOADER -- ")
    preloader.start();
});
```

html
```
<h2 id="percentage"></h2>
<div id="content" class="box"></div>
<div id="out" class="box"></div>
```


<br>
<br>




## SVG Asset retrieval and usage
### myPreloader.getSVGById(id:string)
```
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
```

<br>
<br>

# For more detailed usage examples please see simple.htm and complex.htm in the tests folder




<br>
<br>

## <b>Found this useful? Please Donate...</b>
Any and all donations to help keep active development and the lights on are more than welcome.

[![paypal](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)


<br>
<br>

![Hire](https://www.allforthecode.com/images/pph_widget.jpg "Hire")(http://pph.me/Darcey)

[Hire](http://pph.me/Darcey)