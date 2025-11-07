let worlds = [];

const screenContainer = document.querySelector(".screen-container");


function setScreen(screen) {
    screenContainer.dataset.screen = screen;
}

function createWorld() {
    setScreen("world");
}



document.querySelectorAll("input.min-max-control").forEach(input => {
    input.addEventListener("change", function() {
        if ([...this.classList].includes("integer"))
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