const IDLE_TIMEOUT_MINS = 5;

const timeout = idleTimeout(
    () => {
        if (localStorage.getItem("token"))
            window.location.href = window.location.origin + "/auth/inactive"
    },
    {
        element: window,
        timeout: 1000 * 60 * IDLE_TIMEOUT_MINS,
        loop: false
    }
);
