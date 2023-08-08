let userLogin = ''
let socket = io()
let loginBtn = document.querySelector('.auth')
const regBtn = document.querySelector('.reg')
let form = ''
let input = ''
let send = ''
const message = `<ul id="messages"></ul>
            <div id="form" action="">
                <input id="input" autocomplete="off" /><button class="send"><div></div><span>Send<span></button>
            </div>`

loginBtn.onclick = async () => {
    await auth()
}

regBtn.onclick = async () => {
    await newUser()
}

function load(onOff, selectDIV, selectText, text) {
    const loading = document.querySelector(selectDIV)
    const textBtn = document.querySelector(selectText)
    if (!onOff) {
        textBtn.innerText = text
        loading.classList.remove('loading')
        return
    }
    textBtn.innerText = ''
    loading.classList.add('loading')
    return
}

async function newUser() {
    load(true, '.reg > div', '.reg > span', 'Register')
    const username = document.querySelector('input[name="usernameNew"]')
    const password = document.querySelector('input[name="passwordNew"]')
    const response = await fetch('http://localhost:3000/new-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        }),
    })
    if (response.status != 200) {
        load(false, '.reg > div', '.reg > span', 'Register')
        alert('Error: ' + response.status + '\nAlgo deu errado')
        return
    }
    username.value = ''
    password.value = ''
    alert('Conta criada')
    load(false, '.reg > div', '.reg > span', 'Register')
}

async function auth() {
    load(true, '.auth > div', '.auth > span', 'Login')
    const username = document.querySelector('input[name="username"]')
    const password = document.querySelector('input[name="password"]')
    const response = await fetch(`http://localhost:3000/user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        }),
    })
    if (response.status != 200) {
        load(false, '.auth > div', '.auth > span', 'Login')
        alert('Error: ' + response.status + '\nUsername ou password incorrect')
        return
    }
    load(false, '.auth > div', '.auth > span', 'Login')
    userLogin = username.value
    const body = document.querySelector('body')
    body.innerHTML = message
    form = document.getElementById('form')
    input = document.getElementById('input')
    send = document.querySelector('.send')
    send.onclick = () => {
        sendMessage()
    }
}

function sendMessage() {
    load(true, '.send div', '.send span', 'Send')
    if (input.value) {
        socket.emit('chat message', input.value, userLogin)
        input.value = ''
        load(false, '.send div', '.send span', 'Send')
    }
}

socket.on('error', function () {
    alert('algo deu errado com o seu login')
    window.location.reload()
})

socket.on('chat message', function (msg) {
    let item = document.createElement('li')
    item.textContent = msg
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
})
