let mainMenu;
let tutorial;
let settings;
let levelSelect;
let battle;
let currentScene;

//MAIN MENU
let logo;
let menuButtons;
let selected;

// TUTORIAL
let tutorialPanel;

//SETTINGS
let settingsPanel;
let timerLevel;
let ingLevel;
let selectedSetting;
let timerRow;
let ingRow;
let timerLevelCounter;
let ingLevelCounter;

//BATTLE
let p1Big;
let p2Big;
let skill1 = "";
let skill2 = "";
let skillCombo;
let p1Life = 10;
let p2Life = 10;
let fruits = [];
let fruitPositions = [];
let fruitId;
let fruitNum;
let newFruit;
let newFruitPos;
let fruitX;
let fruitY;
let crossFruit;
let xFruit ;
let waveFruit;
let bombFruit;
let battleSize;
let battlePanel;
let tile;
let tileSize = 64;
let p1;
let p1Pos;
let p2;
let p2Pos;
let currPlayer;
let currPPos;
let oppPPos;
let nextAction;
let slashSize = 1;
let oSize = 3;


function mainMenuAnimation() {
    logo = $("#logo");
    menuButtons = [
        $("#p1-start"),
        $("#p2-start"),
        $("#tutorial-start"),
        $("#settings-start"),
        $("#quit")
    ];
    $(".scene").hide();
    mainMenu.show();
    currentScene = "main-menu";
    logo.animate({
            top: '100px'
        }, 1000,
        () => {
            selected = 0;
            menuButtons[selected]
                .css('background-color', 'red');
        });
}

function mainMenuInput(e) {
    if (selected !== undefined) {
        menuButtons[selected]
            .css('background-color', 'unset');
        switch(e.key) {
            case 'ArrowDown':
                if (selected < menuButtons.length - 1)
                    selected++;
                break;
            case 'ArrowUp':
                if (0 < selected)
                    selected--;
                break;
            case 'Enter':
                switch (selected) {
                    case 0 || 1:
                        battleAnimation(1);
                        break;
                    case 2:
                        tutorialAnimation();
                        break;
                    case 3:
                        settingsAnimation();
                        break;
                }
                break;
        }
        menuButtons[selected]
            .css('background-color', 'red');
    }
}

function tutorialAnimation() {
    currentScene = "tutorial";
    $(".scene").hide();
    tutorial.show();
    tutorialPanel = $("#tutorial-panel");
    tutorialPanel.animate({
        bottom: '200px'
    }, 1000);
}

function settingsAnimation() {
    currentScene = "settings";
    $(".scene").hide();
    settings.show();
    settingsPanel = $("#settings-panel");
    tutorialPanel.animate({
        bottom: '200px'
    }, 1000, () => {
        timerLevel = 0;
        ingLevel = 0;
        selectedSetting = 0;
    });
}

function settingsInput(e) {
    if (timerLevel !== undefined) {
        switch (e.key) {
            case "ArrowUp" || "ArrowDown":
                selectedSetting = (selectedSetting + 1) % 2;
                $(".setting-row").css("background-color", "transparent");
                if (selectedSetting) {
                    $("#timer-setting").css("background-color", "white");
                } else {
                    $("#ing-setting").css("background-color", "white");
                }
                break;
            case "ArrowLeft" || "ArrowRight":
                if (selectedSetting) {
                    if (e.key === "ArrowLeft" && timerLevel > 0) {
                        timerLevel--;
                    } else if (e.key === "ArrowRight" && timerLevel < 5) {
                        timerLevel++;
                    }
                    $("#timer-level").text(timerLevel);
                } else {
                    if (e.key === "ArrowLeft" && ingLevel > 0) {
                        ingLevel--;
                    } else if (e.key === "ArrowRight" && ingLevel < 5) {
                        ingLevel++;
                    }
                    $("#ing-level").text(ingLevel);
                }
                break;
            case "Enter":
                currentScene = "main-menu";
                $(".scene").hide();
                mainMenu.show();
                break;
        }
    }
}

function battleAnimation(level) {
    currentScene = "battle";
    $(".scene").hide();
    battle.show();
    switch(level) {
        case 1:
            battleSize = {x: 8, y: 6};
            break;
        case 2:
            battleSize = {x: 16, y: 6};
            break;
        default:
            battleSize = {x: 12, y: 12};
            break;
    }
    battlePanel = $("#battle-panel");
    battlePanel.css({
        width: tileSize * battleSize.x + "px",
        height: tileSize * battleSize.y + "px"
    });
    for (let i = 0; i < battleSize.x; i++) {
        for (let j = 0; j < battleSize.y; j++) {
            tile = $('<div class="battle-tile"></div>');
            tile.addClass("col-" + i);
            tile.addClass("row-" + j);
            tile.css({
                width: tileSize + 'px',
                height: tileSize + 'px',
                left: tileSize * i + "px",
                top: tileSize * j + "px"
            });
            tile.appendTo(battlePanel);

        }
    }
    battlePanel.animate({
        bottom: '200px'
    }, 1000, playerSetup());

}

