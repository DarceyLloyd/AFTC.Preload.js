# AFTC.PreloadJS
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

### AFTC.Preload is a light weight (9kb), quick, no fuss, easy to use preloader with advanced features should you want to use them.

## Why did I make this? 
I wanted something quick and easy, just like a preloader should be with no other nonsense that came with it.

Can't get simpler than:
```
function myStuffHasLoaded(){
// Preloader complete do your thing
}
var myPreloader = new AFTC.Preloader({onComplete:myStuffHasLoaded);
myPreloader
   .add({url:"images/img1.jpg"})
   .add({url:"js/script1.js"})
   .add({url:"css/styles1.css"})
   .add({url:"data/country_codes.json"});
myPreloader.start();
``` 


### What's new
<b>jQuery is no longer required for xhr preloading, I have now written my own xhr functions.</b>


### Dependencies
<b>None, just include aftc.preload.js and your good to go.</b>

### Compatibility
I've tested it on FireFox, Chrome, IE, Edge and Opera, as well as mobile versions including safari and all appeard to be fine. NOTE XHR is a requirement, but if it's unavailable it will preload DOM attachable file types only, eg images, css and javascript.


### Preloader - cache:true||false
```
// Allow the browser to cache all files or disable caching alltogether 
cache true|| false
```

### Preloader - batchSize:number
```
// Batch size, number of items to preload at the same time
bathSize:number
```

### Preloader - attachImagesToDom:true||false
```
// Want to dump all loaded images into a dom element?
attachImagesToDom:true
domElementToAttachImagesTo:string(element id)
```


### Preloader.add({params})
```
.add({
id:string,
url:string,
cache:boolean
});

// ID must be unique (used for svg, json & xml retrieval (only svg is implemented at the moment, but caching is working fine)
// Cache is per a file basis
```


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



## Basic usage
```
function preloaderComplete(){
    console.log("Preloader has completed!");
}

function preloaderProgressHandler(obj){
    console.log("PreloaderProgressHandler(): Percent loaded = " + obj.percentLoaded);
    // Create your progress bar here or do more (see test.htm in testing folder)
    console.log(obj); // see what's available to you in console
}

var myPreloader = new AFTC.Preloader({
    batchSize: 5,
    onComplete: preloaderComplete,
    onProgress: preloaderProgressHandler,
    cache: false,
    attachImagesToDom: true,
    domElementToAttachImagesTo: "imgDebug"

});



// Add files you wish to preload like so
/*
myPreloader.add({
    id:<unique_id>,
    url:<url>
});
*/

myPreloader
    .add({url:"includes/css/aftc/aftc1.css"});
    .add({url: "img/img07.jpg"})
    .add({url: "img/img08.jpg"})
    .add({url: "img/img09.jpg"})
    .add({url: "img/img10.jpg"})
    .add({url: "generated/styles1.css", cache: false})
    .add({url: "generated/styles2.css"})
    .add({url: "generated/styles3.css"})
    .add({url: "generated/styles4.css"});

myPreloader.start();
```


You may also chain like so
```
myPreloader
    .add({url:"includes/css/aftc/aftc4.css"})
    .add({url:"includes/css/aftc/aftc5.css"})
    .add({url:"includes/css/aftc/aftc6.css"})

```



### For a detailed usage example run and review the code on test.htm and test.js in the testing folder (use xampp or wamp or other server).




<br>
<br>

## <b>Found this useful? Please Donate...</b>
Any and all donations to help keep active development and the lights on are more than welcome.

[![paypal](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)


<br>
<br>

[![Hire](https://www.allforthecode.co.uk/images/pph_widget.jpg)](http://pph.me/Darcey)

