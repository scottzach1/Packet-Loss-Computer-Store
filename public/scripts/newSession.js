const TOKEN_TIMEOUT_MINS = 25;
let token = window.localStorage.getItem("token");
let isAdmin = window.localStorage.getItem("admin") === "true";
let displayName = window.localStorage.getItem("displayName");

console.log(isAdmin);

let errorCard = document.getElementById("error-card");
let successCard = document.getElementById("success-card");
let loadingCard = document.getElementById("loading-card");

function renewToken() {
    let tokenRenewUrl = window.location.origin + "/api/v1/auth/renew"

    if (token) {
        fetch(tokenRenewUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: token,
            })
        })
            .then(res => res.json())
            .then(res => {
                window.localStorage.setItem("token", res.token);
                token = window.localStorage.getItem("token");
            })
    }

    setTimeout(renewToken, 1000 * 60 * TOKEN_TIMEOUT_MINS);
}

function resetCards() {
    if (!errorCard || !successCard || !loadingCard){
        errorCard = document.getElementById("error-card");
        successCard = document.getElementById("success-card");
        loadingCard = document.getElementById("loading-card");
    }


    successCard.style.display = "none";
    successCard.innerHTML = "";
    errorCard.style.display = "none";
    errorCard.innerHTML = "";
    loadingCard.style.display = "flex";
}
