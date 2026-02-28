const express = require("express");
const fs = require("fs");
const fetchStock = require("./scraper");
const sendAll = require("./notifier");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

let latest = {};

function hasChanged(oldData, newData) {
    return JSON.stringify(oldData) !== JSON.stringify(newData);
}

setInterval(async () => {
    try {
        const data = await fetchStock();

        if (hasChanged(latest, data)) {
            console.log("Stock updated!");

            latest = data;
            fs.writeFileSync("storage.json", JSON.stringify(data, null, 2));

            await sendAll(data);
        } else {
            console.log("No change");
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}, 15000);

app.get("/api/stock", (req, res) => {
    res.json(latest);
});

app.listen(PORT, () => {
    console.log("Dashboard running on http://localhost:" + PORT);
});
