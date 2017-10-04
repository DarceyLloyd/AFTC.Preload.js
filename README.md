# AFTC.PreloadJS
The AFTC.Preload is quick, no fuss, easy to use preloader.

Why did I make this? PreloadJS was not on it's own and I didn't want all that other nonsense that comes with it. I Just wanted a quick and easy preloader, so I made one.


## Features

### NEW: OnDemand loading of JavaScript files
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

var preloader = new AFTC.Preloader({
    onComplete:preloaderComplete,
    onProgress:preloaderProgressHandler
});

// Add files you wish to preload like so
//preloader.add(<unique_id>,<path>,<type css|javascript|image|*>);


preloader.add("css1","includes/css/aftc/aftc1.css","css");
preloader.add("css2","includes/css/aftc/aftc2.css","css");
preloader.add("css3","includes/css/aftc/aftc3.css","css");

preloader.add("js1","includes/js/misc/lodash.min.js","javascript");
preloader.add("js2","includes/js/DTools.js","javascript");

preloader.add("img1","images/img1.png","image");
preloader.add("img2","images/img2.jpg","image");
preloader.add("img3","images/img3.gif","image");

preloader.add("MyUid1","assets/xxxxx.xxx","json");
preloader.add("MyUid1","assets/xxxxx.xxx","xml");
preloader.add("MyUid1","assets/xxxxx.xxx","obj");
preloader.add("MyUid1","assets/xxxxx.xxx","mtl");
preloader.add("MyUid1","assets/xxxxx.xxx","font");

preloader.start();
```



## Uage of onDemand loading
```
    preloader.loadNow("includes/js/JavaScriptFile.js", function () {
        // Do what you want
    });
```

or 

```
    function myOnCompleteFunction(){
        // Do what you want
    }
    preloader.loadNow("includes/js/JavaScriptFile.js", myOnCompleteFunction);
```