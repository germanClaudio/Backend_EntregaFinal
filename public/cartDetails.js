const countdownElement = document.getElementById('countdown')
    const expires = (document.getElementById('expires').innerText)
    
    function updateCountdown() {
        const countdownDate = new Date(`${expires}`).getTime()
        const now = new Date().getTime()
        const distance = countdownDate - now
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`
    }

    updateCountdown()
    setInterval(updateCountdown, 1000)