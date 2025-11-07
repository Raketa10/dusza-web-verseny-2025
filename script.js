let worlds = [
    {id: 1, name: "Első világ", cards: [{id: 1, name: "First Card", health: 1, attack: 2, type: "earth"}], casemates: []}
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

function generateCards(cards) {
    let html = "";
    for (const card of cards) {
        html += `
            <div class="worldcard" data-card-id="${card.id}">
                <textarea name="worldcard-name" minlength="1" maxlength="16" class="worldcard-property worldcard-name" rows="2">${card.name || "Új kártya"}</textarea>
                <div class="worldcard-property-container worldcard-attack-container">
                    <svg data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                    <input type="number" name="attack" min="${minAttack}" max="${maxAttack}" class="worldcard-property min-max-control integer worldcard-attack" value="${card.attack}">
                    <svg data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                </div>
                <div class="worldcard-property-container worldcard-health-container">
                    <svg data-increment="1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 263" xmlns:v="https://vecta.io/nano"><path d="M223-864L67-708q-11 11-28 11-17 0-28-11-11-11-11-28 0-17 11-28l184-184q12-12 28-12 16 0 28 12l184 184q11 11 11 28 0 17-11 28-11 11-28 11-17 0-28-11z" /></svg>
                    <input type="number" name="health" min="${minHealth}" max="${maxHealth}" class="worldcard-property min-max-control integer worldcard-health" value="${card.health}">
                    <svg data-increment="-1" class="worldcard-property-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 446 262" xmlns:v="https://vecta.io/nano"><path d="M223-698q-8 0-15-2.5-7-2.5-13-8.5L11-893Q0-904 0-921q0-17 11-28 11-11 28-11 17 0 28 11l156 156 156-156q11-11 28-11 17 0 28 11 11 11 11 28 0 17-11 28L251-709q-6 6-13 8.5-7 2.5-15 2.5z" /></svg>
                </div>
                <div class="worldcard-delete svgbutton">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
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

    for (const cardElement of document.querySelectorAll(".worldcard:not(.worldcard--add)")) {
        const id = parseInt(cardElement.dataset.cardId);
        const cardIndex = cards.findIndex(card => card.id === id);
        const card = cards[cardIndex];
        if (!card) {
            console.warn(`Card with id ${id} not found at generateCards`);
            continue;
        }

        cardElement.querySelector(".worldcard-name").addEventListener("change", function() {
            card.name = this.value.slice(0, 16);
        });
        cardElement.querySelector(".worldcard-health").addEventListener("change", function() {
            card.health = Math.max(minHealth, Math.min(maxHealth, parseInt(this.value)));
        });
        cardElement.querySelector(".worldcard-health").addEventListener("change", function() {
            card.attack = Math.max(minAttack, Math.min(maxAttack, parseInt(this.value)));
        });
        cardElement.querySelectorAll(".worldcard-property-container").forEach(container => {
            const input = container.querySelector("input");
            
            container.querySelectorAll(".worldcard-property-arrow").forEach(button => {
                button.addEventListener("click", function() {
                    const increment = parseInt(button.dataset.increment);
                    const value = Math.max(input.min, Math.min(parseInt(input.value) + increment, input.max));
                    input.value = value;
                    card[input.name] = value;
                });
            });
        });
        cardElement.querySelector(".worldcard-delete").addEventListener("click", function() {
            console.log(cardIndex, id, card.id);
            cards.splice(cardIndex, 1);
            generateCards(cards);
        });
    }

    container.querySelector(".worldcard--add").addEventListener("click", createCard);
}


function createCard() {
    const world = getWorldById(currentWorld);
    const id = world.cards.reduce((a, card) => Math.max(a, card?.id || 0), 1) + 1;
    world.cards.push({id, name: "", health: 1, attack: 2, type: "earth"});
    generateCards(world.cards);
}



document.querySelectorAll("input.min-max-control").forEach(input => {
    input.addEventListener("change", function() {
        if (this.classList.contains("integer"))
            this.value = Math.round(this.value);

        input.value = Math.max(input.min, Math.min(input.value, input.max));
    });
});

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

generateCards(getWorldById(currentWorld).cards);