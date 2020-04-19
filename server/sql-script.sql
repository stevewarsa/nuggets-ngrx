DROP TABLE android_metadata;
DROP TABLE email_mapping;
DROP TABLE history;
DROP table last_session;
DROP TABLE last_session_passage;
DROP TABLE new_feature_request;
DROP TABLE passage_attachment;
DROP TABLE search_history;
DROP TABLE tag;
DROP TABLE tag_passage;
DROP TABLE translation;

CREATE TABLE quote (quote_id INTEGER primary key autoincrement, quote_tx TEXT NOT NULL, create_dt DATE default CURRENT_DATE);

UPDATE sqlite_sequence SET seq = 0 WHERE name="quote";
INSERT INTO quote(quote_tx) select answer_text from common_objection_answer where objection_id not in (select objection_id from common_objection where objection_category = 'fact' or approved = 'N');
DROP TABLE common_objection;
DROP TABLE common_objection_answer;
DELETE from memory_passage where queued = 'Y';
DELETE FROM passage where passage_id not in (select passage_id from memory_passage);
DELETE FROM passage_text_override where passage_id not in (select passage_id from memory_passage);
