from pymongo import MongoClient
import json
import sqlite3

client = MongoClient('mongodb://jannik:Tigerkacke@localhost:27017/')
db = client.get_database(name="lenoxbot")
userSettingsCollection = db.get_collection(name="userSettings")
guildSettingsCollection = db.get_collection(name="guildSettings")
conn = sqlite3.connect('lenoxbotscore.sqlite')
count = 1
countUser = 0
guilds = []
c = conn.cursor()
c.execute("SELECT * FROM scores")
for row in c:
    settings = {}
    doc = guildSettingsCollection.find_one({"guildId": row[0]})

    if row[0] in guilds:
        continue

    guilds.append(row[0])
print("There are %d unique guilds" % len(guilds))
exit()