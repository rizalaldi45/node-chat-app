const users = []

const addUser = ({id, username, room})=>{
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if (!username || !room){
        return {
            error : 'Username and Room is required !'
        }
    }

    // check existing user
    const existing = users.find((user)=>{
        return user.room === room && user.username === username
    })

    // Validate Username
    if (existing){
        return {
            error : 'Username Is In Use !'
        }
    }

    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id)=>{
    const index = users.findIndex((users)=> users.id === id)
    if (index !== -1){
        return users.splice(index, 1)
    }
}

const getUser = (id)=>{
    return users.find((users)=> users.id === id)

}


const getUserInRoom = (room)=>{
    return users.filter((users)=> users.room === room)
}


module.exports = {
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}

// addUser({
//     id : 22,
//     username : 'Lola',
//     room : 'jepara'
// })



// const dwin = getUser(22)
// console.log(dwin)
