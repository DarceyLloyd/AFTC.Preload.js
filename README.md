# <b>AFTC.Preload</b>
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

### ES5 Version
Click on the "js" folder above.
https://github.com/DarceyLloyd/AFTC.Preload.js/tree/master/js
```
<script src="./js/dist/aftc.preload.min.js"></script>
```

### JS Modules usage
Click on the "jsm" folder above.
https://github.com/DarceyLloyd/AFTC.Preload.js/tree/master/jsm
```
import { AFTCPreloader } from "./jsm/aftc.preloader.js";
```

### Install
```
npm i -S aftc.preload
```

### Usage
```
// Instantiate and set onProgress and onComplete callback function handlers
let preloader = new AFTCPreloader({
    onProgressHandler: onProgressHandler,
    onCompleteHandler: onCompleteHandler
});

// preloader.help(); // Shows some help info

// Load JSON list of files into the preload and start preloading
preloader.start("./preloader.json");

function onProgressHandler(p,file) {
    // NOTE setHTML is from library aftc.js (ES5) / aftc-modules (JSM)

    // Sets html element with id "status" to "Loading"
    setHTML("status","Loading");

    // Sets html element with id "percent" to the percentage loaded 
    setHTML("percent",p + "%"); 

    // Prepends files loaded to html element with id "files"
    setHTML("files",file,"prepend");
}

function onCompleteHandler() {
    // NOTE setHTML is from library aftc.js (ES5) / aftc-modules (JSM)

    // Sets html element with id "status" to "Loaded"
    setHTML("status","Loaded");
}
```

### It is recommend that you use the JSM version
https://github.com/DarceyLloyd/AFTC.Preload.js/tree/master/jsm
