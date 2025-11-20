// Constants
const casemateTypes = [
    {name: "Gyűjtemény", ordinary: Infinity, boss: 0},
    {name: "Egyszerű találkozás", ordinary: 1, boss: 0, upgradeValue: 1, upgradeType: "attack"},
    {name: "Kis kazamata", ordinary: 3, boss: 1, upgradeValue: 2, upgradeType: "health"}, 
    {name: "Nagy kazamata", ordinary: 5, boss: 1, upgradeValue: 3, upgradeType: "attack"}
];
const cardTypes = ["fire", "earth", "water", "air"];

const minHealth = 1;
const maxHealth = 100;
const minAttack = 2;
const maxAttack = 100;
const battleAnimationDuration = 4000;
const fightAnimationDuration = 500;

// let loggedIn = false;

// Globals
let worlds = [
    {
        id: 1,
        name: "Első világ",
        cards: [
            {
                id: 1,
                name: "A",
                health: 5,
                attack: 4,
                type: "earth",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 2,
                name: "B",
                health: 5,
                attack: 4,
                type: "fire",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 3,
                name: "C",
                health: 10,
                attack: 10,
                type: "water",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 4,
                name: "D",
                health: 4,
                attack: 6,
                type: "air",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 5,
                name: "D Boss",
                health: 3,
                attack: 6,
                type: "air",
                isBoss: true,
                bossSource: 4,
                bossType: "attack"
            },
            {
                id: 6,
                name: "E",
                health: 4,
                attack: 7,
                type: "air",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
        ],
        casemates: [
            {
                id: 1,
                name: "Első Kazamata",
                type: 1,
                cards: [2]
            },
            {
                id: 2,
                name: "Kis kazamata",
                type: 2,
                cards: [2, 3, 1, 5]
            },
            {
                id: 3,
                name: "Nagy kazamata",
                type: 3,
                cards: [1, 2, 3, 4, 6, 5]
            },
        ],
        collections: [{type: 0, cards: [1, 2, 3, 4]}]
    }
];
let lastGame = null;
let game = null;

let currentWorld = 1;
let currentCasemate = 1;


// Elements
const screenContainer = document.querySelector(".screen-container");
const casemateCardSourceElement = document.querySelector(".worldcards-container");
const casemateCardTargetElement = document.querySelector(".casemate-ordinary-container");
const casemateBossTargetElement = document.querySelector(".casemate-boss-container");

const playerCardSourceElement = document.querySelector(".game-collection-container");
const playerCardTargetElement = document.querySelector(".game-player-cards-container");

const casemateCardSourceGroup = "casemateCardSource";
const casemateCardTargetGroup = "casemateOrdinaryTarget";
const casemateBossTargetGroup = "casemateBossTarget";

const playerCardSourceGroup = "playerCardSource";
const playerCardTargetGroup = "playerCardTarget";


function setScreen(screen) {
    screenContainer.dataset.screen = screen;
}


function getWorldById(id = currentWorld) {
    return worlds.find(world => world.id === id);
}

function getCardById(id, cards = null) {
    if (cards === null)
        cards = getWorldById(currentWorld).cards;
    return cards.find(card => card.id === id);
}
function getCasemateById(id, casemates = null) {
    const world = getWorldById(currentWorld);
    if (casemates === null)
        casemates = world.casemates;

    if (id === -1) {
        return world.collections[0];
    } else {
        return casemates.find(casemate => casemate.id === id);
    }
}

function cardElementAsText(id, editable, {name = "", health = 1, attack = 2, type = "earth", isBoss = false, bossSource = null, bossType = null, attackPromoteDisabled = false, healthPromoteDisabled = false, deleteButton = false, draggable = true, clickable = false} = {}) {
    return `
        <form class="worldcard ${isBoss ? "boss" : ""} ${isBoss ? `boss--${bossType}` : ""} ${!editable ? "readonly" : ""} ${!draggable ? "no-drag" : ""} ${clickable ? "clickable" : ""}" data-card-id="${id}">
            <div class="worldcard-grid">
                <textarea ${!editable ? "readonly" : ""} placeholder="A kártya neve" name="worldcard-name" minlength="1" maxlength="16" class="worldcard-property worldcard-name" rows="2">${name}</textarea>
                <div class="worldcard-property-container worldcard-attack-container">
                    ${editable ? `
                        <img class="worldcard-promote" data-boss-type="attack" data-disabled="${attackPromoteDisabled}" src="./assets/images/promotion.png" title="Sebzés növelése vezérkártyává alakítással">
                        <svg data-disabled="${attack >= maxAttack}" data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                    ` : ""}
                    <div class="worldcard-property-icon-container">
                        <img src="./assets/images/attack.webp" alt="Sebzés" class="worldcard-property-icon">
                        <input type="number" name="attack" min="${minAttack}" max="${maxAttack}" class="worldcard-property min-max-control integer worldcard-attack" value="${attack}" ${isBoss || !editable ? "readonly" : ""}>
                    </div>
                    ${editable ? `
                        <svg data-disabled="${attack <= minAttack}" data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                    ` : ""}
                </div>
                <div class="worldcard-type-picker">
                    <form>
                        <input type="radio" name="type" ${!editable ? "disabled" : ""} value="earth" ${type === "earth" ? "checked" : ""}>
                        <input type="radio" name="type" ${!editable ? "disabled" : ""} value="fire" ${type === "fire" ? "checked" : ""}>
                        <input type="radio" name="type" ${!editable ? "disabled" : ""} value="water" ${type === "water" ? "checked" : ""}>
                        <input type="radio" name="type" ${!editable ? "disabled" : ""} value="air" ${type === "air" ? "checked" : ""}>
                    </form>
                </div>
                ${
                    isBoss ? `
                        <div class="worldcard-boss-icon">
                            <img src="./assets/images/boss.png"></img>
                        </div>
                    ` : ""
                }
                <div class="worldcard-property-container worldcard-health-container">
                    ${editable ? `
                        <img class="worldcard-promote" data-boss-type="health" data-disabled="${healthPromoteDisabled}" src="./assets/images/promotion.png" title="Sebzés növelése vezérkártyává alakítással">
                        <svg data-disabled="${health >= maxHealth}" data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                    ` : ""}
                    <div class="worldcard-property-icon-container">
                        <img src="./assets/images/health.webp" alt="Élet" class="worldcard-property-icon">
                        <input type="number" name="health" min="${minHealth}" max="${maxHealth}" class="worldcard-property min-max-control integer worldcard-health" value="${health}" ${isBoss || !editable ? "readonly" : ""}>
                    </div>
                    ${editable ? `
                        <svg data-disabled="${health <= minHealth}" data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                    ` : ""}
                </div>
                ${editable || deleteButton ? `
                    <div class="worldcard-delete svgbutton">
                        <img src="./assets/images/btn-delete.webp"></img>
                    </div>
                ` : ""}
            </div>
        </form>
    `;
}

function casemateElementAsText(id, editable, {name = "", type = 1, selected = false, incomplete = false}) {
    return `
        <form class="casemate ${selected ? "selected" : ""} ${incomplete ? "incomplete" : ""}" data-casemate-id="${id}">
            ${editable ? `
                <input class="input casemate-name" type="text" name="name" placeholder="Kazamata neve" maxlength="32" value="${name}">
            ` : `
                <div class="casemate-name">${name}</div>
            `}
            ${editable ? `
                <img class="casemate-delete svgbutton" src="./assets/images/btn-delete.webp"></img>
            ` : "<div></div>"}
            <div class="casemate-type-container">
                ${
                    !selected || !editable ? casemateTypes[type].name : 
                    `
                        <select class="input casemate-type" name="type">
                            ${casemateTypes.slice(1).map(({name}, index) => (
                                `<option ${type === index + 1 ? "selected" : ""} value="${index + 1}">${name}</option>`
                            )).join("")}
                        </select>
                    `
                }
            </div>
            <img title="Befejezetlen kazamata" class="casemate-incomplete" src="./assets/images/icon-error.webp"></img>
        </form>
    `;
}


function renderGames() {
    let html = "";

    if (lastGame) {
        html = `
            <div class="game">
                <div class="game-title">Utolsó játék folytatása</div>
                <div class="game-buttons">
                    <img class="world-play svgbutton" src="./assets/images/btn-play.png"></img>
                </div>
            </div>
        `;
    } else {
        html = "Még nem keztél el egy játékot sem.";
    }

    document.querySelector(".games-container").innerHTML = html;

    const container = document.querySelector(".games-container > .game");

    if (!container)
        return;

    container.querySelector(".world-play").addEventListener("click", function() {
        if (!lastGame)
            return;
        game = lastGame;
        startGame(lastGame);
    });
}

function renderWorlds() {
    let html = "";
    for (const world of worlds) {
        const isFinished = (
            world.casemates.every(casemate => casemate.cards.length === casemateTypes[casemate.type].ordinary + casemateTypes[casemate.type].boss) &&
            world.collections.every(collection => collection.cards.length > 0) &&
            world.cards.length > 0
        );

        html += `
            <div class="world ${!isFinished ? "unfinished" : ""}" data-world-id="${world.id}">
                <div class="world-title">${world.name}</div>
                <div>Kártyák: ${world.cards.length}</div>
                <div>Vezérkártyák: ${world.cards.filter(card => card.isBoss).length}</div>
                <div>Kazamaták: ${world.casemates.length}</div>
                <div class="world-buttons">
                    <img class="world-play svgbutton" data-disabled=${!isFinished} src="./assets/images/btn-play.png"></img>
                    <img class="world-edit svgbutton" src="./assets/images/btn-edit.webp"></img>
                    <img class="world-delete svgbutton" src="./assets/images/btn-delete.webp"></img>
                </div>
            </div>
        `;
    }

    html += `
        <div class="world world--add">
            <img src="./assets/images/btn-add.webp"></img>
        </div>
    `;

    document.querySelector(".worlds-container").innerHTML = html;

    // Adding event handlers
    function editWorld(worldId = currentWorld) {
        currentWorld = worldId;
        currentCasemate = 1;

        setScreen("world");
        renderWorldEditor();
    }

    for (const worldElement of document.querySelectorAll(".worlds-container > .world:not(.world--add)")) {
        const worldId = parseInt(worldElement.dataset.worldId);
        const worldIndex = worlds.findIndex(world => world.id === worldId);
        const world = worlds[worldIndex];

        worldElement.querySelector(".world-play").addEventListener("click", function() {
            startWorld(world.cards, world.collections[0].cards, world.casemates);
        });

        worldElement.querySelector(".world-edit").addEventListener("click", function() {
            editWorld(worldId);
        });

        worldElement.querySelector(".world-delete").addEventListener("click", function() {
            worlds.splice(worldIndex, 1);
            renderWorlds();
            deleteWorld(world);
        });
    }

    document.querySelector(".worlds-container > .world--add").addEventListener("click", function() {
        const newId = worlds.reduce((maxId, world) => Math.max(maxId, world.id), 0) + 1;
        worlds.push({
            id: newId,
            name: "Új világ",
            cards: [],
            casemates: [{id: 1, name: "Első kazamata", type: 1, cards: []}],
            collections: [{type: 0, cards: []}]
        });

        editWorld(newId);
        renderWorlds();
    });
}

function renderWorldEditor() {
    const world = getWorldById(currentWorld);
    document.querySelector(".screen--world .world-name").value = world.name;

    renderCards();
    renderCasemates();
    renderCasemateCards();
}

function renderCards() {
    const cards = getWorldById(currentWorld).cards
        .sort((a, b) => (a.bossSource || a.id) - (b.bossSource || b.id));

    // Generating HTML
    let html = "";
    for (const card of cards) {
        const bosses = cards.filter(_card => _card.bossSource === card.id);
        const healthPromoteDisabled = (
            bosses.some(boss => boss.bossType === "health") ||
            (card.isBoss && cards.some(_card => _card.bossSource === card.bossSource && _card.bossType === "health"))
        );
        const attackPromoteDisabled =(
            bosses.some(boss => boss.bossType === "attack") ||
            (card.isBoss && cards.some(_card => _card.bossSource === card.bossSource && _card.bossType === "attack"))
        );

        html += cardElementAsText(card.id, true, {healthPromoteDisabled, attackPromoteDisabled, ...card});
    }

    html += `
        <div class="worldcard worldcard--add">
            <img src="./assets/images/btn-add.webp"></img>
        </div>
    `;

    const container = document.querySelector(".worldcards-container");
    container.innerHTML = html;

    function getBossProperties(bossType, sourceCard) {
        const health = bossType == "health" ? sourceCard.health * 2 : sourceCard.health;
        const attack = bossType == "attack" ? sourceCard.attack * 2 : sourceCard.attack;
        return {health, attack};
    }

    // Adding event handlers
    for (const cardElement of document.querySelectorAll(".worldcards-container > .worldcard:not(.worldcard--add)")) {
        const cardId = parseInt(cardElement.dataset.cardId);
        const cardIndex = cards.findIndex(card => card.id === cardId);
        const card = cards[cardIndex];
        const bosses = cards.filter(_card => _card.bossSource === card.id);

        if (!card) {
            console.warn(`Card with id ${cardId} not found at renderCards`);
            continue;
        }

        cardElement.querySelector(".worldcard-name").addEventListener("change", function() {
            card.name = this.value.slice(0, 16);
            renderCasemateCards();
        });

        cardElement.querySelector(".worldcard-health").addEventListener("change", function() {
            card.health = Math.max(minHealth, Math.min(maxHealth, parseInt(this.value)));

            for (const bossCard of bosses) {
                const {health} = getBossProperties(bossCard.bossType, card);
                bossCard.health = health;
            }
    
            renderCards(cards);
            renderCasemateCards();
        });
        
        cardElement.querySelector(".worldcard-attack").addEventListener("change", function() {
            card.attack = Math.max(minAttack, Math.min(maxAttack, parseInt(this.value)));
            
            for (const bossCard of bosses) {
                const {attack} = getBossProperties(bossCard.bossType, card);
                bossCard.attack = attack;
            }

            renderCards(cards);
            renderCasemateCards();
        });

        cardElement.querySelectorAll(".worldcard-type-picker input").forEach(input => {
            input.addEventListener("change", function() {
                if (input.checked) {
                    card.type = input.value;
                }

                for (const bossCard of bosses) {
                    bossCard.type = card.type;
                }

                renderCards(cards);
                renderCasemateCards();
            })
        });

        cardElement.querySelectorAll(".worldcard-promote").forEach(button => {
            button.addEventListener("click", function() {
                const bossType = button.dataset.bossType;

                if (cards.some(_card => (_card.bossSource === card.id || _card.bossSource === card.bossSource) && _card.bossType === bossType))
                    return;

                const sourceCard = !card.isBoss ? card : cards.find(_card => _card.id === card.bossSource);
                const {health, attack} = getBossProperties(bossType, sourceCard);

                if (!card.isBoss) {
                    createCard({name: `${card.name} vezér`, type: card.type, health, attack, isBoss: true, bossSource: card.id, bossType});
                } else {
                    card.bossType = bossType;
                    card.health = health;
                    card.attack = attack;
                    renderCards(cards);
                }
            });
        });

        cardElement.querySelectorAll(".worldcard-property-container").forEach(container => {
            const input = container.querySelector("input");
            
            container.querySelectorAll(".worldcard-property-arrow").forEach(button => {
                button.addEventListener("click", function() {
                    const increment = parseInt(button.dataset.increment);
                    const value = Math.max(input.min, Math.min(parseInt(input.value) + increment, input.max));
                    input.value = value;
                    card[input.name] = value;

                    for (const bossCard of bosses) {
                        const {health, attack} = getBossProperties(bossCard.bossType, card);
                        bossCard.health = health;
                        bossCard.attack = attack;
                    }

                    renderCards(cards);
                    renderCasemateCards();
                });
            });
        });

        cardElement.querySelector(".worldcard-delete").addEventListener("click", function() {
            getWorldById(currentWorld).casemates.forEach(casemate => {
                for (const cardId of [card.id, ...bosses.map(card => card.id)]) {
                    if (casemate.cards.includes(cardId)) {
                        casemate.cards.splice(casemate.cards.indexOf(cardId), 1);
                    }
                }
            });

            bosses.forEach(card => {
                const index = cards.findIndex(_card => _card.id === card.id);
                cards.splice(index, 1);
            });
            
            cards.splice(cardIndex, 1);
            renderCards(cards);
            renderCasemateCards();
        });

        cardElement.querySelectorAll("input.min-max-control").forEach(input => {
            input.addEventListener("change", function() {
                if (this.classList.contains("integer"))
                    this.value = Math.round(this.value);
    
                input.value = Math.max(input.min, Math.min(input.value, input.max));
                renderCasemateCards();
            });
        });
    }


    container.querySelector(".worldcard--add").addEventListener("click", function() {
        createCard();
    });

    renderWorlds();
}

function renderCasemateCards() {
    const casemate = getCasemateById(currentCasemate);

    // Generating HTML
    let htmlOrdinary = "";
    let htmlOrdinaryPlaceholder = ""
    let htmlBoss = "";
    let htmlBossPlaceholder = "";
    for (const cardId of casemate.cards) {
        const card = getCardById(cardId);
        const cardHtml = cardElementAsText(cardId, false, {deleteButton: true, ...card});
        
        if (!card.isBoss) {
            htmlOrdinary += cardHtml;
        } else {
            htmlBoss += cardHtml;
        }
    }

    const casemateType = casemateTypes[casemate.type];
    const ordinaryCards = casemate.cards.filter(cardId => !getCardById(cardId).isBoss).length;
    const bossCards = casemate.cards.filter(cardId => getCardById(cardId).isBoss).length;
    if (casemate.type !== 0) {
        for (let i = 0; i < casemateType.ordinary - ordinaryCards; i++) {
            htmlOrdinary += `
                <div class="worldcard-placeholder hidden"></div>
            `;
        }
        for (let i = 0; i < casemateType.ordinary; i++) {
            htmlOrdinaryPlaceholder += `
            <div class="worldcard-placeholder ${i < ordinaryCards ? "hidden" : ""}"></div>
            `;
        }
        for (let i = 0; i < casemateType.boss - bossCards; i++) {
            htmlBoss += `
                <div class="worldcard-placeholder hidden"></div>
            `;
        }
        for (let i = 0; i < casemateType.boss; i++) {
            htmlBossPlaceholder += `
                <div class="worldcard-placeholder ${i < bossCards ? "hidden" : ""} boss"></div>
            `;
        }
    }

    document.querySelector(".casemate-ordinary-container").innerHTML = htmlOrdinary;
    document.querySelector(".casemate-ordinary-placeholder").innerHTML = htmlOrdinaryPlaceholder;
    document.querySelector(".casemate-boss-container").innerHTML = htmlBoss;
    document.querySelector(".casemate-boss-placeholder").innerHTML = htmlBossPlaceholder;

    document.querySelector(".casemate-cards-boss-wrapper").classList.toggle("hidden", casemate.type === 0);

    // Adding event handlers
    for (const cardElement of document.querySelectorAll(":is(.casemate-cards-container, .casemate-boss-container) > .worldcard")) {
        const cardId = parseInt(cardElement.dataset.cardId);

        cardElement.querySelector(".worldcard-delete").addEventListener("click", function() {
            casemate.cards.splice(casemate.cards.indexOf(cardId), 1);

            renderCasemateCards();
            renderCasemates();
        });
    }

    renderWorlds();
}

function renderCasemates() {
    const casemates = getWorldById(currentWorld).casemates;

    // Generating HTML
    let html = "";
    for (const casemate of casemates) {
        const selected = currentCasemate === casemate.id;
        const incomplete = casemate.cards.length < casemateTypes[casemate.type].ordinary + casemateTypes[casemate.type].boss;

        html += casemateElementAsText(casemate.id, true, {selected, incomplete, ...casemate});
    }

    html += `
        <div class="casemate casemate--add">
            <img src="./assets/images/btn-add.webp"></img>
        </div>
    `;

    const container = document.querySelector(".casemates-container");
    container.innerHTML = html;

    document.querySelector(".casemate-cards-h3").textContent = currentCasemate === -1 ? "A gyűjtemény kártyái" : "A kazamata kártyái";
    document.querySelector(".section--casemates .collection").classList.toggle("selected", currentCasemate === -1);

    // Adding event handlers
    for (const casemateElement of document.querySelectorAll(".casemates-container > .casemate:not(.casemate--add)")) {
        const casemateId = parseInt(casemateElement.dataset.casemateId);
        const casemateIndex = casemates.findIndex(casemate => casemate.id === casemateId)
        const casemate = casemates[casemateIndex];

        if (!casemate) {
            console.warn(`Casemate with id ${casemateId} not found at renderCasemates`);
            continue;
        }

        casemateElement.addEventListener("click", function(event) {
            if (event.target === this) {
                currentCasemate = casemate.id;
                renderCasemates();
                renderCasemateCards();
            }
        })

        casemateElement.querySelector(".casemate-name").addEventListener("change", function() {
            casemate.name = this.value.slice(0, 32);
        });

        casemateElement.querySelector(".casemate-type")?.addEventListener("change", function() {
            casemate.type = parseInt(this.value);

            const casemateType = casemateTypes[casemate.type];
            if (casemate.cards.length > casemateType.ordinary + casemateType.boss) {
                let ordinary = 0;
                let boss = 0;
                let _cards = []
                for (let i = 0; i < casemate.cards.length; i++) {
                    if (getCardById(casemate.cards[i]).isBoss) {
                        boss++;
                        if (boss <= casemateType.boss) {
                            _cards.push(casemate.cards[i]);
                        }
                    } else {
                        ordinary++;
                        if (ordinary <= casemateType.ordinary) {
                            _cards.push(casemate.cards[i]);
                        }
                    }
                }
                casemate.cards = _cards;
            }

            renderCasemateCards();
            renderCasemates();
        });

        casemateElement.querySelector(".casemate-delete").addEventListener("click", function() {
            if (casemates.length <= 1) {
                return;
            }

            casemates.splice(casemateIndex, 1);
            if (currentCasemate === casemate.id) {
                currentCasemate = casemates[casemateIndex]?.id || casemates[casemateIndex - 1]?.id
            }
            renderCasemates();
            renderCasemateCards();
        });
    }

    container.querySelector(".casemate--add").addEventListener("click", function() {
        createCasemate();
    });

    renderWorlds();
}


function createCard({name = "", health = 1, attack = 2, type = "earth", isBoss = false, bossSource = null, bossType = null} = {}) {
    const world = getWorldById(currentWorld);
    const id = world.cards.reduce((a, card) => Math.max(a, card?.id || 0), 1) + 1;
    world.cards.push({id, name, health, attack, type, isBoss, bossSource, bossType});
    renderCards(world.cards);
}

function createCasemate({name = "", type = 1, cards = []} = {}) {
    const world = getWorldById(currentWorld);
    const id = world.casemates.reduce((a, casemate) => Math.max(a, casemate?.id || 0), 1) + 1;
    world.casemates.push({id, name, type, cards});
    currentCasemate = id;
    renderCasemates();
    renderCasemateCards();
}

function updateCasemateCards() {
    const cardIds = [...casemateCardTargetElement.querySelectorAll(".worldcard"), ...casemateBossTargetElement.querySelectorAll(".worldcard")]
        .map(element => parseInt(element.dataset.cardId));

    getCasemateById(currentCasemate).cards = cardIds;
}

function updateGameDeck() {
    const cardIds = [...playerCardTargetElement.querySelectorAll(".worldcard")]
        .map(element => parseInt(element.dataset.cardId));

    game.deck = cardIds;
}



function renderGameCollection() {
    if (!game)
        return false;

    const collection = game.collection;

    // Generating HTML
    let html = "";
    for (const card of collection) {
        const cardId = card.id;

        if (game.deck.includes(cardId))
            continue;

        html += cardElementAsText(cardId, false, card);
    }

    document.querySelector(".game-collection-container").innerHTML = html;

    // Adding event handlers
}

function renderGameCasemates() {
    if (!game)
        return false;

    const casemates = game.casemates;

    // Generating HTML
    let html = "";
    for (const casemate of casemates) {
        const selected = game.currentCasemate === casemate.id;
        html += casemateElementAsText(casemate.id, false, {selected, ...casemate});
    }

    document.querySelector(".game-casemates-container").innerHTML = html;
    
    // Adding event handlers
    for (const casemateElement of document.querySelectorAll(".game-casemates-container > .casemate")) {
        const casemateId = parseInt(casemateElement.dataset.casemateId);
        const casemate = getCasemateById(casemateId, game.casemates);
        const casemateType = casemateTypes[casemate.type];
        const casemateCardsCount = casemateType.ordinary + casemateType.boss;

        casemateElement.addEventListener("click", function() {
            game.currentCasemate = casemateId;

            if (game.deck.length > casemateCardsCount) {
                game.deck = game.deck.slice(0, casemateCardsCount);
            }

            renderGameCollection();
            renderGameCasemates();
            renderGameCasemateCards();
            renderGameDeck();
        });
    }
}

function renderGameCasemateCards() {
    if (!game)
        return false;

    const casemate = getCasemateById(game.currentCasemate, game.casemates);

    // Generating HTML
    let html = "";
    for (const card of casemate.cards) {
        const cardId = card.id;
        html += cardElementAsText(cardId, false, {draggable: false, ...card});
    }

    const container = document.querySelector(".game-casemate-cards-container")
    container.style.setProperty("--cards", casemate.cards.length);
    container.innerHTML = html;
}

function renderGameDeck() {
    if (!game)
        return false;

    const casemate = getCasemateById(game.currentCasemate, game.casemates);
    const casemateType = casemateTypes[casemate.type];
    const casemateCardsCount = casemateType.ordinary + casemateType.boss;

    if (game.deck.length > casemateCardsCount) {
        game.deck = game.deck.slice(0, casemateCardsCount);
    }

    let html = "";
    let htmlPlaceholder = "";
    for (const cardId of game.deck) {
        const card = getCardById(cardId, game.collection);
        html += cardElementAsText(cardId, false, {deleteButton: true, ...card});
    }

    for (let i = 0; i < casemateCardsCount - game.deck.length; i++) {
        html += `
            <div class="worldcard-placeholder hidden"></div>
        `;
    }
    
    for (let i = 0; i < casemateCardsCount; i++) {
        htmlPlaceholder += `
            <div class="worldcard-placeholder ${i < game.deck.length ? "hidden" : ""}"></div>
        `;
    }

    const containerCards = document.querySelector(".game-player-cards-container");
    const containerPlaceholders = document.querySelector(".game-player-cards-placeholder");
    containerCards.style.setProperty("--cards", game.deck.length);
    containerCards.innerHTML = html;
    containerPlaceholders.style.setProperty("--cards", game.deck.length);
    containerPlaceholders.innerHTML = htmlPlaceholder;

    // Event handlers
    for (const cardElement of document.querySelectorAll(".game-player-cards-container > .worldcard")) {
        const cardId = parseInt(cardElement.dataset.cardId);
        const cardIndex = game.deck.indexOf(cardId);

        cardElement.querySelector(".worldcard-delete").addEventListener("click", function() {
            game.deck.splice(cardIndex, 1);
            renderGameDeck();
            renderGameCollection();
        });
    }

    document.querySelector(".game-start-button").disabled = game.deck.length < casemateCardsCount;
}

function renderBattleCasemateCards() {
    if (!game)
        return false;

    const casemate = getCasemateById(game.currentCasemate, game.casemates);

    // Generating HTML
    let html = "";
    for (const card of casemate.cards) {
        const cardId = card.id;
        html += cardElementAsText(cardId, false, {draggable: false, ...card});
    }

    const container = document.querySelector(".battle-casemate-cards-container")
    container.style.setProperty("--cards", casemate.cards.length);
    container.innerHTML = html;
}

function renderBattlePlayerCards() {
    if (!game)
        return false;

    const deck = game.deck;

    let html = "";
    for (const cardId of deck) {
        html += cardElementAsText(cardId, false, {draggable: false, ...getCardById(cardId, game.collection)});
    }

    const containerCards = document.querySelector(".battle-player-cards-container");
    containerCards.style.setProperty("--cards", game.deck.length);
    containerCards.innerHTML = html;
}

function renderCardUpgrade(upgradeType, upgradeValue) {
    let html = "";
    for (const card of game.collection) {
        html += cardElementAsText(card.id, false, {draggable: false, clickable: true, ...card});
    }

    document.querySelector(".dialog-upgrade-cards .cards-upgrade-container").innerHTML = html;
    document.querySelector(".upgrades-to-spend").innerHTML = `
        <img src="./assets/images/${upgradeType}.webp"></img>
        ${upgradeValue}
    `;

    const dialog = document.querySelector(".dialog-upgrade-cards");
    dialog.showModal();

    const cardElements = document.querySelectorAll(".dialog-upgrade-cards .cards-upgrade-container > .worldcard");
    for (const cardElement of cardElements) {
        const cardId = parseInt(cardElement.dataset.cardId);
        const card = getCardById(cardId, game.collection);

        cardElement.addEventListener("click", function() {
            if (upgradeType === "health") {
                card.health += upgradeValue;
            } else if (upgradeType === "attack") {
                card.attack += upgradeValue;
            }
            dialog.close();
            setScreen("game-deck");
            renderGameCollection();
            renderGameCasemateCards();
            renderGameDeck();
        });
    }
}


function startWorld(cards, collection, casemates, deck = []) {
    /**
    * game = {
    *    collection:        The player's collection of cards, that the player can upgrade
    *    deck:              The player's current deck
    *    casemates:         The casemates in the world (with their cards)
    *    currentCasemate:   The currently selected casemate
    * }
    */

    startGame({
        collection: collection.map(cardId => structuredClone(getCardById(cardId, cards))),
        deck: deck.map(cardId => structuredClone(getCardById(cardId, cards))),
        casemates: casemates.map(casemate => (
            {
                id: casemate.id,
                type: casemate.type,
                name: casemate.name,
                cards: casemate.cards.map(cardId => structuredClone(getCardById(cardId, cards)))
            }
        )),
        currentCasemate: casemates[0].id
    });
}

function startGame(gameData) {
    game = gameData;

    if (game.currentCasemate == null) {
        game.currentCasemate = game.casemates[0].id;
    }

    setScreen("game-deck");
    renderGameCollection();
    renderGameCasemates();
    renderGameCasemateCards();
    renderGameDeck();
}

function startBattle() {
    if (!(
        game &&
        game.deck.length == casemateTypes[getCasemateById(game.currentCasemate, game.casemates).type].ordinary + casemateTypes[getCasemateById(game.currentCasemate, game.casemates).type].boss
    ))
        return false;

    renderBattleCasemateCards();
    renderBattlePlayerCards();
    setScreen("game-battle");
    animateBattle();
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateBattle() {
    const casemate = getCasemateById(game.currentCasemate, game.casemates);

    const casemateCards = casemate.cards;
    const playerCards = game.deck.map(cardId => getCardById(cardId, game.collection));

    let casemateScore = 0;
    let playerScore = 0;
    const casemateScoreElement = document.querySelector(".battle-casemate-score");
    const playerScoreElement = document.querySelector(".battle-player-score");
    const battleResultElement = document.querySelector(".battle-result");

    playerScoreElement.textContent = "0";
    casemateScoreElement.textContent = "0";
    battleResultElement.classList.remove("show");

    for (let i = 0; i < casemate.cards.length; i++) {
        const casemateCard = casemateCards[i];
        const _casemateCard = structuredClone(casemateCard);
        const casemateCardElement = document.querySelector(`.battle-casemate-cards-container > .worldcard[data-card-id="${_casemateCard.id}"]`);
        const playerCard = playerCards[i];
        const _playerCard = structuredClone(playerCard);
        const playerCardElement = document.querySelector(`.battle-player-cards-container > .worldcard[data-card-id="${_playerCard.id}"]`);

        casemateCardElement.classList.add("fighting");
        playerCardElement.classList.add("fighting");

        const iterations = Math.min(Math.max(_casemateCard.health, _playerCard.attack), Math.max(_casemateCard.attack, _playerCard.health));
        const delayTime = battleAnimationDuration / iterations;

        while (_casemateCard.health > 0 && _playerCard.health > 0 && (_casemateCard.attack > 0 || _playerCard.attack > 0)) {
            await delay(delayTime);
            if (_playerCard.attack > 0)
                _casemateCard.health--;
            if (_casemateCard.attack > 0)
                _playerCard.health--;

            if (_casemateCard.attack > 0)
                _casemateCard.attack--;
            if (_playerCard.attack > 0)
                _playerCard.attack--;
            
            casemateCardElement.querySelector(".worldcard-health").value = _casemateCard.health;
            casemateCardElement.querySelector(".worldcard-attack").value = _casemateCard.attack;
            playerCardElement.querySelector(".worldcard-health").value = _playerCard.health;
            playerCardElement.querySelector(".worldcard-attack").value = _playerCard.attack;
        }

        
        /*
            BATTLE LOGIC
            
                0   vs    1   -> 0/1/?
            (a, h) vs (a, h) -> winner
            
            (2, 2) vs (1, 1) -> 0
            (2, 2) vs (1, 2) -> ?
            (2, 2) vs (2, 1) -> 0
            (2, 2) vs (2, 2) -> ?
            (2, 1) vs (1, 1) -> 0
            (2, 1) vs (1, 2) -> ?
            (2, 1) vs (2, 1) -> ?
        */

        function getWinnerByAH(a1, h1, a2, h2) {
            if (a1 > h2 && !(a2 > h1)) {
                return 1;
            } else if (a2 > h1 && !(a1 > h2)) {
                return 2;
            } else {
                return 0;
            }
        }

        function getWinnerByType(type1, type2) {
            const typeDiff = cardTypes.indexOf(type2) - cardTypes.indexOf(type1);
            if (typeDiff == 1 || typeDiff == 3) {
                return 1;
            } else if (typeDiff == -1 || typeDiff == -3) {
                return 2;
            } else {
                return 0;
            }
        }
        
        const winnerByAH = getWinnerByAH(playerCard.attack, playerCard.health, casemateCard.attack, casemateCard.health);
        const winnerByType = getWinnerByType(playerCard.type, casemateCard.type);
        console.log(winnerByAH, winnerByType);
        
        let playerWon = false;
        if (winnerByAH === 1) {
            playerWon = true;
        } else if (winnerByAH === 0 && winnerByType === 1) {
            playerWon = true;
        }

        /* if (playerCard.attack <= casemateCard.health && casemateCard.attack <= playerCard.health) {
            if (typeDiff == 1 || typeDiff == 3) {
                playerWon = true;
            }
        } else if (playerCard.attack > casemateCard.health) {
            playerWon = true
        } */

        if (playerWon) {
            playerScore++;
        } else {
            casemateScore++;
        }

        playerScoreElement.textContent = playerScore;
        casemateScoreElement.textContent = casemateScore;

        const casemateWon = !playerWon;

        if (playerWon) {
            casemateCardElement.classList.add("lost");
            playerCardElement.classList.add("won");
        } else if (casemateWon) {
            casemateCardElement.classList.add("won");
            playerCardElement.classList.add("lost");
        }

        
        casemateCardElement.classList.remove("fighting");
        playerCardElement.classList.remove("fighting");
    }
    
    const battleWon = playerScore >= casemateScore;

    battleResultElement.classList.add("show");
    battleResultElement.textContent = playerScore >= casemateScore ? "Győzelem" : "Csata elvesztve";

    if (battleWon) {
        await delay(2000);
        const {upgradeType, upgradeValue} = casemateTypes[casemate.type];
        renderCardUpgrade(upgradeType, upgradeValue);
    } else {
        await delay(2000);
        setScreen("game-deck");
        renderGameCollection();
        renderGameCasemateCards();
        renderGameDeck();
    }
}


function resetStatusElements(elements = [], delay = 0) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }

    setTimeout(function() {
        elements.forEach(element => {
            element.textContent = "";
        });
    }, delay);
}

