grep -i "Received data" /home/logs/error_log* | grep "answer=" | grep addQuote > date-quote-added.txt
python2 prepare_bible_db.py

