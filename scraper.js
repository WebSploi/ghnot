const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://gardenhorizonswiki.com/stock/";

const EMOJIS = {
    cabbage: "🥬",
    cherry: "🍒",
    pomegranate: "🍎",
    wheat: "🌾",
    banana: "🍌",
    potato: "🥔",
    plum: "🍑",
    beetroot: "🫜",
    tomato: "🍅",
    rose: "🌹",
    apple: "🍏",
    onion: "🧅",
    mushroom: "🍄",
    strawberry: "🍓"
};

function clean(text) {
    return text.replace(/[✔Π]/g, "").trim();
}

function withEmoji(name) {
    const key = name.toLowerCase();
    return `${EMOJIS[key] || "🌱"} ${name}`;
}

async function fetchStock() {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    let result = {
        legendary: [],
        epic: [],
        rare: [],
        uncommon: [],
        gear: [],
        weather: []
    };

    $("h2, h3").each((i, el) => {
        const title = $(el).text().toLowerCase();
        let list = [];
        let next = $(el).next();

        while (next.length && !["h2", "h3"].includes(next[0].name)) {
            next.find("li").each((_, li) => {
                let text = clean($(li).text());
                if (!text) return;

                if (!title.includes("gear") && !title.includes("weather")) {
                    text = withEmoji(text);
                }

                list.push(text);
            });
            next = next.next();
        }

        if (title.includes("legendary")) result.legendary = list;
        if (title.includes("epic")) result.epic = list;
        if (title.includes("rare")) result.rare = list;
        if (title.includes("uncommon")) result.uncommon = list;
        if (title.includes("gear")) result.gear = list;
        if (title.includes("weather")) result.weather = list;
    });

    return result;
}

module.exports = fetchStock;