async function uploadWorld(world) {
    const statusMessageEditor = document.querySelector(".status-message--world-save");
    const statusMessageHome = document.querySelector(".status-message--worlds");
    return fetch('push_world.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(world)
    })
    .then(response => {
        if (response.ok) {
            statusMessageHome.textContent = "";
            statusMessageEditor.dataset.type = "success";
            statusMessageEditor.textContent = "Világ mentve";
            resetStatusElements([statusMessageEditor, statusMessageHome], 5000);
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    })
    .catch(error => {
        [statusMessageEditor, statusMessageHome].forEach(element => {
            element.dataset.type = "error";
            element.textContent = "Nem sikerült menteni a világot";
        });
        resetStatusElements([statusMessageEditor, statusMessageHome], 5000);
        console.error('Error:', error);
    });
}

function fetchWorlds() {
    const statusMessage = document.querySelector(".status-message--worlds");
    statusMessage.dataset.type = "neutral";
    statusMessage.textContent = "Betöltés...";

    fetch("fetch_worlds.php")
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            statusMessage.textContent = "";
            worlds = data;
            renderWorlds();
        })
        .catch(error => {
            statusMessage.dataset.type = "error";
            statusMessage.textContent = "Nem sikerült betölteni a mentett világokat";
            console.error("Fetch error:", error);
            resetStatusElements(statusMessage, 5000);
        });
}

