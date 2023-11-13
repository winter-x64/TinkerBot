# import nextcord
import nextcord
from nextcord.ext import commands
from nextcord import Interaction

# variables
channel_id = 1234567890


# ? ------------------------- Button Class -----------------------------
class submitButton(nextcord.ui.View):
    def __init__(self) -> None:
        super().__init__()
        self.value = None

    @nextcord.ui.button(label="Submit", style=nextcord.ButtonStyle.green)
    async def submit(self, btn: nextcord.ui.Button, interaction: Interaction) -> None:
        self.value = True
        self.stop()


# ? ------------------------- Model Class -----------------------------
class submission_models(nextcord.ui.Modal):
    def __init__(self) -> None:
        super().__init__(
            title="Weekly Submissions",
        )
        self.flag = None

        # input fields for the submission
        self.wc_answer = nextcord.ui.TextInput(
            label="Solution",
            min_length=2,
            max_length=500,
            placeholder="Enter your solution for the challenge",
            style=nextcord.TextInputStyle.paragraph,
        )

        self.wc_query = nextcord.ui.TextInput(
            label="FeedBack",
            min_length=2,
            max_length=200,
            placeholder="Share you queries",
        )

        self.add_item(item=self.wc_answer)
        self.add_item(item=self.wc_query)

    async def callback(self, interaction: Interaction) -> None:
        submitted_answer = self.wc_answer.value
        submitted_wc_query = self.wc_query.value

        self.flag = True

        try:
            # Use interaction.response.send_message instead of interaction.followup.send
            await interaction.response.send_message(
                content=f"Hey {interaction.user.display_name}, \n {submitted_answer} \n {submitted_wc_query} [submit model]",
                ephemeral=True,
            )
        except nextcord.errors.NotFound as e:
            print(f"Error sending message: {e}")

    # add the datebase post


# ? ------------------------- Main Class -----------------------------
class wc_submission(commands.Cog):
    def __init__(self, client) -> None:
        self.client = client

    @nextcord.slash_command()
    async def wc_run(self, interaction: Interaction, question: str) -> None:
        view = submitButton()
        model = submission_models()

        await interaction.response.defer()

        embed = nextcord.Embed(
            title="Weekly Smackdown",
            description=question,
            color=nextcord.Colour.blurple(),
        )
        await interaction.followup.send(embed=embed, view=view)
        await view.wait()

        print("view_ value ", view.value)

        if view.value is None:
            return
        elif view.value:
            await interaction.followup.send(model)

        if model.flag:
            await interaction.followup.send(
                content=f"Hey {interaction.user.display_name}, Thanks for submitting you answer",
                # ephemeral=True,
            )
        else:
            await interaction.followup.send(
                content=f"Hey {interaction.user.display_name}, An unexpected error occurred, please try again",
                # ephemeral=True,
            )


def setup(client) -> None:
    client.add_cog(wc_submission(client))
