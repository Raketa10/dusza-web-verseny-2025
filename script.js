// Constants
const casemateTypes = [
    {name: "Egyszerű találkozás", ordinary: 1, boss: 0},
    {name: "Kis kazamata", ordinary: 3, boss: 1}, 
    {name: "Nagy kazamata", ordinary: 5, boss: 1}
];

const minHealth = 1;
const maxHealth = 100;
const minAttack = 2;
const maxAttack = 100;


// Globals
let worlds = [
    {
        id: 1,
        name: "Első világ",
        cards: [
            {
                id: 1,
                name: "A",
                health: 1,
                attack: 2,
                type: "earth",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 2,
                name: "B",
                health: 1,
                attack: 2,
                type: "fire",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 3,
                name: "C",
                health: 1,
                attack: 2,
                type: "water",
                isBoss: false,
                bossSource: null,
                bossType: null
            },
            {
                id: 4,
                name: "D",
                health: 1,
                attack: 2,
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
                type: 0,
                cards: []
            }
        ]
    }
];

let currentWorld = 1;
let currentCasemate = 1;


// Elements
const screenContainer = document.querySelector(".screen-container");
const casemateCardSourceElement = document.querySelector(".worldcards-container");
const casemateCardTargetElement = document.querySelector(".casemate-ordinary-container");
const casemateBossTargetElement = document.querySelector(".casemate-boss-container");
const casemateCardSourceGroup = "casemateCardSource";
const casemateCardTargetGroup = "casemateOrdinaryTarget";
const casemateBossTargetGroup = "casemateBossTarget";


function setScreen(screen) {
    screenContainer.dataset.screen = screen;
}


function getWorldById(id) {
    return worlds.find(world => world.id === id);
}
function getCardById(id) {
    return getWorldById(currentWorld).cards.find(card => card.id === id);
}
function getCasemateById(id) {
    return getWorldById(currentWorld).casemates.find(casemate => casemate.id === id);
}

