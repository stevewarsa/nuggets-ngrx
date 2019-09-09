<?php

$translation = $_GET['translation'];
$db = new SQLite3('db/' . $translation . '.db');
$bookId = $_GET['book_id'];
$chapter = (int)$_GET['chapter'];
$startVerse = (int)$_GET['start'];
$endVerse = (int)$_GET['end'];
$statement = $db->prepare('select v.book_id, verse, verse_part_id, verse_text, is_words_of_christ, book_name from verse v, book b where v.book_id = b._id and v.book_id = :book_id and chapter = :chapter and verse >= :start_verse and verse <= :end_verse order by verse, verse_part_id');
$statement->bindValue(':book_id', $bookId);
$statement->bindValue(':chapter', $chapter);
$statement->bindValue(':start_verse', $startVerse);
$statement->bindValue(':end_verse', $endVerse);
$results = $statement->execute();
$passage = new stdClass;
$passage->chapter = $chapter;
$passage->startVerse = $startVerse;
$passage->endVerse = $endVerse;
$passage->translationId = $translation;
$passage->translationName = $translation;
$lastVerse = $startVerse;
$passage->verses = array();
$verse = new stdClass;
$verse->verseParts = array();
array_push($passage->verses, $verse);

while ($row = $results->fetchArray()) {
	$passage->bookName = $row["book_name"];
	$currentVerse = $row["verse"];
	if ($currentVerse != $lastVerse) {
		$lastVerse = $currentVerse;
		$verse = new stdClass;
		$verse->verseParts = array();
		array_push($passage->verses, $verse);
	}

	$versePart = new stdClass;
	$versePart->verseNumber = $currentVerse;
	$versePart->versePartId = $row["verse_part_id"];
	$versePart->verseText = $row["verse_text"];
	if ($row["is_words_of_christ"] == "Y") {
		$versePart->wordsOfChrist = TRUE;
	} else {
		$versePart->wordsOfChrist = FALSE;
	}
	array_push($verse->verseParts, $versePart);
	$passage->bookId = $row["book_id"];
}
$statement->close();
$db->close();
header('Content-Type: application/json; charset=utf8');
print_r(json_encode($passage));
?>