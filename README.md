# AFTC.PreloadJS
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

AFTC.Preload is a quick, no fuss, easy to use preloader.

## Why did I make this? 
PreloadJS was not on it's own and I didn't want all that other nonsense that comes with it. I Just wanted a quick and easy preloader, so I made one.


# Features

## Sequential JavaScript loading and DOM integration
Sequence matters, JavaScript files will be loading in sequence, this allows scripts which are dependent on other scripts to be available first to be loaded without error. SEQUENCE MATTERS!

## Batch loading
All files which are not JavaScrit will get preloaded via XHQR (jquery), I will leave jQuery handle any fallbacks. CSS files are added to the DOM as soon as they are loaded.


## OnDemand loading of JavaScript files
Load and use any non loaded JavaScript file into your page / application at any time. To ensure you only start coding for it when it is available specify an onCompleteFunction / callback function.
```
myPreloader.loadNow(url,onCompleteFunction);
```

## CSS Dom attachment
Any CSS files you add to the preloader will be added to the DOM once they have been preloaded to ensure styles are available.

## Batch loading
Any files which are not of type JavaScript, will be put into the batch loader. Default is to attempt to load 4 items at a time, you can change this via constructor argument, see usage.


## Usage
```
var myPreloader = new AFTC.Preloader({
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

myPreloader.add({url:"includes/css/aftc/aftc1.css"});
myPreloader.add({url:"includes/css/aftc/aftc2.css"});
myPreloader.add({url:"includes/css/aftc/aftc3.css"});

myPreloader.add({url:"includes/js/misc/lodash.min.js"});
myPreloader.add({url:"includes/js/DTools.js"});

myPreloader.add({url:"images/img1.png"});
myPreloader.add({url:"images/img2.jpg"});
myPreloader.add({url:"images/img3.gif"});

myPreloader.add({url:"assets/data.json",type:"json"});
myPreloader.add({url:"assets/data.xml",type:"xml"});
myPreloader.add({url:"assets/car.obj",type:"obj"});
myPreloader.add({url:"assets/car.mtl",type:"mtl"});
myPreloader.add({url:"assets/arial.ttf",type:"font"});

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


<br>
<br>

## <b>Found this useful? Please Donate...</b>
Any and all donations to help keep active development and the lights on are more than welcome.

[![paypal](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)


<br>
<br>

[![Hire](https://www.allforthecode.co.uk/images/pph_widget.jpg)](http://pph.me/Darcey)

