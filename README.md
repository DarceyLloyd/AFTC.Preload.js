# AFTC.PreloadJS
The AFTC.Preload is quick, no fuss, easy to use preloader.

Why did I make this? PreloadJS was not on it's own and I didn't want all that other nonsense that comes with it. I Just wanted a quick and easy preloader, so I made one.


## Features

### OnDemand loading of JavaScript files
Simply load and integrate a JavaScript file anywhere in your code, with on complete callback feature.
```
preloader.loadNow(url,onCompleteFunction);
```

### Sequential JavaScript file preloading and DOM attachment
It will preload your JavaScript files in order and attach them to the DOM for you, so they will become available in the sequence you add them.

### CSS Dom attachment
Any CSS files you add to the preloader will be added to the DOM once they have been preloaded to ensure styles are available.

### Batch loading
Any files which are not of type JavaScript, will be put into the batch loader. Default is to attempt to load 4 items at a time, you can change this via constructor argument, see usage.


## Usage
```
var preloader = new AFTC.Preloader({
    onComplete:<YourOnCompleteFunction>,
    onProgress:<YourOnProgressFunction>,
    batchSize:<NoOfFileYouWishToPreloadAtATime>
});
```


## Example 
```
function preloaderComplete(){
    console.log("Preloader has completed!");
}
function preloaderProgressHandler(p){
    console.log("PreloaderProgressHandler(): Percent loaded = " + p);
}

var myPreloader = new AFTC.Preloader({
    onComplete:preloaderComplete,
    onProgress:preloaderProgressHandler
});


// Add files you wish to preload like so
/*
myPreloader.add({
    id:<unique_id>,
    url:<url>,
    type:<type css|javascript|image|*>
});
*/

myPreloader.add({url:"includes/css/aftc/aftc1.css",type:"css"});
myPreloader.add({url:"includes/css/aftc/aftc2.css",type:"css"});
myPreloader.add({url:"includes/css/aftc/aftc3.css",type:"css"});

myPreloader.add({url:"includes/js/misc/lodash.min.js",type:"javascript"});
myPreloader.add({url:"includes/js/DTools.js",type:"javascript"});

myPreloader.add({url:"images/img1.png",type:"image"});
myPreloader.add({url:"images/img2.jpg",type:"image"});
myPreloader.add({url:"images/img3.gif",type:"image"});

myPreloader.add({url:"assets/xxxxx.xxx",type:"json"});
myPreloader.add({url:"assets/xxxxx.xxx",type:"xml"});
myPreloader.add({url:"assets/xxxxx.xxx",type:"obj"});
myPreloader.add({url:"assets/xxxxx.xxx",type:"mtl"});
myPreloader.add({url:"assets/xxxxx.xxx",type:"font"});

myPreloader.start();
```



## Uage of onDemand loading
```
    myPreloader.loadNow("includes/js/JavaScriptFile.js", function () {
        // Do what you want
    });
```

or 

```
    function myOnCompleteFunction(){
        // Do what you want
    }
    myPreloader.loadNow("includes/js/JavaScriptFile.js", myOnCompleteFunction);
```