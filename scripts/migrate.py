from pymongo import MongoClient
import json
import sqlite3
from colorama import init
import os
import sys

if os.name == 'nt':
    init()

userSettingsKeys = json.load(open("usersettings-keys.json", "r"))
guildSettingsKeys = json.load(open("guildsettings-keys.json", "r"))

print("Starting conversion...")

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
    if row[1] == 0:
        count = count + 1
        continue
    if doc == None:
        settings = userSettingsKeys
        doc = {}
        doc["userId"] = row[0]
        doc["settings"] = settings
        userSettingsCollection.insert_one(doc)
    else:
        settings = doc["settings"]
    settings["credits"] = row[1]
    userSettingsCollection.update_one({"userId": row[0]}, {"$set": {"settings": settings}})
    count = count + 1
    if (count % 100) == 0:
        sys.stdout.write("Inserting user number {0}\n".format(count))
        sys.stdout.write("\033[1A")
        sys.stdout.flush()
print("Inserted %d documents" % count)
count = 1
countUser = 0
guilds = []
c.execute("SELECT * FROM scores")
for row in c:
    settings = {}
    doc = guildSettingsCollection.find_one({"guildId": row[0]})

    if row[0] in guilds:
        continue

    if doc == None:
        settings = guildSettingsKeys
        doc = {}
        doc["guildId"] = row[0]
        doc["settings"] = settings
        guildSettingsCollection.insert_one(doc)
    else:
        settings = doc["settings"]
    if not "scores" in settings:
        settings["scores"] = {}
    curInner = conn.cursor()
    curInner.execute("SELECT * FROM scores WHERE guildId={0}".format(row[0]))
    if (count % 100) == 0:
        sys.stdout.write("Inserting guild #{0}\n".format(count))
        sys.stdout.write("\033[1A")
        sys.stdout.flush()
    for rowInner in curInner:
        settings["scores"][rowInner[1]] = {}
        settings["scores"][rowInner[1]]["points"] = rowInner[2]
        settings["scores"][rowInner[1]]["level"] = rowInner[3]
        countUser = countUser + 1
        sys.stdout.write("\033[2K")
        sys.stdout.write("Inserting guild #{0} > user #{1}\n".format(count, countUser))
        sys.stdout.write("\033[1A")
        sys.stdout.flush()
    guildSettingsCollection.update_one({"guildId": row[0]}, {"$set": {"settings": settings}})
    countUser = 0
    count = count + 1
    guilds.append(row[0])
print("Inserted %d documents" % count)
exit()