let addBtn = document.querySelector("#addBtn");
let currAmount = document.querySelector("#currAmount");
let total = document.querySelector("#total");
let catagory = document.querySelector("#catagory");

let editingCard = null;
let oldAmount = 0;

addBtn.addEventListener("click", () => {

    let currVal = Number(currAmount.value);
    let totalVal = Number(total.value);

    // If editing existing expense
    if (editingCard) {

        total.value = totalVal - oldAmount + currVal;

        editingCard.querySelector(".expense").textContent =
            `${catagory.value}: ${currVal}`;

        editingCard = null;

    } 
    else {

        total.value = totalVal + currVal;

        let card = document.createElement("div");

        card.innerHTML = `
            <span class="expense">${catagory.value}: ${currVal}</span>
            <button class="updateBtn">Update</button>
        `;

        document.body.appendChild(card);

        let updateBtn = card.querySelector(".updateBtn");

        updateBtn.addEventListener("click", () => {

            let text = card.querySelector(".expense").textContent;
            let amount = Number(text.split(":")[1]);

            currAmount.value = amount;

            editingCard = card;
            oldAmount = amount;

        });
    }

    currAmount.value = "";
});