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
let tutorialDrawing;

//SETTINGS
let settingsPanel;
let timeLimitSetting;

//BATTLE
let p1Big;
let p2Big;
let skill1;
let skill2;
let skillCombo;
let battleSize;
let battlePanel;
let tile;
let tileSize = 50;
let p1;
let p1Pos;
let p2;
let p2Pos;
let currPlayer;
let currPPos;
let nextAction;

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
                battleAnimation(1);
                break;
        }
        menuButtons[selected]
            .css('background-color', 'red');
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
        x: 0,
        y: 0
    };
    p2Pos = {
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
}

function battleInput(e) {
    if (currPlayer !== undefined) {
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
            case "Enter":
                switch (nextAction.type) {
                    case "step":
                        currPlayer.animate({
                            top: nextAction.y * tileSize,
                            left: nextAction.x * tileSize
                        }, 500);
                        currPPos.x = nextAction.x;
                        currPPos.y = nextAction.y;
                }
                if (currPlayer === p1) {
                    currPlayer = p2;
                    currPPos = p2Pos;
                } else {
                    currPlayer = p1;
                    currPPos = p1Pos;
                }
                break;
        }
        $(".battle-tile").css("background-color", "black")
        $(".row-" + nextAction.y + ".col-" + nextAction.x)
            .css("background-color", "white");
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
            case "battle":
                battleInput(e);
                break;
        }
    });

});