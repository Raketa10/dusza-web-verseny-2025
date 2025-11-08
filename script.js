let worlds = [
    {
        id: 1,
        name: "Első világ",
        cards: [
            {
                id: 1,
                name: "First Card",
                health: 1,
                attack: 2,
                type: "earth",
                isBoss: false,
                bossSource: null,
                bossType: null
            }
        ], casemates: []
    }
];

let currentWorld = 1;

const minHealth = 1;
const maxHealth = 100;
const minAttack = 2;
const maxAttack = 100;

const screenContainer = document.querySelector(".screen-container");


function setScreen(screen) {
    screenContainer.dataset.screen = screen;
}

function createWorld() {
    setScreen("world");
}


function getWorldById(id) {
    return worlds.find(world => world.id === id);
}

function renderCards(cards) {
    let html = "";
    for (const card of cards) {
        const bosses = cards.filter(_card => _card.bossSource === card.id);
        const healthPromoteDisabled = (
            bosses.some(boss => boss.bossType === "health") ||
            (card.isBoss && cards.some(_card => _card.bossSource === card.bossSource && _card.bossType === "attack"))
        );
        const attackPromoteDisabled =(
            bosses.some(boss => boss.bossType === "attack") ||
            (card.isBoss && cards.some(_card => _card.bossSource === card.bossSource && _card.bossType === "health"))
        );

        html += `
            <div class="worldcard ${card.isBoss ? "boss" : ""} ${card.isBoss ? `boss--${card.bossType}` : ""}" data-card-id="${card.id}">
                <div class="worldcard-grid">
                    <textarea name="worldcard-name" minlength="1" maxlength="16" class="worldcard-property worldcard-name" rows="2">${card.name || "Új kártya"}</textarea>
                    <div class="worldcard-property-container worldcard-attack-container">
                        <svg class="worldcard-promote" data-disabled="${attackPromoteDisabled}" data-boss-type="attack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlns:v="https://vecta.io/nano"><g stroke="#000"><path d="M81.18 327.439L500 19.098l418.82 308.341z" paint-order="normal" /><path d="M81.18 391.46L500 83.119 918.82 391.46z" fill="#000" paint-order="normal" /><path d="M81.18 545.166L500 236.825l418.82 308.341z" paint-order="normal" /><path d="M81.18 619.942L500 311.601l418.82 308.341z" fill="#000" paint-order="normal" /><path d="M81.18 773.649L500 465.308l418.82 308.341z" paint-order="normal" /><path d="M81.18 835.962L500 527.621l418.82 308.341z" fill="#000" paint-order="normal" /></g><path d="M81.18 989.668L500 681.327l418.82 308.341z" stroke="#fff" paint-order="normal" /></svg>
                        <svg data-disabled="${card.attack >= maxAttack}" data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                        <div class="worldcard-property-icon-container">
                            <img src="./assets/images/attack.webp" alt="Sebzés" class="worldcard-property-icon">
                            <input type="number" name="attack" min="${minAttack}" max="${maxAttack}" class="worldcard-property min-max-control integer worldcard-attack" value="${card.attack}" ${card.isBoss ? "readonly" : ""}>
                        </div>
                        <svg data-disabled="${card.attack <= minAttack}" data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                    </div>
                    <div class="worldcard-type-picker">
                        <form>
                            <input type="radio" name="type" value="earth" ${card.type === "earth" ? "checked" : ""}>
                            <input type="radio" name="type" value="fire" ${card.type === "fire" ? "checked" : ""}>
                            <input type="radio" name="type" value="water" ${card.type === "water" ? "checked" : ""}>
                            <input type="radio" name="type" value="air" ${card.type === "air" ? "checked" : ""}>
                        </form>
                    </div>
                    <div class="worldcard-property-container worldcard-health-container">
                        <svg class="worldcard-promote" data-disabled="${healthPromoteDisabled}" data-boss-type="health" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlns:v="https://vecta.io/nano"><g stroke="#000"><path d="M81.18 327.439L500 19.098l418.82 308.341z" paint-order="normal" /><path d="M81.18 391.46L500 83.119 918.82 391.46z" fill="#000" paint-order="normal" /><path d="M81.18 545.166L500 236.825l418.82 308.341z" paint-order="normal" /><path d="M81.18 619.942L500 311.601l418.82 308.341z" fill="#000" paint-order="normal" /><path d="M81.18 773.649L500 465.308l418.82 308.341z" paint-order="normal" /><path d="M81.18 835.962L500 527.621l418.82 308.341z" fill="#000" paint-order="normal" /></g><path d="M81.18 989.668L500 681.327l418.82 308.341z" stroke="#fff" paint-order="normal" /></svg>
                        <svg data-disabled="${card.health >= maxHealth}" data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                        <div class="worldcard-property-icon-container">
                            <img src="./assets/images/health.webp" alt="Élet" class="worldcard-property-icon">
                            <input type="number" name="health" min="${minHealth}" max="${maxHealth}" class="worldcard-property min-max-control integer worldcard-health" value="${card.health}" ${card.isBoss ? "readonly" : ""}>
                        </div>
                        <svg data-disabled="${card.health <= minHealth}" data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                    </div>
                    <div class="worldcard-delete svgbutton">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
                    </div>
                </div>
            </div>
        `;
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

    for (const cardElement of document.querySelectorAll(".worldcard:not(.worldcard--add)")) {
        const id = parseInt(cardElement.dataset.cardId);
        const cardIndex = cards.findIndex(card => card.id === id);
        const card = cards[cardIndex];
        const bosses = cards.filter(_card => _card.bossSource === card.id);

        if (!card) {
            console.warn(`Card with id ${id} not found at renderCards`);
            continue;
        }

        cardElement.querySelector(".worldcard-name").addEventListener("change", function() {
            card.name = this.value.slice(0, 16);
        });

        cardElement.querySelector(".worldcard-health").addEventListener("change", function() {
            card.health = Math.max(minHealth, Math.min(maxHealth, parseInt(this.value)));

            for (const bossCard of bosses) {
                const {health} = getBossProperties(bossCard.bossType, card);
                bossCard.health = health;
            }
    
            renderCards(cards);
        });

        cardElement.querySelectorAll(".worldcard-type-picker input").forEach(input => {
            input.addEventListener("change", function() {
                if (input.checked) {
                    card.type = input.value;
                }

                for (const bossCard of bosses) {
                    bossCard.type = card.type;
                }

                renderCards(cards)
            })
        });

        cardElement.querySelector(".worldcard-attack").addEventListener("change", function() {
            card.attack = Math.max(minAttack, Math.min(maxAttack, parseInt(this.value)));
            
            for (const bossCard of bosses) {
                const {attack} = getBossProperties(bossCard.bossType, card);
                bossCard.attack = attack;
            }

            renderCards(cards);
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
                });
            });
        });

        cardElement.querySelector(".worldcard-delete").addEventListener("click", function() {
            bosses.forEach(card => {
                const index = cards.findIndex(_card => _card.id === card.id);
                cards.splice(index, 1);
            });
            
            cards.splice(cardIndex, 1);
            renderCards(cards);
        });

        cardElement.querySelectorAll("input.min-max-control").forEach(input => {
            input.addEventListener("change", function() {
                if (this.classList.contains("integer"))
                    this.value = Math.round(this.value);
    
                input.value = Math.max(input.min, Math.min(input.value, input.max));
            });
        });
    }


    container.querySelector(".worldcard--add").addEventListener("click", createCard);
}


function createCard({name = "", health = 1, attack = 2, type = "earth", isBoss = false, bossSource = null, bossType = null}) {
    const world = getWorldById(currentWorld);
    const id = world.cards.reduce((a, card) => Math.max(a, card?.id || 0), 1) + 1;
    world.cards.push({id, name, health, attack, type, isBoss, bossSource, bossType});
    renderCards(world.cards);
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

renderCards(getWorldById(currentWorld).cards);


function uploadWorld(worldJson) {
    return fetch('push_world.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(worldJson)
    })
    // Error logging
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