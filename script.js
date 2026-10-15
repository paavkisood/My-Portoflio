/* =====================================================
   MINDMATE
   Cognitive Wellness Game Platform
===================================================== */


/* =====================================================
   GLOBAL DATA
===================================================== */

let currentGame = null;

let gameTimerInterval = null;

let gameSeconds = 0;

let gameScore = 0;

let gameRound = 1;

let currentGameStartTime = 0;

let gameData = {};

let voiceEnabled = false;


/* =====================================================
   STORAGE
===================================================== */

const STORAGE_KEY = "mindmate_results";

const PROFILE_KEY = "mindmate_profile";


function getResults() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveResults(results) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(results)
    );

}


function getProfile() {

    return localStorage.getItem(PROFILE_KEY) || "Guest";

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

const navButtons =
    document.querySelectorAll(".nav-button");


const pages =
    document.querySelectorAll(".page");


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section =
            button.dataset.section;

        showSection(section);

    });

});


function showSection(sectionName) {

    pages.forEach(page => {

        page.classList.remove("active-page");

    });

    navButtons.forEach(button => {

        button.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(sectionName);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    const selectedButton =
        document.querySelector(
            `.nav-button[data-section="${sectionName}"]`
        );

    if (selectedButton) {

        selectedButton.classList.add("active");

    }


    updateDashboard();

}


/* =====================================================
   START PLAYING BUTTON
===================================================== */

document
    .getElementById("startPlayingButton")
    .addEventListener("click", () => {

        showSection("games");

    });


/* =====================================================
   GAME CARD BUTTONS
===================================================== */

document
    .querySelectorAll(".game-card")
    .forEach(card => {

        card.addEventListener("click", event => {

            const gameButton =
                event.target.closest(".game-start");

            if (!gameButton) {

                return;

            }

            const game =
                card.dataset.game;

            startGame(game);

        });

    });


/* =====================================================
   GAME MODAL
===================================================== */

const gameModal =
    document.getElementById("gameModal");


const gameContent =
    document.getElementById("gameContent");


document
    .getElementById("closeGame")
    .addEventListener("click", closeGame);


function openGameWindow() {

    gameModal.classList.add("show");

}


function closeGame() {

    stopTimer();

    gameModal.classList.remove("show");

    currentGame = null;

}


/* =====================================================
   START GAME
===================================================== */

function startGame(game) {

    currentGame = game;

    gameScore = 0;

    gameRound = 1;

    gameSeconds = 0;

    gameData = {};

    currentGameStartTime = Date.now();


    openGameWindow();

    updateGameStatus();


    if (game === "memory") {

        setupMemoryGame();

    }

    else if (game === "numbers") {

        setupNumberGame();

    }

    else if (game === "pattern") {

        setupPatternGame();

    }

    else if (game === "focus") {

        setupFocusGame();

    }

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    stopTimer();

    gameSeconds = 0;

    updateGameStatus();


    gameTimerInterval =
        setInterval(() => {

            gameSeconds++;

            updateGameStatus();

        }, 1000);

}


function stopTimer() {

    if (gameTimerInterval) {

        clearInterval(gameTimerInterval);

        gameTimerInterval = null;

    }

}


/* =====================================================
   GAME STATUS
===================================================== */

function updateGameStatus() {

    document.getElementById("gameScore")
        .textContent = gameScore;

    document.getElementById("gameRound")
        .textContent = gameRound;

    document.getElementById("gameTimer")
        .textContent = gameSeconds + "s";

}


/* =====================================================
   SAVE RESULT
===================================================== */

function saveGameResult(
    gameName,
    skill,
    score,
    accuracy,
    duration
) {

    const results = getResults();

    results.push({

        game: gameName,

        skill: skill,

        score: Math.round(score),

        accuracy: Math.round(accuracy),

        duration: Math.round(duration),

        date: new Date().toISOString()

    });


    saveResults(results);

    updateDashboard();

}


/* =====================================================
   GAME RESULT SCREEN
===================================================== */

function showResult(
    title,
    message,
    score,
    gameName,
    skill,
    accuracy
) {

    stopTimer();

    const duration =
        (Date.now() - currentGameStartTime) / 1000;


    saveGameResult(
        gameName,
        skill,
        score,
        accuracy,
        duration
    );


    gameContent.innerHTML = `

        <div class="result-screen">

            <div class="result-icon">
                🌟
            </div>

            <h2>${title}</h2>

            <div class="result-score">
                ${Math.round(score)}
            </div>

            <p class="result-message">
                ${message}
            </p>

            <div class="result-actions">

                <button
                    class="primary-button"
                    id="playAgainButton"
                >
                    🔄 Play Again
                </button>

                <button
                    class="secondary-button"
                    id="doneButton"
                >
                    Done
                </button>

            </div>

        </div>

    `;


    document
        .getElementById("playAgainButton")
        .addEventListener("click", () => {

            startGame(currentGame);

        });


    document
        .getElementById("doneButton")
        .addEventListener("click", closeGame);

}


/* =====================================================
   GAME 1
   MEMORY MATCH
===================================================== */

function setupMemoryGame() {

    document.getElementById("gameCategory")
        .textContent = "MEMORY";

    document.getElementById("gameTitle")
        .textContent = "Memory Match";


    const symbols = [
        "🍎",
        "🌸",
        "⭐",
        "🐟",
        "🍀",
        "☀️",
        "🎈",
        "🦋"
    ];


    const cards =
        [...symbols, ...symbols]
            .sort(() => Math.random() - 0.5);


    gameData = {

        cards: cards,

        flipped: [],

        matched: [],

        moves: 0,

        start: Date.now()

    };


    gameContent.innerHTML = `

        <div style="width:100%; text-align:center;">

            <p class="number-instruction">
                Find all matching pairs.
                Take your time and remember where you see each symbol.
            </p>

            <div
                class="memory-board"
                id="memoryBoard"
            ></div>

        </div>

    `;


    const board =
        document.getElementById("memoryBoard");


    cards.forEach((symbol, index) => {

        const card =
            document.createElement("button");

        card.className = "memory-card";

        card.dataset.index = index;

        card.textContent = "❓";


        card.addEventListener(
            "click",
            () => flipMemoryCard(index)
        );


        board.appendChild(card);

    });


    startTimer();

}


/* =====================================================
   MEMORY CARD FLIP
===================================================== */

function flipMemoryCard(index) {

    const data = gameData;


    if (
        data.flipped.length >= 2 ||
        data.matched.includes(index) ||
        data.flipped.includes(index)
    ) {

        return;

    }


    data.flipped.push(index);


    const cards =
        document.querySelectorAll(".memory-card");


    cards[index].textContent =
        data.cards[index];

    cards[index].classList.add("flipped");


    if (data.flipped.length === 2) {

        data.moves++;

        const [first, second] =
            data.flipped;


        if (
            data.cards[first] ===
            data.cards[second]
        ) {

            data.matched.push(
                first,
                second
            );


            cards[first]
                .classList.add("matched");

            cards[second]
                .classList.add("matched");


            data.flipped = [];

            gameScore += 10;

            updateGameStatus();


            if (data.matched.length ===
                data.cards.length) {

                const accuracy =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            100 -
                            ((data.moves - 8) * 3)
                        )
                    );


                setTimeout(() => {

                    showResult(
                        "Excellent Memory! 🧠",
                        "You successfully matched all the pairs. Great work!",
                        gameScore,
                        "Memory Match",
                        "Memory",
                        accuracy
                    );

                }, 500);

            }

        } else {

            setTimeout(() => {

                cards[first]
                    .classList.remove("flipped");

                cards[second]
                    .classList.remove("flipped");

                cards[first].textContent = "❓";

                cards[second].textContent = "❓";

                data.flipped = [];

            }, 800);

        }

    }

}


