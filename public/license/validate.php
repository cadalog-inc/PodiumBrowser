<?php

function validate($key, $fingerprint) {
    class MyDB extends SQLite3 {
        function __construct() {
            $this->open('./test.db');
        }
    }
    $db = new MyDB();
    if(!$db) {
        $db->close();
        return error(404, "Error: Unable to validate license ".$key);
    }

    $ret = $db->query('select machine_id, fingerprint, key, expiry from machines join licenses on licenses.id = machines.license_id where key = "'.$key.'" and fingerprint = "'.$fingerprint.'";');
    while($row = $ret->fetchArray(SQLITE3_ASSOC)) {
        $key = $row['key'];
        $fingerprint = $row['fingerprint'];
        $id = $row['machine_id'];
        $expiry = $row['expiry'];
        $db->close();
        return success($key, $fingerprint, $id, $expiry);
    }

    $db->close();

    return error(404, "Error: Activation of license ".$key." not found.");
}

function success($key, $fingerprint, $id, $expiry) {
    return (object) array(
        "key" => $key,
        "fingerprint" => $fingerprint,
        "id" => $id,
        "expiry" => $expiry == "" ? null : $expiry
    );
}

function error($statusCode, $detail) {
    return (object)array(
        "statusCode" => $statusCode,
        "body" => (object)array(
            "errors" => [
                (object)array(
                    "detail" => $detail
                )
            ]
        )
    );
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