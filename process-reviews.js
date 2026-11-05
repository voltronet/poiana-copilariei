const fs = require("fs");
const body = process.env.ISSUE_BODY || "";

const lines = body.split("\n");
let name = "Turist";
let rating = 5;
let message = body;

lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("name:") || trimmed.toLowerCase().startsWith("nume:")) {
        name = trimmed.split(":")[1].trim();
    }
    if (trimmed.toLowerCase().startsWith("rating:") || trimmed.toLowerCase().startsWith("stele:")) {
        rating = parseInt(trimmed.split(":")[1].trim()) || 5;
    }
    if (trimmed.toLowerCase().startsWith("message:") || trimmed.toLowerCase().startsWith("mesaj:")) {
        message = trimmed.substring(trimmed.indexOf(":") + 1).trim();
    }
});

const newReview = {
    name: name,
    rating: rating,
    message: message.replace(/^["\x27]|["\x27]$/g, ""),
    date: new Date().toISOString().split("T")[0]
};

let reviews = [];
if (fs.existsSync("reviews.json")) {
    try {
        reviews = JSON.parse(fs.readFileSync("reviews.json", "utf8"));
    } catch(e) { reviews = []; }
}

reviews.push(newReview);
fs.writeFileSync("reviews.json", JSON.stringify(reviews, null, 2));
console.log("Recenzia a fost adaugata cu succes:", newReview);
