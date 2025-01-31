const fs = require("fs");

const data = {};

const folder = "D:\\xampp5\\htdocs\\6\\";
fs.readdirSync(folder).forEach(file => {
    let filePath = folder + file;
    let pageNum = Number(file.replace(".txt", ""));
    if (Number.isNaN(pageNum))
        return;
    pageNum -= 1900;

    let content = fs.readFileSync(filePath).toString();
    content = content.replaceAll("\r\n", "\n");
    let mediaBlock = content.split("\n###\n")[3];

    let medias = [];
    for (const media of mediaBlock.split("\n"))
    {
        if (media.startsWith("F|") || media.startsWith("S|") || media.startsWith("J|"))
            continue;
        
        let newUrl = media.replace(/http:\/\/(www|cdn)\.mspaintadventures\.com\/storyfiles\/hs2\//, "");
        medias.push(newUrl);

    }
    if (medias.length > 0)
        data[pageNum] = medias;
});

fs.writeFileSync("./data/images.json", JSON.stringify(data));