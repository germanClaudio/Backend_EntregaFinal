function updateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const timeString = `Date: ${date} - Time: ${time}`;
    document.getElementById("clock").textContent = timeString;
}
setInterval(updateTime, 1000);
