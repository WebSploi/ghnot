const { WebhookClient, EmbedBuilder } = require("discord.js");

const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1435997414871011369/aJWOw3-kqiE0TdHr990Bqz8E-Wm3oTFs1GwTcad69TXYOeOFJhyDWGQpvlc2AtdTrCVB"
});

function buildPlantEmbed(data) {
    return new EmbedBuilder()
        .setTitle("🌱 Plant Stock")
        .setColor(0x00ff99)
        .addFields(
            { name: "Legendary", value: data.legendary.join("\n") || "None", inline: true },
            { name: "Epic", value: data.epic.join("\n") || "None", inline: true },
            { name: "Rare", value: data.rare.join("\n") || "None", inline: true },
            { name: "Uncommon", value: data.uncommon.join("\n") || "None", inline: true }
        )
        .setTimestamp();
}

function buildGearEmbed(data) {
    return new EmbedBuilder()
        .setTitle("⚙️ Gear Stock")
        .setColor(0x0099ff)
        .setDescription(data.gear.join("\n") || "None")
        .setTimestamp();
}

function buildWeatherEmbed(data) {
    return new EmbedBuilder()
        .setTitle("🌦️ Weather")
        .setColor(0xffff00)
        .setDescription(data.weather.join("\n") || "None")
        .setTimestamp();
}

// 🔥 CHECK CONDITIONS FOR @everyone
function shouldPing(data) {
    const hasLegendary = data.legendary && data.legendary.length > 0;

    const gearText = (data.gear || []).join(" ").toLowerCase();

    const hasImportantGear =
        gearText.includes("turbo sprinkler") ||
        gearText.includes("super sprinkler");

    return hasLegendary || hasImportantGear;
}

async function sendAll(data) {
    const ping = shouldPing(data);

    await webhook.send({
        content: ping ? "@everyone 🚨 IMPORTANT STOCK ALERT 🚨" : null,
        embeds: [
            buildPlantEmbed(data),
            buildGearEmbed(data),
            buildWeatherEmbed(data)
        ]
    });
}

module.exports = sendAll;