function playerSetup() {
    p1 = $("#p1");
    p2 = $("#p2");
    p1Pos = {
        life: 10,
        x: 0,
        y: 0
    };
    p2Pos = {
        life: 10,
        x: battleSize.x - 1,
        y: battleSize.y - 1
    };
    p1.css({
        width: tileSize + "px",
        height: tileSize + "px",
        top: "0px",
        left: "0px"
    });
    p2.css({
        width: tileSize + "px",
        height: tileSize + "px",
        top: (p2Pos.y * tileSize) + "px",
        left: (p2Pos.x * tileSize) + "px"
    });
    p1.appendTo(battlePanel);
    p2.appendTo(battlePanel);
    currPlayer = p1;
    currPPos = p1Pos;
    oppPPos = p2Pos;
    $("#p1-life-num").text(p1Pos.life);
    $("#p2-life-num").text(p2Pos.life);
}

function battleInput(e) {
    if (currPlayer !== undefined) {
        if (e.key !== "Enter") {
            $(".battle-tile")
                .css("background-color", "black");
        }
        switch (e.key) {
            case "ArrowUp":
                if (currPPos.y > 0) {
                    nextAction = {
                        type: "step",
                        x: currPPos.x,
                        y: currPPos.y - 1
                    }
                }
                break;
            case "ArrowRight":
                if (currPPos.x < battleSize.x) {
                    nextAction = {
                        type: "step",
                        x: currPPos.x + 1,
                        y: currPPos.y
                    }
                }
                break;
            case "ArrowDown":
                if (currPPos.y < battleSize.y) {
                    nextAction = {
                        type: "step",
                        x: currPPos.x,
                        y: currPPos.y + 1
                    }
                }
                break;
            case "ArrowLeft":
                if (currPPos.y > 0) {
                    nextAction = {
                        type: "step",
                        x: currPPos.x - 1,
                        y: currPPos.y
                    }
                }
                break;
            case 'a':
                if (skill1) {
                    switch (skill1) {
                        case "cross":
                            crossSignal();
                            break;
                        case "x":
                            xSignal();
                            break;
                        case "wave":
                            waveSignal();
                            break;
                        case "bomb":
                            bombSignal();
                            break;
                    }
                }
                break;
            case 's':
                if (skill2) {
                    switch (skill2) {
                        case "cross":
                            crossSignal();
                            break;
                        case "x":
                            xSignal();
                            break;
                        case "wave":
                            waveSignal();
                            break;
                        case "bomb":
                            bombSignal();
                            break;
                    }
                }
                break;
            case 'd':
                if (skill1 && skill2) {
                    switch (skill1) {
                        case "cross":
                            crossSignal();
                            break;
                        case "x":
                            xSignal();
                            break;
                        case "wave":
                            waveSignal();
                            break;
                        case "bomb":
                            bombSignal();
                            break;
                    }
                    switch (skill2) {
                        case "cross":
                            crossSignal();
                            break;
                        case "x":
                            xSignal();
                            break;
                        case "wave":
                            waveSignal();
                            break;
                        case "bomb":
                            bombSignal();
                            break;
                    }
                }
                break;
            case "Enter":
                if (nextAction.type === "step" &&
                    !(nextAction.x === oppPPos.x &&
                    nextAction.y === oppPPos.y)) {
                    currPlayer.animate({
                        top: nextAction.y * tileSize,
                        left: nextAction.x * tileSize
                    }, 500);
                }
                currPPos.x = nextAction.x;
                currPPos.y = nextAction.y;
                if (currPlayer === p1) {
                    currPlayer = p2;
                    currPPos = p2Pos;
                    oppPPos = p1Pos;
                } else {
                    currPlayer = p1;
                    currPPos = p1Pos;
                    oppPPos = p2Pos;
                }

                fruitId = 0;
                for (let fruitPos of fruitPositions) {
                    if (nextAction.x === fruitPos.x && nextAction.y === fruitPos.y) {
                        !skill1 ? skill1 = fruitPos.type : skill2 = fruitPos.type;
                        fruits = fruits.filter((_, id) => id !== fruitId);
                        fruitPositions = fruitPositions.filter((_, id) => id !== fruitId);
                    }
                    fruitId++;
                }
                if ($(".row-" + currPPos.y + ".col-" + currPPos.x)
                    .css("background-color") === "rgb(255, 255, 255)") {
                    currPPos.life--;
                    currPlayer === p1 ?
                        $("#p1-life-num").text(currPPos.life) :
                        $("#p2-life-num").text(currPPos.life);

                }
                $(".battle-tile")
                    .css("background-color", "black");
                createFruit();
                break;
        }
        if (nextAction.type === "step") {
            $(".row-" + nextAction.y + ".col-" + nextAction.x)
                .css("background-color", "white");
        }
        console.log("Player 1: " + p1Pos.life);
        console.log("Player 2: " + p2Pos.life);
    }


}