function cardElementAsText(id, editable, {name = "", health = 1, attack = 2, type = "earth", isBoss = false, bossSource = null, bossType = null, attackPromoteDisabled = false, healthPromoteDisabled = false, deleteButton = false} = {}) {
    return `
        <form class="worldcard ${isBoss ? "boss" : ""} ${isBoss ? `boss--${bossType}` : ""} ${!editable ? "readonly" : ""}" data-card-id="${id}">
            <div class="worldcard-grid">
                <textarea ${!editable ? "readonly" : ""} placeholder="A kártya neve" name="worldcard-name" minlength="1" maxlength="16" class="worldcard-property worldcard-name" rows="2">${name}</textarea>
                <div class="worldcard-property-container worldcard-attack-container">
                    ${editable ? `
                        <svg class="worldcard-promote" data-disabled="${attackPromoteDisabled}" data-boss-type="attack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlns:v="https://vecta.io/nano"><g stroke="#000"><path d="M81.18 327.439L500 19.098l418.82 308.341z" paint-order="normal" /><path d="M81.18 391.46L500 83.119 918.82 391.46z" fill="#000" paint-order="normal" /><path d="M81.18 545.166L500 236.825l418.82 308.341z" paint-order="normal" /><path d="M81.18 619.942L500 311.601l418.82 308.341z" fill="#000" paint-order="normal" /><path d="M81.18 773.649L500 465.308l418.82 308.341z" paint-order="normal" /><path d="M81.18 835.962L500 527.621l418.82 308.341z" fill="#000" paint-order="normal" /></g><path d="M81.18 989.668L500 681.327l418.82 308.341z" stroke="#fff" paint-order="normal" /></svg>
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
                <div class="worldcard-property-container worldcard-health-container">
                    ${editable ? `
                        <svg class="worldcard-promote" data-disabled="${healthPromoteDisabled}" data-boss-type="health" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlns:v="https://vecta.io/nano"><g stroke="#000"><path d="M81.18 327.439L500 19.098l418.82 308.341z" paint-order="normal" /><path d="M81.18 391.46L500 83.119 918.82 391.46z" fill="#000" paint-order="normal" /><path d="M81.18 545.166L500 236.825l418.82 308.341z" paint-order="normal" /><path d="M81.18 619.942L500 311.601l418.82 308.341z" fill="#000" paint-order="normal" /><path d="M81.18 773.649L500 465.308l418.82 308.341z" paint-order="normal" /><path d="M81.18 835.962L500 527.621l418.82 308.341z" fill="#000" paint-order="normal" /></g><path d="M81.18 989.668L500 681.327l418.82 308.341z" stroke="#fff" paint-order="normal" /></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
                    </div>
                ` : ""}
            </div>
        </form>
    `;
}

function renderWorlds() {
    let html = "";
    for (const world of worlds) {
        html += `
            <div class="world" data-world-id="${world.id}">
                <div class="world-title">${world.name}</div>
                <div>Kártyák: ${world.cards.length}</div>
                <div>Vezérkártyák: ${world.cards.filter(card => card.isBoss).length}</div>
                <div>Kazamaták: ${world.casemates.length}</div>
                <div class="world-buttons">
                    <svg class="world-play svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                    <svg class="world-edit svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-120q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm544-528 56-56-56-56-56 56 56 56Z"/></svg>
                </div>
            </div>
        `;
    }

    html += `
        <div class="world world--add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>
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
        const world = worlds.find(world => world.id === worldId);

        worldElement.querySelector(".world-play").addEventListener("click", function() {
            currentWorld = world.id;
            renderCasemates();
            renderCards();
        });

        worldElement.querySelector(".world-edit").addEventListener("click", function() {
            editWorld(worldId);
        });

    }

    document.querySelector(".worlds-container > .world--add").addEventListener("click", function() {
        const newId = worlds.reduce((maxId, world) => Math.max(maxId, world.id), 0) + 1;
        worlds.push({
            id: newId,
            name: "Új világ",
            cards: [],
            casemates: [{id: 1, name: "Első kazamata", type: 0, cards: []}]
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

    document.querySelector(".screen--world .world-name").addEventListener("change", function() {
        world.name = this.value.slice(0, parseInt(this.getAttribute("maxlength")));
        renderWorlds();
    });
}

function renderCards() {
    const cards = getWorldById(currentWorld).cards;

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>
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
    for (let i = 0; i < casemateType.boss; i++) {
        htmlBossPlaceholder += `
            <div class="worldcard-placeholder ${i < bossCards ? "hidden" : ""} boss"></div>
        `;
    }

    document.querySelector(".casemate-ordinary-container").innerHTML = htmlOrdinary;
    document.querySelector(".casemate-ordinary-placeholder").innerHTML = htmlOrdinaryPlaceholder;
    document.querySelector(".casemate-boss-container").innerHTML = htmlBoss;
    document.querySelector(".casemate-boss-placeholder").innerHTML = htmlBossPlaceholder;

    // Adding event handlers
    for (const cardElement of document.querySelectorAll(":is(.casemate-cards-container, .casemate-boss-container) > .worldcard")) {
        const cardId = parseInt(cardElement.dataset.cardId);

        cardElement.querySelector(".worldcard-delete").addEventListener("click", function() {
            casemate.cards.splice(casemate.cards.indexOf(cardId), 1);

            renderCasemateCards();
            renderCasemates();
        });
    }
}

function renderCasemates() {
    const casemates = getWorldById(currentWorld).casemates;

    // Generating HTML
    let html = "";
    for (const casemate of casemates) {
        const selected = currentCasemate === casemate.id;
        const incomplete = casemate.cards.length < casemateTypes[casemate.type].ordinary + casemateTypes[casemate.type].boss;

        html += `
            <form class="casemate ${selected ? "selected" : ""} ${incomplete ? "incomplete" : ""}" data-casemate-id="${casemate.id}">
                <input class="input casemate-name"type="text" name="name" placeholder="Kazamata neve" maxlength="32" value="${casemate.name}">
                <svg class="casemate-delete svgbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
                <div class="casemate-type-container">
                    ${
                        !selected ? casemateTypes[casemate.type].name : 
                        `
                            <select class="input casemate-type" name="type">
                                ${casemateTypes.map(({name}, index) => (
                                    `<option ${casemate.type === index ? "selected" : ""} value="${index}">${name}</option>`
                                )).join("")}
                            </select>
                        `
                    }
                </div>
                <svg title="Befejezetlen kazamata" class="casemate-incomplete" viewBox="0 0 192 512" xmlns="http://www.w3.org/2000/svg"><path d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"/></svg>
            </form>
        `;
    }

    html += `
        <div class="casemate casemate--add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>
        </div>
    `;

    const container = document.querySelector(".casemates-container");
    container.innerHTML = html;

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
}


function createCard({name = "", health = 1, attack = 2, type = "earth", isBoss = false, bossSource = null, bossType = null} = {}) {
    const world = getWorldById(currentWorld);
    const id = world.cards.reduce((a, card) => Math.max(a, card?.id || 0), 1) + 1;
    world.cards.push({id, name, health, attack, type, isBoss, bossSource, bossType});
    renderCards(world.cards);
}

function createCasemate({name = "", type = 0, cards = []} = {}) {
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



async function uploadWorld(world) {
    return fetch('push_world.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(world)
    })
    .then(response => {
        if (response.ok) {
            console.log("Request sent successfully, but no data returned.");
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchWorlds() {
    fetch("fetch_worlds.php")
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json(); // Parse the JSON response
        })
        .then(data => {
            worlds = data; // Store the data in the variable
        })
        .catch(error => {
            console.error("Fetch error:", error);  // Handle errors
        });
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


document.querySelector(".world--add").addEventListener("click", function() {
    createWorld();
});

document.querySelector(".world-back-button").addEventListener("click", () => setScreen("home"));

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
        console.log("Ald")
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

document.querySelector(".login-button--login").addEventListener("click", function() {
    document.getElementById("dialog--login").showModal();
});
document.querySelector(".login-button--register").addEventListener("click", function() {
    document.getElementById("dialog--register").showModal();
});
document.querySelectorAll("dialog").forEach(dialog => {
    dialog.querySelector(".dialog-close")?.addEventListener("click", function() {
        dialog.close();
    });
});


renderWorlds();