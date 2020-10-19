const IDLE_TIMEOUT_MINS = 5;

/**
 * Utilize the idle-timeout library, ensuring that if the user is gone for 5 mins then they will be logged out.
 */
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
