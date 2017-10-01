# AFTC-PreloadJS
The AFTC-PreloadJS is quick, no fuss, easy to use preloader.

Why did I make this? PreloadJS was not on it's own and I didn't want all that other nonsense that comes with it. I Just wanted a quick and easy preloader, so I made one.


## Features
### Sequential JavaScript file preloading and DOM attachment
It will preload your JavaScript files in order and attach them to the DOM for you, so they will become available in the sequence you add them.
### CSS Dom attachment
Any CSS files you add to the preloader will be added to the DOM once they have been preloaded to ensure styles are available.


## Usage
```
var preloader = new AFTC.Preloader({
    onComplete:<YourOnCompleteFunction>,
    onProgress:<YourOnProgressFunction>
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