function fetchLastGame() {
    const statusMessage = document.querySelector(".status-message--games");
    statusMessage.dataset.type = "neutral";
    statusMessage.textContent = "Betöltés...";
    fetch("fetch_last_game.php")
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            statusMessage.textContent = "";
            lastGame = JSON.parse(data);
            renderGames();
        })
        .catch(error => {
            statusMessage.dataset.type = "error";
            statusMessage.textContent = "Nem sikerült betölteni az utolsó játékot";
            console.error("Fetch error:", error);
            resetStatusElements(statusMessage, 5000);
        });
}

async function uploadLastGame(game) {
    const statusMessage = document.querySelector(".status-message--games");
    return fetch('push_last_game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(game)
    })
    .then(response => {
        if (response.ok) {
            statusMessage.dataset.type = "success";
            statusMessage.textContent = "Játék mentve";
            renderGames();
            resetStatusElements(statusMessage, 5000);
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    })
    .catch(error => {
        statusMessage.dataset.type = "error";
        statusMessage.textContent = "Nem sikerült menteni a világot";
        console.error('Error:', error);
        resetStatusElements(statusMessage, 5000);
    });
}

async function deleteWorld(world) {
    const statusMessage = document.querySelector(".status-message--worlds");
    return fetch('delete_world.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(world)
    })
    .then(response => {
        if (response.ok) {
            statusMessage.dataset.type = "success";
            statusMessage.textContent = "Világ törölve";
            resetStatusElements(statusMessage, 5000);
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    })
    .catch(error => {
        statusMessage.dataset.type = "error";
        statusMessage.textContent = "Nem sikerült törölni a világot";
        console.error('Error:', error);
        resetStatusElements(statusMessage, 5000);
    });
}

