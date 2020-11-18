const express = require('express')
const path = require('path')
const hbs = require('hbs')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')
const { generateMessage,generateLocationMessage } = require('./utils/message')
const { addUser, getUser, removeUser, getUserInRoom} = require('./utils/users')

const port = process.env.PORT || 4000
const publicDirectory = path.join(__dirname, '../public')
app.use(express.static(publicDirectory))


io.on('connection', (socket)=>{
    console.log('New WebSocket Connection')
    
    socket.on('join', (option, callback)=>{
        const {error, user} = addUser({id:socket.id, ...option})

        if (error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('messageUpdate', generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('messageUpdate', generateMessage('Admin',`${user.username} has joined !`))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback)=> {
        const user = getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed !')
        }

        io.to(user.room).emit('messageUpdate', generateMessage(user.username, message))
        callback('')
    })

    socket.on('disconnect', ()=> {
        const userDataRemove = removeUser(socket.id)
        if (userDataRemove){
            io.to(userDataRemove[0].room).emit('messageUpdate', generateMessage('Admin', `${userDataRemove[0].username} left the chat !`))
            io.to(userDataRemove[0].room).emit('roomData', {
                room : userDataRemove[0].room,
                users : getUserInRoom(userDataRemove[0].room)
            })
        }
    })

    socket.on('sendLocation', (location, callback)=>{
        const userData = getUser(socket.id)
        
        if (userData){
            io.to(userData.room).emit('locationShared', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
            callback('')
        }
    })
})


server.listen(port, ()=>{
    console.log(`Succesfull Running Server On Port ${port}`)
})