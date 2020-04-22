'''
Created on April 19, 2020
 The purpose of this script is to drop a number of tables and add tables and transfer data from old nuggets db to new bible db
 
@author: Steve Warsa
'''
import time, sqlite3, os, shutil
from datetime import datetime

directory = '/home/public/nuggets/server/db'
newDir = '/home/public/bible/api/db'
insertSQL = """
INSERT OR IGNORE INTO quote(quote_tx) 
	select answer_text 
	from common_objection_answer 
	where objection_id not in 
		(select objection_id 
		from common_objection 
		where objection_category = 'fact')
"""
# This script assumes that the logs have been grep'd to find all the quotes 
# added and those results are stored in a file /home/private/date-quote-added.txt 
for filename in os.listdir(directory):
	if filename.startswith("memory_") and filename.endswith(".db"):
		shutil.copy2(directory + "/" + filename, newDir + "/" + filename)
		con = sqlite3.connect(newDir + "/" + filename, isolation_level=None)
		userName = filename.replace("memory_", "").replace(".db", "")
		con.text_factory = str
		cursor = con.cursor()
		cursor.execute("DROP TABLE IF EXISTS android_metadata")
		cursor.execute("DROP TABLE IF EXISTS email_mapping")
		cursor.execute("DROP TABLE IF EXISTS history")
		cursor.execute("DROP table IF EXISTS last_session")
		cursor.execute("DROP TABLE IF EXISTS last_session_passage")
		cursor.execute("DROP TABLE IF EXISTS new_feature_request")
		cursor.execute("DROP TABLE IF EXISTS passage_attachment")
		cursor.execute("DROP TABLE IF EXISTS search_history")
		cursor.execute("DROP TABLE IF EXISTS tag")
		cursor.execute("DROP TABLE IF EXISTS tag_passage")
		cursor.execute("DROP TABLE IF EXISTS translation")

		cursor.execute("CREATE TABLE quote (quote_id INTEGER primary key autoincrement, quote_tx TEXT NOT NULL UNIQUE, create_dt DATE default CURRENT_DATE)")

		cursor.execute("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'quote'")
		
		cursor.execute(insertSQL)
		con.commit()
		# After inserting all the quotes for this database, now parse log file and try
		# to update the create date for all the quotes
		f = open("/home/private/date-quote-added.txt", "r")
		for line in f:
			if not "user=" + userName in line:
				continue
			#print line
			dtTime = line.split("[")[1].split("]")[0]
			# Example date/time: Fri Apr 10 18:04:39.157275 2020
			datetime_object = datetime.strptime(dtTime, '%a %b %d %H:%M:%S.%f %Y')
			if ", category=quote" in line:
				quote = line.split(", answer=")[1].split(", category=quote")[0]
			else:
				quote = line.split(", answer=")[1].split(", referer:")[0]
			quote = quote.replace("\\xe2\\x80\\x99", "%")
			quote = quote.replace("\\xe2\\x80\\x98", "%")
			quote = quote.replace("\\xe2\\x80\\x9c", "%")
			quote = quote.replace("\\xe2\\x80\\x9d", "%")
			quote = quote.replace("\\xe2\\x80\\x94", "%")
			quote = quote.replace("\\xe2\\x80\\x93", "%")
			quote = quote.replace("\\xe2\\x80\\xa6", "%")
			quote = quote.replace("\\xc3\\xaf", "%")
			quote = quote.replace("\\xc2\\xa0", "%")
			quote = quote.replace("\\xe2\\x9c\\x85", "%")
			if quote.strip() == "" or quote.strip() == ", category=, sourceId=":
				continue
			quote = quote.rstrip().replace("'","%").replace("-", "%").replace("\"", "%").replace("...", "%")
			if not quote.endswith("%"):
				quote = quote + "%"
			updateStmt = "update quote set create_dt = ? where quote_tx like '" + quote + "'"
			cursor.execute(updateStmt, (datetime_object,))
			if cursor.rowcount < 1:
				print dtTime
				print datetime_object
				print quote
				print "Unable to update create dt for quote matching '" + quote + "'"
			else:
				if cursor.rowcount > 1:
					print dtTime
					print datetime_object
					print quote
					print "Updated " + str(cursor.rowcount) + " row(s) for quote matching '" + quote + "'"
				con.commit()
			#print ""
		f.close()
			
		cursor.execute("DROP TABLE common_objection")
		cursor.execute("DROP TABLE common_objection_answer")
		cursor.execute("DELETE from memory_passage where queued = 'Y'")
		cursor.execute("DELETE FROM passage where passage_id not in (select passage_id from memory_passage);")
		cursor.execute("DELETE FROM passage_text_override where passage_id not in (select passage_id from memory_passage);")
		con.commit()
		cursor.close()
		con.execute("VACUUM")
		con.close()
	# end if
# end for