/* =====================================================
   GAME 2
   NUMBER RECALL
===================================================== */

function setupNumberGame() {

    document.getElementById("gameCategory")
        .textContent = "RECALL";

    document.getElementById("gameTitle")
        .textContent = "Number Recall";


    const length =
        Math.min(4 + gameRound, 8);


    let number = "";

    for (
        let i = 0;
        i < length;
        i++
    ) {

        number +=
            Math.floor(Math.random() * 10);

    }


    gameData = {

        number: number,

        length: length,

        showing: true

    };


    gameContent.innerHTML = `

        <div class="number-game">

            <p class="number-instruction">
                Remember the number.
                It will disappear after a few seconds.
            </p>

            <div
                class="number-display"
                id="numberDisplay"
            >
                ${number}
            </div>

            <div id="numberInputArea"></div>

        </div>

    `;


    startTimer();


    const display =
        document.getElementById("numberDisplay");


    const displayTime =
        2500 + (length * 200);


    setTimeout(() => {

        display.textContent = "••••";

        gameData.showing = false;


        document.getElementById(
            "numberInputArea"
        ).innerHTML = `

            <input
                class="number-input"
                id="numberAnswer"
                type="text"
                inputmode="numeric"
                maxlength="${length}"
                placeholder="Enter the number"
            >

            <button
                class="primary-button number-submit"
                id="numberSubmit"
            >
                Check Answer
            </button>

        `;


        document
            .getElementById("numberSubmit")
            .addEventListener(
                "click",
                checkNumberAnswer
            );


        document
            .getElementById("numberAnswer")
            .focus();


    }, displayTime);

}


