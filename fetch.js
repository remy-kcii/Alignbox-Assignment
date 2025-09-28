let messages = [];
let messageIdCounter = 1;
let isAnonymous = false;

const loadingEl = document.getElementById("loading");
const chatContainer = document.getElementById("chatContainer");

function showLoading() {
    loadingEl.style.display = "block";
}

function hideLoading() {
    loadingEl.style.display = "none";
}

async function fetchMessages() {
    showLoading();
    try {
        const res = await fetch("http://localhost:5000/api/messages");
        messages = await res.json();
        messageIdCounter = messages.length + 1;
        renderMessages();
    } catch (err) {
        console.error("Error fetching messages:", err);
        chatContainer.innerHTML = '<p style="text-align:center; color:#666; margin-top:20px;">Failed to load messages</p>';
    } finally {
        hideLoading();
    }
}

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

async function addMessage(content) {
    if (!content.trim()) return;

    const newMessage = {
        id: messageIdCounter++,
        user: isAnonymous ? 'Anonymous' : 'Me', 
        content,
        timestamp: formatTime(),
        sent: 1,
        anonymous: isAnonymous ? 1 : 0,
       
     
    };

   
    messages.push(newMessage);
    renderMessages();

 
    try {
        await fetch("http://localhost:5000/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: 1,
                content,
                sent: 1,
                anonymous: isAnonymous ? 1 : 0,
                timestamp: newMessage.timestamp,
                
            })
        });
    } catch (err) {
        console.error("Error saving message:", err);
    }
}

function renderMessages() {
    chatContainer.innerHTML = '';

    if (!messages || messages.length === 0) {
        chatContainer.innerHTML = '<p style="text-align:center; color:#666; margin-top:20px;">No messages yet</p>';
        return;
    }

    messages.forEach(message => {
        const isSent = message.sent === 1; 
        const isAnonymousMessage = message.anonymous === 1;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSent ? 'sent' : 'received'} tri-right left-top`;

        const avatarHTML = !isSent ? `
            <div class="user-avatar${message.avatar === 'abhay' ? ' abhay' : ''}${message.online ? ' online' : ''}"></div>
        ` : '';

        
        const usernameHTML = (!isSent) ? `<h5 class="username">${message.user != null ? message.user : (isAnonymousMessage ? 'Anonymous' : 'Unknown')}</h5>` : '';

        const checkMark = isSent ? ' <i class="fas fa-check-double"></i>' : '';

        const messageHTML = `
            <div class="message-flex">
                ${avatarHTML}
                <div class="message-bubble">
                    ${usernameHTML}
                    ${message.content}
                    <span class="timestamp">${message.timestamp} ${checkMark}</span>
                </div>
            </div>
        `;

        messageDiv.innerHTML = messageHTML;
        chatContainer.appendChild(messageDiv);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.getElementById('sendBtn').addEventListener('click', () => {
    const input = document.getElementById('messageInput');
    addMessage(input.value);
    input.value = '';
});

document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addMessage(e.target.value);
        e.target.value = '';
    }
});


 function toggle () {
    isAnonymous = !isAnonymous;

    const incognitoBtn = document.querySelector('.incognito-btn');
    const anonymousNotice = document.getElementById('anonymousNotice');

    if (isAnonymous) {
        

        incognitoBtn.classList.add('on');  
        anonymousNotice.style.display = 'block'; 
    } else {
       

        incognitoBtn.classList.remove('on');   
        anonymousNotice.style.display = 'none'; 
    }
};


fetchMessages();
