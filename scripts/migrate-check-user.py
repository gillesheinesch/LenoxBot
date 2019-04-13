import json
import sys
import math

guilds = json.load(open("data.json", "r"))

guild = sys.argv[1]
member = sys.argv[2]

if math.isnan(guild) or math.isnan(member):
    print("Error, values need to be numbers")
    print("migrate-check-user.py GUILDID MEMBERID")
    exit()

if guild in guilds:
    print("Guild is existing")
    if member in guilds[guild]:
        print("Member is existing")