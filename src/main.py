# ? built-in modules
import os

# ? third-party modules
# * nextcord
import nextcord
from nextcord.ext import commands

# * Dotenv module
from dotenv import load_dotenv

# * firebase admin
# import firebase_admin
# from firebase_admin import credentials, firestore

# load of the env variables in the project environment
load_dotenv()

# ? ------------------------- variables ------------------------------

#! DON'T CHANGE THIS PART OF THIS FILE
# ? TOKENS and Credentials

# * Discord APT Token
_TOKEN = os.getenv("DiscordApiToken")

# * Firebase Credentials
# _FIREBASECRED = 'firebaseCred.json'

# ? ------------------------- config init ----------------------------
# * client configuration
intents = nextcord.Intents.all()  # * Enabling Intents
intents.members = True
client = commands.Bot(intents=intents, command_prefix=">")

# * FireBase Realtime DataBase initialzation
# cred = credentials.Certificate(_FIREBASECRED)
# firebase_admin.initialize_app(cred)

# db = firestore.client()


# ? ------------------------- Main Code ------------------------------
# * ------------------------- on_ready  ------------------------------
@client.event
async def on_ready():
    print("\n--------------------------------------------------")
    print(
        f"""linked successfully!! 🟢
Status:-
Appication ID   : { client.user.id }
Appication name : { client.user }
State           : Online
Ping            : { round( client.latency * 1000 ) }
"""
    )
    print("--------------------------------------------------")


# * ------------------------- Test command ---------------------------
@client.command()
async def status(ctx):
    embed = nextcord.Embed(
        title="Current Status", description=client.user, color=0x00FF00
    )
    embed.add_field(name="Appication ID :", value=client.user.id, inline=False)
    embed.add_field(name="Appication name : ", value=client.user, inline=False)
    embed.add_field(name="State : ", value="Online", inline=False)
    embed.add_field(name="Ping : ", value=round(client.latency * 1000), inline=False)
    await ctx.send(embed=embed)


# * ------------------------- Erro command ---------------------------
@client.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.errors.CommandNotFound):
        embed = nextcord.Embed(title="Invalid command used", color=nextcord.Color.red())
        await ctx.send(embed=embed)
    elif isinstance(error, commands.errors.MissingRequiredArgument):
        embed = nextcord.Embed(
            title="Please provide all required arguments.", color=nextcord.Color.red()
        )
        await ctx.send(embed=embed)
    else:
        embed = nextcord.Embed(title="An error occurred.", color=nextcord.Color.red())
        await ctx.send(embed=embed)


# * ------------------------- Load COGS  -----------------------------
print("\n------------------------- Load COGS -----------------------------\n")
for folder in os.listdir("./src/cogs"):  # <-- Findes the folders>
    for file in os.listdir(f"./src/cogs/{folder}"):
        # Finds the files in the folder which ends with .py>
        if file.endswith(".py"):
            try:
                print(f"{file[:-3]} loading................................ done")
                client.load_extension(f"cogs.{folder}.{file[:-3]}")
            except:
                print(f"{file[:-3]} loading ................................ failed")

# ? ------------------------- Bot Run --------------------------------
if __name__ == "__main__":
    client.run(_TOKEN)
