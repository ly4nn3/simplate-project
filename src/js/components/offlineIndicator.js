export function initializeOfflineIndicator() {
    const offlineIndicator = document.getElementById("offline-indicator");

    const updateOnlineStatus = () => {
        offlineIndicator.classList.toggle("hidden", navigator.onLine);
    };

    const eventOptions = { passive: true };

    window.addEventListener("online", updateOnlineStatus, eventOptions);
    window.addEventListener("offline", updateOnlineStatus, eventOptions);

    updateOnlineStatus();

    return () => {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
    };
}