/* =====================================================
   NUMBER CHECK
===================================================== */

function checkNumberAnswer() {

    const answer =
        document
            .getElementById("numberAnswer")
            .value
            .trim();


    const correct =
        answer === gameData.number;


    if (correct) {

        gameScore +=
            25 + (gameData.length * 2);

        updateGameStatus();


        showResult(
            "Perfect Recall! 🔢",
            "You remembered the number correctly.",
            gameScore,
            "Number Recall",
            "Recall",
            100
        );

    } else {

        showResult(
            "Good Try! 🌱",
            `The correct number was ${gameData.number}. Remember, the goal is practice, not perfection.`,
            10,
            "Number Recall",
            "Recall",
            0
        );

    }

}


/* =====================================================
   GAME 3
   PATTERN RECALL
===================================================== */

function setupPatternGame() {

    document.getElementById("gameCategory")
        .textContent = "VISUAL MEMORY";

    document.getElementById("gameTitle")
        .textContent = "Pattern Recall";


    const gridSize = 4;

    const patternLength =
        Math.min(3 + gameRound, 7);


    const pattern = [];

    while (
        pattern.length <
        patternLength
    ) {

        const random =
            Math.floor(
                Math.random() *
                (gridSize * gridSize)
            );


        if (!pattern.includes(random)) {

            pattern.push(random);

        }

    }


    gameData = {

        pattern: pattern,

        selected: [],

        gridSize: gridSize

    };


    gameContent.innerHTML = `

        <div class="pattern-game">

            <p class="number-instruction">
                Watch the highlighted squares carefully.
                Then reproduce the same pattern.
            </p>

            <div
                class="pattern-grid"
                id="patternGrid"
            ></div>

            <p id="patternMessage">
                Watch carefully...
            </p>

        </div>

    `;


    createPatternGrid();


    startTimer();


    setTimeout(() => {

        hidePattern();

    }, 2000 + patternLength * 250);

}


/* =====================================================
   CREATE PATTERN
===================================================== */

function createPatternGrid() {

    const grid =
        document.getElementById("patternGrid");


    grid.innerHTML = "";


    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const cell =
            document.createElement("button");

        cell.className =
            "pattern-cell";

        cell.dataset.index = i;


        if (
            gameData.pattern.includes(i)
        ) {

            cell.classList.add("active");

        }


        cell.addEventListener(
            "click",
            () => selectPatternCell(i)
        );


        grid.appendChild(cell);

    }

}


/* =====================================================
   HIDE PATTERN
===================================================== */

function hidePattern() {

    const cells =
        document.querySelectorAll(
            ".pattern-cell"
        );


    cells.forEach(cell => {

        cell.classList.remove("active");

    });


    document.getElementById(
        "patternMessage"
    ).textContent =
        "Now recreate the pattern.";

}


/* =====================================================
   PATTERN SELECTION
===================================================== */

