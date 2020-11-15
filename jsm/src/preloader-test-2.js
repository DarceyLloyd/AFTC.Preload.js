import {log, setHTML} from "aftc-modules";
import { AFTCPreloader } from "../aftc.preloader";

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