<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$user = $_GET['user'];

$db = new SQLite3('db/memory_' . $user . '.db');

$results = $db->query("SELECT quote_id, create_dt FROM quote");
$arrayName = array();
while ($row = $results->fetchArray()) {
    $quote = new stdClass;
    $quote->quoteId = $row['quote_id'];
    $quote->createDt = $row['create_dt'];
    array_push($arrayName, $quote);
}
$db->close();
print_r(json_encode($arrayName));
?>