function selectPatternCell(index) {

    if (
        gameData.selected.includes(index)
    ) {

        return;

    }


    gameData.selected.push(index);


    const cell =
        document.querySelector(
            `.pattern-cell[data-index="${index}"]`
        );


    cell.classList.add("selected");


    if (
        gameData.selected.length ===
        gameData.pattern.length
    ) {

        checkPattern();

    }

}


/* =====================================================
   CHECK PATTERN
===================================================== */

function checkPattern() {

    const expected =
        [...gameData.pattern]
            .sort((a, b) => a - b);


    const actual =
        [...gameData.selected]
            .sort((a, b) => a - b);


    const correct =
        JSON.stringify(expected) ===
        JSON.stringify(actual);


    if (correct) {

        gameScore +=
            20 + (gameData.pattern.length * 5);


        showResult(
            "Great Pattern Memory! 🎨",
            "You reproduced the pattern correctly.",
            gameScore,
            "Pattern Recall",
            "Visual Thinking",
            100
        );

    } else {

        const correctCount =
            actual.filter(
                item =>
                    expected.includes(item)
            ).length;


        const accuracy =
            (correctCount /
                expected.length) * 100;


        showResult(
            "Good Effort! 🌱",
            "Some of the squares were different. Keep practicing!",
            Math.round(accuracy),
            "Pattern Recall",
            "Visual Thinking",
            accuracy
        );

    }

}


/* =====================================================
   GAME 4
   FOCUS FINDER
===================================================== */

function setupFocusGame() {

    document.getElementById("gameCategory")
        .textContent = "ATTENTION";

    document.getElementById("gameTitle")
        .textContent = "Focus Finder";


    const total =
        Math.min(
            12 + gameRound * 2,
            25
        );


    gameData = {

        total: total,

        target: "⭐",

        start: Date.now()

    };


    gameContent.innerHTML = `

        <div class="focus-game">

            <p class="number-instruction">
                Find the ⭐ among the other symbols.
            </p>

            <div
                class="focus-board"
                id="focusBoard"
            ></div>

        </div>

    `;


    const board =
        document.getElementById("focusBoard");


    const targetIndex =
        Math.floor(
            Math.random() * total
        );


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const item =
            document.createElement("button");


        item.className =
            "focus-item";


        item.textContent =
            i === targetIndex
                ? "⭐"
                : "✦";


        item.style.left =
            Math.random() * 90 + "%";


        item.style.top =
            Math.random() * 82 + "%";


        item.addEventListener(
            "click",
            () => {

                if (i === targetIndex) {

                    const timeTaken =
                        (Date.now() -
                            gameData.start) /
                        1000;


                    const score =
                        Math.max(
                            20,
                            Math.round(
                                100 -
                                timeTaken * 4
                            )
                        );


                    gameScore += score;


                    showResult(
                        "Excellent Focus! 🎯",
                        `You found the target in ${timeTaken.toFixed(1)} seconds.`,
                        gameScore,
                        "Focus Finder",
                        "Attention",
                        score
                    );

                } else {

                    item.style.transform =
                        "scale(0.8)";

                    item.style.opacity =
                        "0.35";

                }

            }
        );


        board.appendChild(item);

    }


    startTimer();

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const results =
        getResults();


    /* HOME */

    document.getElementById(
        "homeGamesPlayed"
    ).textContent =
        results.length;


    const best =
        results.length
            ? Math.max(
                ...results.map(r => r.score)
              )
            : 0;


    document.getElementById(
        "homeBestScore"
    ).textContent =
        best;


    document.getElementById(
        "homeStreak"
    ).textContent =
        calculateStreak() + " days";


    /* PROGRESS */

    document.getElementById(
        "totalGames"
    ).textContent =
        results.length;


    const average =
        results.length
            ? results.reduce(
                (sum, r) => sum + r.score,
                0
              ) / results.length
            : 0;


    document.getElementById(
        "averageScore"
    ).textContent =
        Math.round(average);


    document.getElementById(
        "progressBestScore"
    ).textContent =
        best;


    const today =
        new Date().toDateString();


    const todayGames =
        results.filter(
            r =>
                new Date(r.date)
                    .toDateString() ===
                today
        ).length;


    document.getElementById(
        "gamesToday"
    ).textContent =
        todayGames;


    updateSkills(results);

    updateHistory(results);

    updateCaregiver(results);

}