function createFruit() {
    if (fruits.length < 3) {
        fruitNum = Math.floor(Math.random() * 4);
        fruitX = Math.floor(Math.random() * battleSize.x);
        fruitY = Math.floor(Math.random() * battleSize.y);
        switch (fruitNum) {
            case 0:
                newFruit = $("<div class='fruit cross-fruit'></div>");
                newFruitPos = {
                    type: "cross",
                    x: fruitX,
                    y: fruitY
                };
                break;
            case 1:
                newFruit = $("<div class='fruit x-fruit'></div>");
                newFruitPos = {
                    type: "x",
                    x: fruitX,
                    y: fruitY
                };                    break;
            case 2:
                newFruit = $("<div class='fruit wave-fruit'></div>");
                newFruitPos = {
                    type: "wave",
                    x: fruitX,
                    y: fruitY
                };                    break;
            case 3:
                newFruit = $("<div class='fruit bomb-fruit'></div>");
                newFruitPos = {
                    type: "bomb",
                    x: fruitX,
                    y: fruitY
                };                    break;
        }
        newFruit.css({
            width: (tileSize - 20) + "px",
            height: (tileSize - 20) + "px",
            top: (fruitX * tileSize + 10) + "px",
            left: (fruitY * tileSize + 10) + "px",
        });
        fruits.push(newFruit);
        console.log(newFruitPos);
        fruitPositions.push(newFruitPos);
        newFruit.appendTo(battlePanel);
    }
}

function crossSignal() {
    nextAction = {
        type: "+",
        x: currPPos.x,
        y: currPPos.y
    };
    $(".row-" + nextAction.y + ", .col-" + nextAction.x)
        .css("background-color", "white");
}

function xSignal() {
    nextAction = {
        type: "x",
        x: currPPos.x,
        y: currPPos.y
    }
    for (let i = 0; i < battleSize.x; i++) {
        $(".row-" + (i + nextAction.y) + ".col-" + (i + nextAction.x))
            .css("background-color", "white");
        $(".row-" + (-i + nextAction.y) + ".col-" + (i + nextAction.x))
            .css("background-color", "white");
        $(".row-" + (i + nextAction.y) + ".col-" + (-i + nextAction.x))
            .css("background-color", "white");
        $(".row-" + (-i + nextAction.y) + ".col-" + (-i + nextAction.x))
            .css("background-color", "white");
    }
}

function waveSignal() {
    nextAction = {
        type: "/",
        x: currPPos.x,
        y: currPPos.y
    }
    for (let i = 0; i < battleSize.x; i++) {
        $(".row-" + (i + nextAction.y) + ".col-" + (i + nextAction.x))
            .css("background-color", "white");
        $(".row-" + (i - nextAction.y) + ".col-" + (i - nextAction.x))
            .css("background-color", "white");
        $(".row-" + (i + nextAction.y + slashSize) + ".col-" + (i + nextAction.x))
            .css("background-color", "white");
        $(".row-" + (i - nextAction.y + slashSize) + ".col-" + (i - nextAction.x))
            .css("background-color", "white");
        $(".row-" + (i + nextAction.y - slashSize) + ".col-" + (i + nextAction.x))
            .css("background-color", "white");
        $(".row-" + (i - nextAction.y - slashSize) + ".col-" + (i - nextAction.x))
            .css("background-color", "white");
    }
}

function bombSignal() {
    nextAction = {
        type: "o",
        x: currPPos.x,
        y: currPPos.y
    }
    for (let i = 0; i < battleSize.x; i++) {
        for (let j = 0; j < battleSize.y; j++) {
            if (i - nextAction.x < oSize &&
                j - nextAction.y < oSize &&
                i - nextAction.x > -oSize &&
                j - nextAction.y > -oSize) {
                $(".row-" + j + ".col-" + i)
                    .css("background-color", "white");
            }
        }
    }
}

$(function(){
    mainMenu = $("#main-menu");
    tutorial = $("#tutorial");
    settings = $("#settings");
    levelSelect = $("#level-select");
    battle = $("#battle");

    mainMenuAnimation();

    $(document).keydown((e) => {
        e.preventDefault();
        switch (currentScene) {
            case "main-menu":
                mainMenuInput(e);
                break;
            case "tutorial":
                if (e === "Enter") {
                    currentScene = "main-menu";
                    $(".scene").hide();
                    mainMenu.show();
                }
            case "battle":
                battleInput(e);
                break;

        }
    });

});