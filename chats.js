document.addEventListener('DOMContentLoaded', function() {
    // Дані друзів та їх аватари
    const friendsData = [
        { id: 'will', name: "Вілл Смітт", avatar: "images/avatar1.png" },
        { id: 'dwayne', name: "Дуейн Джонсон", avatar: "images/avatar2.png" },
        { id: 'ryan', name: "Раян Рейнольдс", avatar: "images/avatar3.png" },
        { id: 'mark', name: "Марк Уолберг", avatar: "images/avatar4.png" },
        { id: 'ben', name: "Бен Аффлек", avatar: "images/avatar5.png" },
        { id: 'vin', name: "Він Дізель", avatar: "images/avatar6.png" },
        { id: 'akshay', name: "Акшай Кумар", avatar: "images/avatar7.png" },
        { id: 'lin', name: "Лін-Мануель Міранда", avatar: "images/avatar8.png" }
    ];

    // Припустимо, що це аватар поточного користувача
    const currentUser = {
        name: "Я",
        avatar: "images/current_user_avatar.png"
    };

    const dynamicChatList = document.getElementById('dynamic-chat-list');
    const chatWindow = document.getElementById('single-chat-window');
    const chatName = document.getElementById('chat-name');
    const chatAvatar = document.getElementById('chat-avatar');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-button');
    const textarea = document.getElementById('chat-textarea');
    const closeChatButton = document.querySelector('.close-chat-button');
    const chatListContainer = document.querySelector('.chat-list-container');

    function populateChatList() {
        dynamicChatList.innerHTML = '';
        friendsData.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.classList.add('chat-item');
            listItem.innerHTML = `
                <a href="#" data-friend-id="${friend.id}" data-name="${friend.name}" data-avatar="${friend.avatar}">
                    <img src="${friend.avatar}" alt="${friend.name}">
                    <span>${friend.name}</span>
                </a>
            `;
            dynamicChatList.appendChild(listItem);
        });
    }

    populateChatList();

    dynamicChatList.addEventListener('click', (e) => {
        const chatLink = e.target.closest('.chat-item a');
        if (chatLink) {
            e.preventDefault();
            const friendName = chatLink.dataset.name;
            const friendAvatar = chatLink.dataset.avatar;
            const friendId = chatLink.dataset.friendId;

            chatWindow.style.display = 'flex';
            chatName.textContent = friendName;
            chatAvatar.src = friendAvatar;
            chatAvatar.alt = friendName;

            chatMessages.innerHTML = '';
            
            if (friendName === "Дуейн Джонсон") {
                addMessage(friendName, friendAvatar, "Привіт! Як справи? Готовий до тренування?", 'friend-message');
                addMessage(currentUser.name, currentUser.avatar, "Привіт, Дуейн! Все чудово, вже розминаюсь. А ти?", 'my-message');
            } else if (friendName === "Раян Рейнольдс") {
                addMessage(friendName, friendAvatar, "Привіт! Що там по новому фільму?", 'friend-message');
                addMessage(currentUser.name, currentUser.avatar, "Ще в процесі написання сценарію. Буду тримати в курсі!", 'my-message');
            } else {
                addMessage("Система", "", `Це початок вашого чату з ${friendName}.`, 'system-message');
            }

            textarea.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            if (window.innerWidth <= 768) {
                chatListContainer.classList.add('hidden-on-mobile');
                chatWindow.classList.add('active-on-mobile');
                closeChatButton.style.display = 'block';
            }
        }
    });

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = textarea.value.trim();
        if (text !== '') {
            addMessage(currentUser.name, currentUser.avatar, text, 'my-message');
            textarea.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(() => {
                const friendName = chatName.textContent;
                const friendAvatar = chatAvatar.src;
                addMessage(friendName, friendAvatar, "Дякую за повідомлення! Пізніше відповім.", 'friend-message');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1500);
        }
    }

    function addMessage(senderName, senderAvatar, messageText, messageClass) {
        const msg = document.createElement('p');
        msg.classList.add(messageClass);
        if (messageClass === 'system-message') {
            msg.innerHTML = `<strong>${senderName}:</strong> ${messageText}`;
        } else {
            msg.innerHTML = `<strong>${senderName}:</strong> ${messageText}`;
        }
        chatMessages.appendChild(msg);
    }

    closeChatButton.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatName.textContent = 'Виберіть чат';
        chatAvatar.src = '';
        chatMessages.innerHTML = '<p class="system-message"><strong>Система:</strong> Привіт! Почни чат 😊</p>';

        if (window.innerWidth <= 768) {
            chatListContainer.classList.remove('hidden-on-mobile');
            chatWindow.classList.remove('active-on-mobile');
            closeChatButton.style.display = 'none';
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            chatListContainer.classList.remove('hidden-on-mobile');
            chatWindow.classList.remove('active-on-mobile');
            if (chatName.textContent !== 'Виберіть чат') {
                chatWindow.style.display = 'flex';
            } else {
                chatWindow.style.display = 'none';
            }
            closeChatButton.style.display = 'none';
        } else {
            if (chatWindow.classList.contains('active-on-mobile')) {
                chatListContainer.classList.add('hidden-on-mobile');
                closeChatButton.style.display = 'block';
            } else {
                chatListContainer.classList.remove('hidden-on-mobile');
                closeChatButton.style.display = 'none';
            }
        }
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const friendIdFromUrl = urlParams.get('id');
    if (friendIdFromUrl) {
        const targetFriend = friendsData.find(f => f.id === friendIdFromUrl);
        if (targetFriend) {
            const chatLink = dynamicChatList.querySelector(`a[data-friend-id="${targetFriend.id}"]`);
            if (chatLink) {
                chatLink.click();
            }
        }
    }
});