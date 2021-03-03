const generateMessage = (username,text,link)=>{
    return {
        username,
        text,
        link,
        CreateAt : new Date().getTime()
    }
}

const generateLocationMessage = (username, text) => {
    return {
        username,
        text,
        CreateAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}