# AFTC-PreloadJS
The AFTC-PreloadJS is quick, no fuss, easy to use preloader.

#  Usage
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