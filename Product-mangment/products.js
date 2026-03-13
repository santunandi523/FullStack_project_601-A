// 🔐 Login protection
if(!localStorage.getItem("token")){
    window.location.href = "index.html";
}

// Products data
let products = [
    {
        name: "Laptop",
        price: 50000,
        image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
    },
    {
        name: "Smart Phone",
        price: 20000,
        image: "https://cdn-icons-png.flaticon.com/512/15/15874.png"
    },
    {
        name: "Headphones",
        price: 2000,
        image: "https://cdn-icons-png.flaticon.com/512/869/869636.png"
    },
    {
        name: "Smart Watch",
        price: 3000,
        image: "https://cdn-icons-png.flaticon.com/512/992/992700.png"
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount(){
    document.getElementById("cartCount").innerText = cart.length;
}

updateCartCount();

let container = document.getElementById("productList");

products.forEach((p, index) => {

    container.innerHTML += `
        <div class="card">
            <img src="${p.image}" />
            <div class="title">${p.name}</div>
            <div class="price">₹${p.price}</div>

            <div class="btn-group">
                <button class="cart-btn" onclick="addToCart(${index})">
                    Add to Cart
                </button>

                <button class="buy-btn" onclick="buyNow(${index})">
                    Buy Now
                </button>
            </div>
        </div>
    `;
});

function addToCart(index){
    cart.push(products[index]);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to Cart ✅");
}

function buyNow(index){
    alert("Order placed for " + products[index].name + " 🎉");
}

function logout(){
    localStorage.removeItem("token");
    window.location.href = "index.html";
}