function openDialog(dialog) {
    document.getElementById(`dialog--${dialog}`).showModal();
}



document.querySelectorAll(".worldcard-property-container").forEach(container => {
    const input = container.querySelector("input");
    
    container.querySelectorAll(".worldcard-property-arrow").forEach(button => {
        button.addEventListener("click", function() {
            const increment = parseInt(button.dataset.increment);
            const value = parseInt(input.value);
            input.value = Math.max(input.min, Math.min(value + increment, input.max));
        });
    });
});

new Sortable(casemateCardSourceElement, {
    group: {
        name: casemateCardSourceGroup,
        pull: "clone",
        put: false
    },
    sort: false,
    animation: 150,
    ghostClass: 'sortable-ghost',
});

new Sortable(casemateCardTargetElement, {
    group: {
        name: casemateCardTargetGroup,
        // put: [casemateCardSourceGroup, casemateCardTargetGroup],
        put: function(to, from, item) {
            if (from.options.group.name === casemateCardSourceGroup) {
                const cardId = parseInt(item.dataset.cardId);
                const card = getCardById(cardId);
                const casemate = getCasemateById(currentCasemate);
                const allow = (
                    !casemate.cards.includes(cardId) &&
                    casemate.cards.filter(cardId => !getCardById(cardId).isBoss).length < casemateTypes[casemate.type].ordinary &&
                    !card.isBoss
                );
                return allow;
            }

            // Allow reordering
            return from.options.group.name === casemateCardTargetGroup;
        },
        pull: true
    },
    sort: true,
    animation: 150,
    ghostClass: 'sortable-ghost',
    filter: '.worldcard-placeholder',
    preventOnFilter: true,

    onAdd: function(event) {
        const cardId = parseInt(event.item.dataset.cardId);
        const card = getCardById(cardId);
        event.item.outerHTML = cardElementAsText(card.id, false, card);

        renderCards();
        updateCasemateCards();
        renderCasemateCards();
        renderCasemates();
    },

    onUpdate: updateCasemateCards
});

