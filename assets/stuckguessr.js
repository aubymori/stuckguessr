let data = null;
let guesses = 0;
let page = 0;

const acts = {
    a1: {
        name: "Act 1",
        lastPage: 248,
    },
    a2: {
        name: "Act 2",
        lastPage: 759
    },
    a3: {
        name: "Act 3",
        lastPage: 1153
    },
    i: {
        name: "Intermission",
        lastPage: 1357
    },
    a4: {
        name: "Act 4",
        lastPage: 1988
    },
    a5a1: {
        name: "Act 5 Act 1",
        lastPage: 2625
    },
    a5a2: {
        name: "Act 5 Act 2",
        lastPage: 4110
    },
    i2: {
        name: "Intermission 2",
        lastPage: 4112
    },
    a6a1: {
        name: "Act 6 Act 1",
        lastPage: 4294
    },
    a6i1: {
        name: "Act 6 Intermission 1",
        lastPage: 4419
    },
    a6a2: {
        name: "Act 6 Act 2",
        lastPage: 4666
    },
    a6i2: {
        name: "Act 6 Intermission 2",
        lastPage: 4819
    },
    a6a3: {
        name: "Act 6 Act 3",
        lastPage: 5262
    },
    a6i3: {
        name: "Act 6 Intermisson 3",
        lastPage: 5437
    },
    a6a4: {
        name: "Act 6 Act 4",
        lastPage: 5440
    },
    a6i4: {
        name: "Act 6 Intermission 4",
        lastPage: 5511
    },
    a6a5: {
        name: "Act 6 Act 5",
        lastPage: 5926
    },
    a6i5: {
        name: "Act 6 Intermission 5",
        lastPage: 6242
    },
    a6a6a1: {
        name: "Act 6 Act 6 Act 1",
        lastPage: 6277
    },
    a6a6i1: {
        name: "Act 6 Act 6 Intermission 1",
        lastPage: 6474
    },
    a6a6a2: {
        name: "Act 6 Act 6 Act 2",
        lastPage: 6530
    },
    a6a6i2: {
        name: "Act 6 Act 6 Intermission 2",
        lastPage: 6852
    },
    a6a6a3: {
        name: "Act 6 Act 6 Act 3",
        lastPage: 6901
    },
    a6a6i3: {
        name: "Act 6 Act 6 Intermission 3",
        lastPage: 6920
    },
    a6a6a4: {
        name: "Act 6 Act 6 Act 4",
        lastPage: 6943
    },
    a6a6i4: {
        name: "Act 6 Act 6 Intermission 4",
        lastPage: 7408
    },
    a6a6a5: {
        name: "Act 6 Act 6 Act 5",
        lastPage: 7448
    },
    a6a6i5: {
        name: "Act 6 Act 6 Intermission 5",
        lastPage: 8126
    },
    a7: {
        name: "Act 7",
        lastPage: 8130
    }
};

// Init act picker
{
    let actPicker = document.getElementById("act-picker");
    for (const act in acts)
    {
        let option = document.createElement("option");
        option.value = act;
        option.textContent = acts[act].name;
        actPicker.appendChild(option);
    }
}

function getActForPage(page)
{
    for (const act in acts)
    {
        if (page <= acts[act].lastPage)
            return act;
    }
}

fetch("data/images.json").then(async (r) =>
{
    if (r.status != 200)
    {
        alert("Failed to fetch image data! :(");
        return;
    }
    data = await r.json();
});

function startRound()
{
    // Reset guesses
    guesses = 0;
    for (const guess of document.getElementById("guesses").children)
    {
        guess.removeAttribute("class");
    }

    // Reset text and links
    document.getElementById("win-text").classList.add("hid");
    document.getElementById("lose-text").classList.add("hid");
    document.getElementById("play-again").classList.add("hid");
    document.getElementById("game-text").classList.remove("hid");
    document.getElementById("submit").classList.remove("hid");
    document.getElementById("act-picker").value = "";

    // Set up game
    let keys = Object.keys(data);
    page = keys[Math.floor(Math.random() * keys.length)];
    let image = data[page][Math.floor(Math.random() * data[page].length)];
    
    let imageEl = document.getElementById("play-image");
    imageEl.src = "https://www.homestuck.com/images/storyfiles/hs2/" + image;
    imageEl.classList.remove("hid");
}

function getCookie(name)
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function setCookie(name, value)
{
    const date = new Date();
    date.setTime(date.getTime() + (34560000)); // 400 days
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
}

function submitGuess()
{
    guesses++;

    let guess = document.getElementById("act-picker").value;
    // Skip if none selected
    if (guess == "")
        return;
    let correctAnswer = getActForPage(page);
    // Win
    if (guess == correctAnswer)
    {
        // Increment wins cookie
        let wins = getCookie("wins");
        if (wins === undefined)
            wins = 0;
        wins++;

        document.getElementById("guess-" + Math.min(guesses, 6)).classList.add("correct");
        document.getElementById("guess-count").textContent = guesses + (guesses == 1 ? " guess" : " guesses");
        document.getElementById("total-wins").textContent = wins;
        document.getElementById("win-text").classList.remove("hid");
        document.getElementById("game-text").classList.add("hid");
        document.getElementById("submit").classList.add("hid");
        document.getElementById("play-again").classList.remove("hid");

        setCookie("wins", wins);
    }
    else
    {
        document.getElementById("guess-" + Math.min(guesses, 6)).classList.add("incorrect");
        // Lose
        if (guesses == 6)
        {
            document.getElementById("lose-text").classList.remove("hid");
            document.getElementById("game-text").classList.add("hid");
            document.getElementById("submit").classList.add("hid");
            document.getElementById("play-again").classList.remove("hid");
            document.getElementById("correct-answer").textContent = acts[correctAnswer].name;
        }
    }
}

document.addEventListener("click", (event) => {
    switch (event.target.id)
    {
        case "play-link":
            document.getElementById("home-page").classList.add("hid");
            document.getElementById("play-page").classList.remove("hid");
            startRound();
            break;
        case "play-again-link":
            startRound();
            break;
        case "submit-link":
            submitGuess();
            break;
    }
});