<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 1000');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
    }
    exit(0);
}

// $inputJSON = file_get_contents('php://input');
// $input= json_decode( $inputJSON ); 
// print($input);

class MyDB extends SQLite3 {
    function __construct() {
        $this->open('./test.db');
    }
}
$db = new MyDB();
if(!$db) {
    echo $db->lastErrorMsg();
} else {
    echo "Opened database successfully<br><br>";
}

// $policyTableSql = 'create table policies (id integer primary key not null, name text, max_machines int);';
// $licenseTableSql = 'create table licenses (id integer primary key not null, key text, expiry text, policy_id integer not null, foreign key (policy_id) references policies (id) on update set null on delete set null);';
// $machineTableSql = 'create table machines (id integer primary key not null, machine_id text, fingerprint text, license_id integer not null, foreign key (license_id) references licenses (id) on update set null on delete set null);';
// $sql = $policyTableSql.$licenseTableSql.$machineTableSql;

// $ret = $db->exec($sql);
// if(!$ret){
//     echo $db->lastErrorMsg();
// } else {
//     echo "Table created successfully<br><br>";
// }

// $policyInsert = 'insert into policies (name, max_machines) values ("development", 3)';
// $licenseInsertSql = 'insert into licenses (key, expiry, policy_id) values ("PD81da3a61ace20461", "", 1)';
// $machineInsertSql = 'insert into machines (machine_id, fingerprint, license_id) values("ec3ba729-6b2e-47fe-ab29-05662ac99629", "411c3d06-a330-6ed7-a8b2-5385d046cc35", 1)';

// $ret = $db->exec($policyInsert);
// if(!$ret){
//     echo $db->lastErrorMsg();
// } else {
//     echo "Policies inserted created successfully<br><br>";
// }

// $ret = $db->exec($licenseInsertSql);
// if(!$ret){
//     echo $db->lastErrorMsg();
// } else {
//     echo "Licenses inserted created successfully<br><br>";
// }

// $ret = $db->exec($machineInsertSql);
// if(!$ret){
//     echo $db->lastErrorMsg();
// } else {
//     echo "Machines inserted created successfully<br><br>";
// }

// $ret = $db->query('select * from policies');
// while($row = $ret->fetchArray(SQLITE3_ASSOC) ) {
//    echo "id = ". $row['id'] . "<br>";
//    echo "name = ". $row['name'] . "<br>";
//    echo "max machines = ". $row['max_machines'] . "<br><br>";
// }
// echo "Select policies done successfully<br><br>";

// $ret = $db->query('select * from licenses');
// while($row = $ret->fetchArray(SQLITE3_ASSOC) ) {
//    echo "id = ". $row['id'] . "<br>";
//    echo "key = ". $row['key'] . "<br>";
//    echo "expiry = ". $row['expiry'] . "<br>";
//    echo "policy_id = ". $row['policy_id'] . "<br><br>";
// }
// echo "Select licenses done successfully<br><br>";

// $ret = $db->query('select * from machines');
// while($row = $ret->fetchArray(SQLITE3_ASSOC) ) {
//    echo "id = ". $row['id'] . "<br>";
//    echo "machine id = ". $row['machine_id'] . "<br>";
//    echo "finger print = ". $row['fingerprint'] . "<br>";
//    echo "license id = ". $row['license_id'] . "<br><br>";
// }
// echo "Select machines done successfully<br><br>";

// validate
$ret = $db->query('select machine_id, fingerprint, key, expiry from machines join licenses on licenses.id = machines.license_id where key = "PD81da3a61ace20461" and fingerprint = "411c3d06-a330-6ed7-a8b2-5385d046cc35";');
while($row = $ret->fetchArray(SQLITE3_ASSOC) ) {
   echo "machine id = ". $row['machine_id'] . "<br>";
   echo "finger print = ". $row['fingerprint'] . "<br>";
   echo "expiry = ". $row['expiry'] . "<br>";
   echo "key = ". $row['key'] . "<br><br>";
}
echo "Select machine join licenses done successfully<br><br>";

$db->close();

?>