new Sortable(casemateBossTargetElement, {
    group: {
        name: casemateBossTargetGroup,
        // put: [casemateCardSourceGroup, casemateBossTargetGroup], 
        put: function(to, from, item) {
            if (from.options.group.name === casemateCardSourceGroup) {
                const cardId = parseInt(item.dataset.cardId);
                const card = getCardById(cardId);
                const casemate = getCasemateById(currentCasemate);
                const allow = (
                    !casemate.cards.includes(cardId) &&
                    casemate.cards.filter(cardId => getCardById(cardId).isBoss).length < casemateTypes[casemate.type].boss &&
                    card.isBoss
                );
                return allow;
            }

            // Allow reordering
            return from.options.group.name === casemateBossTargetGroup;
        },
        pull: true
    },
    sort: true,
    animation: 150,
    ghostClass: 'sortable-ghost',

    onAdd: function(event) {
        const cardId = parseInt(event.item.dataset.cardId);
        const card = getCardById(cardId);
        event.item.outerHTML = cardElementAsText(card.id, false, card);

        renderCards();
        updateCasemateCards();
        renderCasemateCards();
        renderCasemates();
    },

    onUpdate: updateCasemateCards
});


new Sortable(playerCardSourceElement, {
    group: {
        name: playerCardSourceGroup,
        // pull: "clone",
        put: function(to, from, item) {
            return (
                from.options.group.name === playerCardSourceGroup ||
                playerCardSourceElement.querySelectorAll(`.worldcard[data-card-id="${item.dataset.cardId}"]`).length < 1
            );
        }
    },

    sort: false,
    animation: 150,
    ghostClass: 'sortable-ghost',

    onAdd: function() {
        updateGameDeck();
        renderGameCollection();
        renderGameDeck();
    }
});

