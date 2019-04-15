from pymongo import MongoClient
import json
import sqlite3

userSettingsKeys = json.load(open("usersettings-keys.json", "r"))
guildSettingsKeys = json.load(open("guildsettings-keys.json", "r"))

client = MongoClient('mongodb://user:password@localhost:27017/')
db = client.get_database(name="lenoxbot")
userSettingsCollection = db.get_collection(name="userSettings")
guildSettingsCollection = db.get_collection(name="guildSettings")
conn = sqlite3.connect('lenoxbotscore.sqlite')
c = conn.cursor()
c.execute("SELECT * FROM medals")
count = 0
for row in c:
    settings = {}
    doc = userSettingsCollection.find_one({"userId": row[0]})
    if doc == None:
        settings = userSettingsKeys
        doc = {}
        doc["userId"] = row[0]
        doc["settings"] = settings
        userSettingsCollection.insert_one(doc)
        settings["credits"] = row[1]
        userSettingsCollection.update_one({"userId": row[0]}, {"$set": {"settings": settings}})
        count = count + 1
print("Inserted %d uninserted documents" % count)
count = 0
c.execute("SELECT * FROM scores")
for row in c:
    settings = {}
    doc = guildSettingsCollection.find_one({"guildId": row[0]})
    if doc == None:
        print("Guild %s has no doc" % row[0])
        continue
    if "scores" in settings:
        if not row[1] in settings["scores"]:
            settings["scores"][row[1]] = {}
            settings["scores"][row[1]]["points"] = row[2]
            settings["scores"][row[1]]["level"] = row[3]
            guildSettingsCollection.update_one({"guildId": row[0]}, {"$set": {"settings": settings}})
            count = count + 1
print("Inserted %d uninserted documents" % count)
exit()