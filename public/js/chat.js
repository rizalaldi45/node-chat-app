const socket = io()
// message sellector Element
const getForm = document.querySelector('#message-form')
const getBtnsend = document.querySelector('button')
// send location sellector Element
const getSharedLocationBtn = document.querySelector('#send_location')
//Template Mustache
const messageTemplate = document.querySelector('#message-template').innerHTML
const messages = document.querySelector('#messages')
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Template Location
const getLocation = document.querySelector('#location-template').innerHTML
//Qs (Query String)
const {username, room, link} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const autoScroll = ()=>{
    const newMessage = messages.lastElementChild
    
    const newMessageStyle = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight
    const containerHeight = messages.scrollHeight
    const scrollOffset = messages.scrollTop + containerHeight

    if (messages.scrollTop - newMessageHeight <=scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }
    
    // console.log(newMessageMargin)
}


socket.on('messageUpdate', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message : message.text,
        link : message.link,
        CreateAt : moment(message.CreateAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationShared', url=>{

    const htmlLoc = Mustache.render(getLocation, {
        username: url.username,
        url : url.text,
        CreateAt : moment(url.CreateAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', htmlLoc)
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    getBtnsend.setAttribute('disabled', 'disabled')

    const input = e.target.elements.message.value
    socket.emit('sendMessage', input, (err)=>{
        getForm.reset()
        getBtnsend.removeAttribute('disabled')

        if (err){
            return console.log(err)
        }
        
        console.log('Message was deliverd !')
    })
})

document.querySelector('#send_location').addEventListener('click', ()=>{
    if (!navigator.geolocation){
        return alert('Geolocation Not Support Your Browser !')
    }

    getSharedLocationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },(err)=>{
            if (err){
                return console.log(err)
            }

            console.log('Location Shared !')
            getSharedLocationBtn.removeAttribute('disabled')
        })
    })

})

socket.emit('join', {username, room, link}, (error)=>{
    if (error){
        alert(error)
        location.href='/'
    }
})