new Sortable(playerCardTargetElement, {
    group: {
        name: playerCardTargetGroup,
        // put: [playerCardSourceGroup, playerCardTargetGroup],
        put: function(to, from, item) {
            if (from.options.group.name === playerCardSourceGroup) {
                const cardId = parseInt(item.dataset.cardId);
                return !game.deck.includes(cardId) && game.deck.length < getCasemateById(game.currentCasemate, game.casemates).cards.length;
            }

            // Allow reordering
            return from.options.group.name === playerCardTargetGroup;
        },
        pull: true
    },

    sort: true,
    animation: 150,
    ghostClass: 'sortable-ghost',
    filter: '.worldcard-placeholder',
    preventOnFilter: true,

    onAdd: function() {
        updateGameDeck();
        renderGameDeck();
    },

    onUpdate: updateCasemateCards
});


document.querySelector(".login-button--login").addEventListener("click", function() {
    document.getElementById("dialog--login").showModal();
});
document.querySelector(".login-button--register").addEventListener("click", function() {
    document.getElementById("dialog--register").showModal();
});
document.getElementById("account-btn-change-username").addEventListener("click", function() {
    document.getElementById("dialog--change-username").showModal();
});

document.getElementById("account-btn-change-password").addEventListener("click", function() {
    document.getElementById("dialog--change-password").showModal();
});

