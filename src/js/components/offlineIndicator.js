export function initializeOfflineIndicator() {
    const offlineIndicator = document.getElementById("offline-indicator");

    function updateOnlineStatus() {
        if (!navigator.onLine) {
            offlineIndicator.classList.remove("hidden");
        } else {
            offlineIndicator.classList.add("hidden");
        }
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    updateOnlineStatus();
}
