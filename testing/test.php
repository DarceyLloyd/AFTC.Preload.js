<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Darcey@AllForTheCode.co.uk - Development Tests</title>
    <style>
        html,
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 1rem;
        }

        #out {
            border: 1px solid #000000;
            padding: 10px;
        }

        #css-check1 {
            margin: 20px 0;
            border-top: 1px solid #000000;
        }

        #css-check2 {
            margin: 20px 0;
            border-top: 1px solid #000000;
        }
    </style>
    <!-- <script src="../node_modules/axios/dist/axios.min.js"></script> -->
    <!-- ES6 <script src="../node_modules/fetch/lib/fetch.js"></script> -->
    <!-- <script src="../node_modules/jquery/dist/jquery.min.js"></script> -->
    <script src="../src/aftc.preload.js"></script>
    <script src="../src/aftc.preload.js.js"></script>
    <script src="../src/aftc.preload.css.js"></script>
    <script src="../src/aftc.preload.public.js"></script>
    <script src="../src/aftc.preload.on.js"></script>
    <script>    
        log("Darcey@AllForTheCode.co.uk");

        var i,
                noOfCSSFilesGenerated = 4,
                noOfStylesGenerated = 100,
                noOfJSFilesGenerated = 4,
                noOfJSFunctionsGenerated = 100,
                html = "",
                fileNo = 0;

            html = "";
            for (fileNo=1; fileNo <= noOfCSSFilesGenerated; fileNo++) {
                html += "<div id='#f-"+fileNo+"-complete'>CSS File " + fileNo + " Parsed</div>";
            }
            
            var css1 = document.getElementById("css-check1");
            log("HERE");
            log(css1);
            document.getElementById("css-check1").innerHTML = html;
            


            for (fileNo=1; fileNo <= noOfJSFilesGenerated; fileNo++) { 
                var fn = "logFunctionFile"+fileNo+"Complete();";
                fn();
            }
        


        var onCompleteHandler = function () {
            log("onCompleteHandler()");

           

            <?php
            // $html = "";
            // for ($i=1; $i <= $noOfJSFilesToGenerate; $i++) { 
            //     $fileName = "javascript".$i.".js";
            //     $function = "logFunctionFile".$i."Complete();";
            //     $html .= $function . "\n";
            // }
            // echo($html."\n");
            ?>

        }

        var onProgressHandler = function (arg) {
            log("onProgressHandler(arg): arg = ");
            log(arg);
            log("------------------------");
        }



        function init() {

            var url = "https://allforthecode.co.uk/includes/js/jquery/jquery-1.11.3.min.js";

            var myPreloader = new AFTC.Preloader({
                onComplete: onCompleteHandler,
                onProgress: onProgressHandler
            });
            

            myPreloader.add({ url: "generated/styles1.css" });

            myPreloader
                .add({ url: "generated/styles1.css" })
                .add({ url: "generated/styles2.css" })
                .add({ url: "generated/styles3.css" })
                .add({ url: "generated/styles4.css" })

                .add({ url: "generated/javascript1.js" })
                .add({ url: "generated/javascript2.js" })
                .add({ url: "generated/javascript3.js" })
                .add({ url: "generated/javascript4.js" })
                .add({ url: "generated/javascript5.js" })

                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_001.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_002.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_003.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_004.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_005.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_006.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_007.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_008.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_009.jpg" })
                // .add({ url: "https://allforthecode.co.uk/data/articles/18/image_010.jpg" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/01.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/02.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/03.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/04.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/05.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/06.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/07.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/08.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/09.gif" })
                // .add({ url: "https://allforthecode.co.uk/old/fun/gifs/10.gif" });

            //myPreloader.start();


            /*
            https://allforthecode.co.uk/old/fun/gifs/01.gif
            https://allforthecode.co.uk/old/fun/gifs/114.gif
            */


        }








    </script>
    
</head>

<body>
    <h2>Development Testing</h2>
    <div id="out">

    </div>
    
    <div id="css-check1"></div>
    <div id="css-check2"></div>

<?php
    // $noOfCSSFilesToGenerate = 4;
    // $noOfStylesToGenerate = 50;

    // $html = "";
    // for ($fileNo=1; $fileNo <= $noOfCSSFilesToGenerate; $fileNo++) {
    //     $html .= "<div id='#f-".$fileNo."-complete'>CSS File " . $fileNo . " Parsed</div>";
    // }
    // echo($html."<hr>\n\n");

    // $html = "";
    // for ($fileNo=1; $fileNo <= $noOfCSSFilesToGenerate; $fileNo++) {
    //     for ($styleNo=1; $styleNo <= $noOfCSSFilesToGenerate; $styleNo++) {
    //         $html .= "<div id='#f-".$fileNo."-st-".$styleNo."'>F".$fileNo."s".$styleNo."</div>";
    //     }
    // }
    // echo($html."\n");


    /*
    $html = "";
    for ($no=1; $no <= $noOfStyleSheetsToGenerate; $no++){
        for ($i=1; $i <= $noOfStylesToGenerate; $i++) { 
            $html .= "<div id='#f-".$no."-st-".$i."'>".$i."</div>\n";
        }
    }
    echo($html."\n");
    */

?>

    <script>
        init();
    </script>
</body>

</html>