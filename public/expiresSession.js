const countdownElement = document.getElementById('countdown')
const expires = (document.getElementById('expires').innerText)
    
    function updateCountdown() {
        const countdownDate = new Date(`${expires}`).getTime()
        const now = new Date().getTime()
        const distance = countdownDate - now
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        if (distance > 0) {
            countdownElement.innerHTML = `Session Time: ${hours}h ${minutes}m ${seconds}s`
        } else {
            countdownElement.innerHTML = `Session Time Expires`
        }
    }

updateCountdown()

setInterval(updateCountdown, 1000)