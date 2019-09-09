<?php
$translation = $_GET['translation'];
$db = new SQLite3('db/biblenuggets.db');

$results = $db->query('select passage_id, book_id, chapter, start_verse, end_verse from passage');
header('Content-Type: application/json; charset=utf8');
$arrayName = array();
while ($row = $results->fetchArray()) {
	$passage = new stdClass;
	$passage->chapter = $row['chapter'];
	$passage->startVerse = $row['start_verse'];
	$passage->endVerse = $row['end_verse'];
	$passage->bookId = $row['book_id'];
	$passage->translationId = $translation;
	$passage->translationName = $translation;
	$arrayName[$row['passage_id']] = $passage;
}
$db->close();
print_r(json_encode($arrayName));
?>