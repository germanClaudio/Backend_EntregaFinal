const passwordInput = document.getElementById('password')
const showPasswordBtn = document.getElementById('show-password-btn')

showPasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
    passwordInput.setAttribute('type', type)
    showPasswordBtn.textContent = type === 'password' ? 'Show' : 'Hide'
})

document.getElementById('username').value = ""
document.getElementById('password').value = ""