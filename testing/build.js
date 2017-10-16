var fs = require('fs');

// CSS
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var noOfStyleSheetsToGenerate = 10;
var noOfStylesToGenerate = 2500;

function generateStyleSheet(no,noOfStylesToGenerate){
    var out = "",
        i = 0;
    for (i=1; i <= noOfStylesToGenerate; i++) { 
        out += "#f-"+no+"-st-"+i+"{ ";
        out += "display: inline-block; ";
        out += "font-size: 9px; ";
        //out += "min-width: 50px; height: 2px; ";
        out += "background: #009900; ";
        out += "border: 1px solid #000000; ";
        out += "padding: 0; margin: 0;";
        //out += "padding-left: " + i + "px;";
        out += " }\n";
    }

    out += "#css-"+no+"-complete { display: table; margin: 2px; padding: 2px; font-size:10px; background:#009900 !important; color: #FFF; }\n";

    return out;
}



for (var i=1; i <= noOfStyleSheetsToGenerate; i++){
    var file = "./testing/generated/styles"+i+".css";
    var out = generateStyleSheet(i,noOfStylesToGenerate)
    fs.writeFile(file, out, function(e) {
        if(e) {
            return console.log(e);
        }
    
        console.log("CSS preload test file created!");
    }); 
    

}



// JS
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var noOfJSFilesToGenerate = 10;
var noOfJSFunctionsToGenerate = 2500;




function generateJSFile($no,$noOfJSFunctionsToGenerate){
    $out = "";
    for (var $i=1; $i <= $noOfJSFunctionsToGenerate; $i++) {
        $jsFuncName = "log"+$no+"f"+$i;
        $out += "function " + $jsFuncName + "(){\n";
            $out += " var out = document.getElementById('jsDebug');\n";
            //$out += " var oldContent = out.innerHTML;\n";
            //$out += " var newContent = out.innerHTML + '" + $jsFuncName + " executed!';\n";
        $out += " out.innerHTML += '" + $jsFuncName + " has been run!<br>';\n";
        $out += " window.jsFile" + $no + "Fn" + $i + "Run = false;\n";
        $out += " }\n";
    }

    $fileName = "javascript"+$no+".js";

    $out += "function logFunctionFile"+$no+"Complete() {\n";
        $out += " var out = document.getElementById('jsDebug');\n";
        //$out += " var oldContent = out.innerHTML;\n";
        $out += " out.innerHTML += '" + $fileName + " has been loaded and parsed!<br>';\n";
        $out += " window.jsFile" + $no + "FnComplete = true;\n";
    $out += "}\n";

    return $out;
}


for (var i=1; i <= noOfStyleSheetsToGenerate; i++){
    var file = "./testing/generated/javascript"+i+".js";
    var out = generateJSFile(i,noOfJSFunctionsToGenerate)
    fs.writeFile(file, out, function(e) {
        if(e) {
            return console.log(e);
        }
    
        console.log("JavaScript preload test file created!");
    }); 
    

}







// JSON
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var noOfJSONFilesToGenerate = 10;
var noOfJSONItemsToGenerate = 6000;




function generateJSONFile($fileNo,$noOfJSONItemsToGenerate){
    $out = "{\n";
        $out += "\t\"list\":[\n";
        for (var $i=1; $i <= $noOfJSONItemsToGenerate; $i++) {
            $out += "\t\t{";
            $out += "\"id\":\"juid" + $i + "\",";
            $out += "\"fileNo\":"+$fileNo+",";
            $out += "\"dateTime\":" + Date.now() +",";
            $out += "\"item\":" + $i
            $out += "},\n";
        }
        $out = $out.substring(0, $out.length - 2);
        $out += "\n\t]\n";
    $out += "}";
   
    return $out;
}


for (var i=1; i <= noOfJSONFilesToGenerate; i++){
    var file = "./testing/generated/data"+i+".json";
    var out = generateJSONFile(i,noOfJSONItemsToGenerate)
    fs.writeFile(file, out, function(e) {
        if(e) {
            return console.log(e);
        }
    
        console.log("JSON preload test file created!");
    }); 
    

}
