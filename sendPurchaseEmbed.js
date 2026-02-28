const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;

const CHANNEL_IDS = process.env.CHANNEL_IDS.split(",");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
    console.log(`${client.user.tag} 실행됨`);

    const embed = new EmbedBuilder()
        .setTitle("🛒 구매 안내")
        .setDescription("아래 버튼을 눌러 구매하세요.")
        .setColor("Green");

    const button = new ButtonBuilder()
        .setCustomId("buy_button")
        .setLabel("구매하기")
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    for (const id of CHANNEL_IDS) {
        try {
            const channel = await client.channels.fetch(id.trim());
            if (channel) {
                await channel.send({
                    embeds: [embed],
                    components: [row]
                });
                console.log(`${id} 전송 완료`);
            }
        } catch (err) {
            console.log(`${id} 전송 실패`, err.message);
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "buy_button") {
        await interaction.reply({
            content: "❌ 잔액이 부족합니다.",
            ephemeral: true
        });
    }
});

client.login(TOKEN);
