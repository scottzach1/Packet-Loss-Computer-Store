const TOKEN_TIMEOUT_MINS = 25;
let token = window.localStorage.getItem("token");
let isAdmin = window.localStorage.getItem("admin") === "true";
let displayName = window.localStorage.getItem("displayName");

setTimeout(renewToken, 1000 * 60 * TOKEN_TIMEOUT_MINS);

function renewToken() {
    let tokenRenewUrl = window.location.origin + "/api/v1/auth/renew"

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

    setTimeout(renewToken, 1000 * 60 * TOKEN_TIMEOUT_MINS);
}
