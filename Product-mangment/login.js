function showRegister(){
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
}

function showLogin(){
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
}

function register(){
    let user = regUser.value;
    let pass = regPass.value;

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);
    alert("Registered Successfully!");
    showLogin();
}

function login(){
    let user = loginUser.value;
    let pass = loginPass.value;

    if(user === localStorage.getItem("user") &&
       pass === localStorage.getItem("pass")){

        localStorage.setItem("token", "fake-jwt-token");

        window.location.href = "products.html";

    } else {
        alert("Invalid Credentials");
    }
}

function logout(){
    localStorage.removeItem("token");
    protectedPage.classList.add("hidden");
    loginBox.classList.remove("hidden");
}