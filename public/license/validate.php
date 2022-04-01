<?php

function validate($key, $fingerprint) {
    if(!file_exists('./licenses/'.$key)) {
        return error(404, "Error: License ".$key." not found.");
    }
    $license = json_decode(file_get_contents('./licenses/'.$key, true));

    $machines = $license->machines;
    $ml = count($machines);
    for($i = 0; $i < $ml; $i++) {
        $machine = $machines[$i];
        if($machine->fingerprint == $fingerprint) {
            return (object) array(
                "key" $key,
                "fingerprint" $fingerprint,
                "id" $machine->id,
                "expiry" $license->expiry
            );
        }
    }

    return error(404, "Error: Activation of license ".$key." not found.");
}

function error($statusCode, $detail) {
    (object)array(
        "statusCode" => $statusCode,
        "body" => (object)array(
            "errors" => [
                (object)array(
                    "detail" => $detail
                )
            ]
        )
    )
}

?>
<html>
    <head>
        <style>
            body {
                background-color: #f3f3f7;
                font-family: 'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif, Meiryo;
                font-size: 12px;
            }
        </style>
        <script>
            sketchup.setLicense(<?print(json_encode(validate($_GET["key"] ?: '', $_GET["fingerprint"] ?: '')))?>);
        </script>
    </head>
    <body>
        <div id="message" align="center">
            Validating License... 
        </div>
    </body>
</html>