/* =====================================================
   SKILL SCORES
===================================================== */

function getSkillScore(
    results,
    skill
) {

    const filtered =
        results.filter(
            r => r.skill === skill
        );


    if (!filtered.length) {

        return 0;

    }


    const average =
        filtered.reduce(
            (sum, r) => sum + r.accuracy,
            0
        ) / filtered.length;


    return Math.round(average);

}


function updateSkills(results) {

    const memory =
        getSkillScore(
            results,
            "Memory"
        );


    const recall =
        getSkillScore(
            results,
            "Recall"
        );


    const attention =
        getSkillScore(
            results,
            "Attention"
        );


    const visual =
        getSkillScore(
            results,
            "Visual Thinking"
        );


    setSkill(
        "memoryPercent",
        "memoryBar",
        memory
    );


    setSkill(
        "recallPercent",
        "recallBar",
        recall
    );


    setSkill(
        "attentionPercent",
        "attentionBar",
        attention
    );


    setSkill(
        "visualPercent",
        "visualBar",
        visual
    );

}


function setSkill(
    textId,
    barId,
    value
) {

    document.getElementById(
        textId
    ).textContent =
        value + "%";


    document.getElementById(
        barId
    ).style.width =
        value + "%";

}


/* =====================================================
   HISTORY
===================================================== */

function updateHistory(results) {

    const history =
        document.getElementById(
            "historyList"
        );


    if (!results.length) {

        history.innerHTML = `

            <div class="empty-history">

                🧠

                <p>
                    No activities yet.
                    Play your first game to start
                    building your progress history.
                </p>

            </div>

        `;

        return;

    }


    const recent =
        [...results]
            .reverse()
            .slice(0, 10);


    history.innerHTML =
        recent.map(result => {

            const icon =
                result.game === "Memory Match"
                    ? "🃏"
                    : result.game === "Number Recall"
                    ? "🔢"
                    : result.game === "Pattern Recall"
                    ? "🎨"
                    : "🎯";


            const date =
                new Date(
                    result.date
                ).toLocaleDateString();


            return `

                <div class="history-item">

                    <div class="history-left">

                        <div class="history-icon">
                            ${icon}
                        </div>

                        <div>

                            <strong>
                                ${result.game}
                            </strong>

                            <span>
                                ${result.skill}
                                •
                                ${date}
                            </span>

                        </div>

                    </div>

                    <div class="history-score">

                        ${result.score} pts

                    </div>

                </div>

            `;

        }).join("");

}


/* =====================================================
   CAREGIVER DASHBOARD
===================================================== */

function updateCaregiver(results) {

    const activity =
        document.getElementById(
            "activityLevel"
        );


    const accuracy =
        document.getElementById(
            "recentAccuracy"
        );


    const trend =
        document.getElementById(
            "performanceTrend"
        );


    const message =
        document.getElementById(
            "caregiverMessage"
        );


    if (!results.length) {

        activity.textContent =
            "Starting";

        accuracy.textContent =
            "0%";

        trend.textContent =
            "Building Data";

        message.textContent =
            "Complete several activities to build a useful performance history.";

        return;

    }


    if (results.length < 3) {

        activity.textContent =
            "Getting Started";

    }

    else if (results.length < 7) {

        activity.textContent =
            "Active";

    }

    else {

        activity.textContent =
            "Very Active";

    }


    const recent =
        results.slice(-5);


    const recentAccuracy =
        recent.reduce(
            (sum, r) =>
                sum + r.accuracy,
            0
        ) / recent.length;


    accuracy.textContent =
        Math.round(recentAccuracy) + "%";


    if (results.length < 6) {

        trend.textContent =
            "Building Data";

        message.textContent =
            "More activities are needed before a meaningful trend can be seen.";

        return;

    }


    const firstHalf =
        results
            .slice(0, Math.floor(results.length / 2));


    const secondHalf =
        results
            .slice(Math.floor(results.length / 2));


    const firstAverage =
        firstHalf.reduce(
            (sum, r) =>
                sum + r.accuracy,
            0
        ) / firstHalf.length;


    const secondAverage =
        secondHalf.reduce(
            (sum, r) =>
                sum + r.accuracy,
            0
        ) / secondHalf.length;


    const difference =
        secondAverage -
        firstAverage;


    if (difference > 7) {

        trend.textContent =
            "Improving ↑";

        message.textContent =
            "Recent game performance is higher than earlier activity. Continue regular practice.";

    }

    else if (difference < -7) {

        trend.textContent =
            "Needs Attention";

        message.textContent =
            "Recent performance is lower than earlier activity. This does not diagnose a condition; consider monitoring over time and discussing persistent changes with a healthcare professional.";

    }

    else {

        trend.textContent =
            "Stable →";

        message.textContent =
            "Recent performance is relatively stable compared with earlier activity.";

    }

}


