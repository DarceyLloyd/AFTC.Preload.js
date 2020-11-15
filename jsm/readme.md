# <b>AFTC.Preload - ES6+ Modules Version</b>
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Darcey%2eLloyd%40gmail%2ecom&lc=GB&item_name=Darcey%20Lloyd%20Developer%20Donation&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

## <b>Usage example 1 (script module)</b>
```
    <script type="module">

        import { onReady, log, setHTML } from "../node_modules/aftc-modules/aftc-modules.js";
        import { AFTCPreloader } from "../aftc.preloader.js"

        onReady(() => {
            log("DOM ready()");

            init();
        });

        function init() {

            const preloader = new AFTCPreloader({
                onProgressHandler: onProgressHandler,
                onCompleteHandler: onCompleteHandler
            });

            preloader.help();

            preloader.start("./preloader.json");

            function onProgressHandler(p,file) {
                setHTML("status","Loading");
                setHTML("percent",p + "%");
                setHTML("files",file,"prepend");
                // log("onProgressHandler(p:" + p + ")");
            }

            function onCompleteHandler() {
                setHTML("status","Loaded");
                // log("onCompleteHandler()");
            }

        }

    </script>
```


## <b>Usage example 2 - Webpack</b>
See files "./test/preloader-test-2.htm" & "./src/preloader-test-2.js".

Install
```
cd ./jsm
npm i aftc.preload
```


Build
```
// Build production
npm run build

// Build dev
npm run buildDev
```

// ./src/preloader-test-2.js
```
import {log, setHTML} from "aftc-modules";
import { AFTCPreloader } from "../aftc.preloader";

// Instantiate and set onProgress and onComplete callback function handlers
const preloader = new AFTCPreloader({
    onProgressHandler: onProgressHandler,
    onCompleteHandler: onCompleteHandler
});

preloader.help(); // Shows some help info

preloader.start("./preloader.json");

function onProgressHandler(p,file) {
    // Sets html element with id "status" to "Loading"
    setHTML("status","Loading");

    // Sets html element with id "percent" to the percentage loaded 
    setHTML("percent",p + "%"); 

    // Prepends files loaded to html element with id "files"
    setHTML("files",file,"prepend");
}

function onCompleteHandler() {
    // Sets html element with id "status" to "Loaded"
    setHTML("status","Loaded");
}
```