document.getElementById("account-btn-delete-account").addEventListener("click", function() {
    document.getElementById("dialog--delete-account").showModal();
});

document.getElementById("account-btn-logout").addEventListener("click", function() {
    const a = document.createElement("a");
    a.href = "logout_process.php";
    a.click();
});

document.querySelectorAll("dialog").forEach(dialog => {
    dialog.querySelector(".dialog-close")?.addEventListener("click", function() {
        dialog.close();
    });
});

document.querySelector(".screen--world .world-name").addEventListener("change", function() {
    const world = getWorldById(currentWorld);
    world.name = this.value.slice(0, parseInt(this.getAttribute("maxlength")));
    renderWorlds();
});

document.querySelector(".screen--world .world-save-button").addEventListener("click", function() {
    const world = getWorldById(currentWorld);
    if (loggedIn)
        uploadWorld(world);
});

document.querySelector(".world-back-button").addEventListener("click", function() {
    const world = getWorldById(currentWorld);
    if (loggedIn)
        uploadWorld(world);
    setScreen("home");
});
document.querySelectorAll(".game-back-button").forEach(button => {
    button.addEventListener("click", function() {
        if (loggedIn)
            uploadLastGame(game);
        setScreen("home");
    });
});

document.querySelector(".section--casemates .collection").addEventListener("click", function() {
    currentCasemate = -1;
    renderCasemates();
    renderCasemateCards();
});

document.querySelectorAll(".account-menu-item").forEach(button => {
    button.addEventListener("click", function() {
        document.getElementById("account-menu-opened").checked = false;
    });
});

document.querySelector(".game-start-button").addEventListener("click", function() {
    startBattle();
});


if (loggedIn) {
    fetchWorlds();
    fetchLastGame();
} else {
    renderWorlds();
}