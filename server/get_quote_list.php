<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$user = $_GET['user'];

$db = new SQLite3('db/memory_' . $user . '.db');
// first check and see if the new column is there, if not add it
$result = $db->query("PRAGMA table_info(common_objection)");
$exists = -1;
while ($row = $result->fetchArray()) {
   if ($row['name'] == 'sent_from_user') {
       $exists = 1;
       break;
   }
}

if ($exists == -1) {
	// new column does not exist yet, so add it
	$db->exec('ALTER TABLE common_objection ADD COLUMN sent_from_user VARCHAR');
	$db->exec('ALTER TABLE common_objection ADD COLUMN approved VARCHAR');
}

$results = $db->query("SELECT o.objection_id, answer_text, approved, sent_from_user FROM common_objection o, common_objection_answer oa where o.objection_id = oa.objection_id and objection_category = 'quote' and answer_id = 1");
$arrayName = array();
while ($row = $results->fetchArray()) {
    $quote = new stdClass;
    $quote->quoteId = $row['objection_id'];
    $quote->quoteText = $row['answer_text'];
    $quote->approved = $row['approved'] == 'Y' || $row['sent_from_user'] == null;
    array_push($arrayName, $quote);
}
$db->close();
print_r(json_encode($arrayName));
?>