/* =====================================================
   STREAK
===================================================== */

function calculateStreak() {

    const results =
        getResults();


    if (!results.length) {

        return 0;

    }


    const dates =
        [
            ...new Set(
                results.map(
                    r =>
                        new Date(r.date)
                            .toDateString()
                )
            )
        ];


    let streak = 0;

    let current =
        new Date();


    while (true) {

        const currentDate =
            current.toDateString();


        if (dates.includes(currentDate)) {

            streak++;

            current.setDate(
                current.getDate() - 1
            );

        }

        else {

            break;

        }

    }


    return streak;

}


/* =====================================================
   CLEAR HISTORY
===================================================== */

document
    .getElementById("clearProgress")
    .addEventListener("click", () => {

        const confirmed =
            confirm(
                "Are you sure you want to delete all MindMate activity history?"
            );


        if (confirmed) {

            localStorage.removeItem(
                STORAGE_KEY
            );

            updateDashboard();

        }

    });


/* =====================================================
   PROFILE
===================================================== */

const profileModal =
    document.getElementById(
        "profileModal"
    );


document
    .getElementById("profileButton")
    .addEventListener("click", () => {

        profileModal.classList.add("show");

        document.getElementById(
            "nameInput"
        ).value =
            getProfile() === "Guest"
                ? ""
                : getProfile();

    });


document
    .getElementById("closeProfile")
    .addEventListener("click", () => {

        profileModal.classList.remove(
            "show"
        );

    });


document
    .getElementById("saveProfile")
    .addEventListener("click", () => {

        const name =
            document
                .getElementById("nameInput")
                .value
                .trim();


        if (name) {

            localStorage.setItem(
                PROFILE_KEY,
                name
            );

        }


        updateProfileName();

        profileModal.classList.remove(
            "show"
        );

    });


function updateProfileName() {

    document.getElementById(
        "profileName"
    ).textContent =
        getProfile();

}


/* =====================================================
   VOICE
===================================================== */

document
    .getElementById("voiceButton")
    .addEventListener("click", () => {

        voiceEnabled =
            !voiceEnabled;


        const button =
            document.getElementById(
                "voiceButton"
            );


        button.textContent =
            voiceEnabled
                ? "🔊 Voice On"
                : "🔇 Voice Off";


        if (voiceEnabled) {

            speak(
                "Welcome to MindMate. Choose a brain game when you are ready."
            );

        }

    });


function speak(text) {

    if (
        !voiceEnabled ||
        !("speechSynthesis" in window)
    ) {

        return;

    }


    window.speechSynthesis.cancel();


    const message =
        new SpeechSynthesisUtterance(text);


    message.rate = 0.85;

    message.pitch = 1;


    window.speechSynthesis.speak(
        message
    );

}


/* =====================================================
   CLOSE MODAL BY CLICKING OUTSIDE
===================================================== */

gameModal.addEventListener(
    "click",
    event => {

        if (
            event.target === gameModal
        ) {

            closeGame();

        }

    }
);


profileModal.addEventListener(
    "click",
    event => {

        if (
            event.target === profileModal
        ) {

            profileModal.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

updateProfileName();

updateDashboard();