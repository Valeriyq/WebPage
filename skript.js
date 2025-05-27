document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Завантаження імені користувача з localStorage ---
    // Ця функція буде отримувати ім'я з localStorage.
    // Якщо його немає, вона поверне "Guest User" або інше дефолтне ім'я.
    // Важливо: переконайтеся, що на сторінці profile.html є JS, який ЗБЕРІГАЄ це ім'я в localStorage.
    // Якщо ви хочете, щоб редагування профілю також було в цьому файлі, ми можемо це додати.
    const getCurrentUserName = () => {
        return localStorage.getItem('profileName') || 'Sigma Boy'; // Дефолтне ім'я, якщо немає в localStorage
    };

    const getCurrentUserAvatar = () => {
        // За замовчуванням завжди images/image.png, якщо немає іншого механізму завантаження аватара
        return localStorage.getItem('profileAvatar') || 'images/image.png';
    };


    // Дані друзів та їх аватари для модального вікна та загального використання
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

    // Тепер currentUser.name і currentUser.avatar будуть динамічно завантажуватися
    const currentUser = {
        name: getCurrentUserName(),
        avatar: getCurrentUserAvatar()
    };


    // --- Функціональність лайків ---
    const postsContainer = document.getElementById('posts-container');

    postsContainer.addEventListener('click', function(event) {
        const likeButton = event.target.closest('.like-btn');
        if (likeButton) {
            const likeCountSpan = likeButton.querySelector('.like-count');
            let currentLikes = parseInt(likeCountSpan.textContent);

            if (likeButton.classList.contains('liked')) {
                currentLikes--;
                likeButton.classList.remove('liked');
                likeButton.querySelector('.material-icons').textContent = 'favorite_border'; // Порожнє серце
            } else {
                currentLikes++;
                likeButton.classList.add('liked');
                likeButton.querySelector('.material-icons').textContent = 'favorite'; // Заповнене серце
            }
            likeCountSpan.textContent = currentLikes;
            likeButton.setAttribute('data-likes', currentLikes);
            // Тут можна відправити запит на сервер для оновлення лайків
        }
    });

    // --- Функціональність коментарів ---
    postsContainer.addEventListener('click', function(event) {
        const commentButton = event.target.closest('.comment-btn');
        if (commentButton) {
            const post = commentButton.closest('.post');
            const commentsSection = post.querySelector('.comments-section');
            if (commentsSection) {
                commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
            }
        }
    });

    postsContainer.addEventListener('submit', function(event) {
        if (event.target.classList.contains('comment-form')) {
            event.preventDefault(); // Запобігаємо стандартній відправці форми
            const form = event.target;
            const commentInput = form.querySelector('.comment-input');
            const commentText = commentInput.value.trim();

            if (commentText) {
                const commentsSection = form.closest('.comments-section');
                const commentList = commentsSection.querySelector('.comment-list'); // Отримуємо список коментарів
                const newCommentDiv = document.createElement('div');
                newCommentDiv.classList.add('comment');
                newCommentDiv.innerHTML = `
                    <img src="${currentUser.avatar}" alt="${currentUser.name}" class="comment-avatar">
                    <span class="comment-author">${currentUser.name}:</span> ${commentText}
                `;

                // Додаємо новий коментар
                // Важливо: перевіряємо, чи є вже comment-list, якщо ні, створюємо його
                if (!commentList) {
                    const tempCommentList = document.createElement('div');
                    tempCommentList.classList.add('comment-list');
                    commentsSection.prepend(tempCommentList); // Додаємо перед формою
                    tempCommentList.appendChild(newCommentDiv);
                } else {
                    commentList.appendChild(newCommentDiv);
                }

                commentInput.value = ''; // Очищаємо поле вводу
                // Тут можна відправити коментар на сервер
            }
        }
    });

    // --- Функціональність створення нового посту ---
    const publishPostBtn = document.getElementById('publish-post-btn');
    const postTextarea = document.getElementById('post-text');
    const postImageInput = document.getElementById('post-image');

    publishPostBtn.addEventListener('click', function() {
        const postText = postTextarea.value.trim();
        const postImageFile = postImageInput.files[0];

        if (postText || postImageFile) {
            const newPostId = Date.now(); // Унікальний ID для нового посту
            const newPostDiv = document.createElement('div');
            newPostDiv.classList.add('post');
            newPostDiv.setAttribute('data-post-id', newPostId);

            let imageHtml = '';
            if (postImageFile) {
                const imageUrl = URL.createObjectURL(postImageFile);
                imageHtml = `<img src="${imageUrl}" alt="Ваш пост" class="post-image">`;
            }

            newPostDiv.innerHTML = `
                <div class="post-header">
                    <img src="${currentUser.avatar}" alt="${currentUser.name}" class="post-avatar">
                    <div class="post-info">
                        <span class="post-author">${currentUser.name}</span>
                        <span class="post-date">Щойно</span>
                    </div>
                </div>
                ${imageHtml}
                <p class="post-description">${postText}</p>
                <div class="post-actions">
                    <button class="like-btn" data-likes="0">
                        <span class="material-icons">favorite_border</span> Лайк (<span class="like-count">0</span>)
                    </button>
                    <button class="comment-btn">
                        <span class="material-icons">comment</span> Коментувати
                    </button>
                    <button class="send-btn" data-post-id="${newPostId}" aria-label="Поширити допис">
                        <span class="material-icons">send</span>
                    </button>
                </div>
                <div class="comments-section" style="display: none;">
                    <div class="comment-list"></div> <form class="comment-form">
                        <input type="text" placeholder="Напишіть коментар..." class="comment-input">
                        <button type="submit" class="comment-submit-btn">Опублікувати</button>
                    </form>
                </div>
            `;
            postsContainer.prepend(newPostDiv); // Додаємо новий пост на початок стрічки

            postTextarea.value = ''; // Очищаємо поле тексту
            postImageInput.value = ''; // Очищаємо вибраний файл
            // Тут можна відправити дані посту на сервер
        } else {
            alert('Будь ласка, введіть текст або завантажте зображення для посту.');
        }
    });

    // --- Функціональність модального вікна "Відправити пост" ---
    // Отримуємо елементи модального вікна та кнопки закриття  
    const sendModal = document.getElementById('send-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const friendListContainer = document.getElementById('friend-list');
    let currentPostId = null; // Для зберігання ID посту, який надсилаємо

    // ФУНКЦІЯ openSendModal - винесіть її за межі DOMContentLoaded, якщо використовуєте в інших місцях, або переконайтеся, що вона визначена тут до використання.
    function openSendModal(postId) {
        currentPostId = postId;
        friendListContainer.innerHTML = ''; // Очищаємо список перед додаванням

        friendsData.forEach(friend => {
            const listItem = document.createElement('li');
            // Використовуємо input type="checkbox" безпосередньо всередині label
            listItem.innerHTML = `
                <input type="checkbox" id="friend-${friend.id}" value="${friend.id}" data-friend-id="${friend.id}">
                <label for="friend-${friend.id}">
                    <img src="${friend.avatar}" alt="${friend.name}" class="friend-avatar"> ${friend.name}
                </label>
            `;
            friendListContainer.appendChild(listItem);

            // Додаємо слухач для зміни стану чекбоксу, щоб оновлювати видимість кнопки
            const checkbox = listItem.querySelector(`#friend-${friend.id}`);
            checkbox.addEventListener('change', updateSendButtonVisibility);
            // Додаємо слухач для кліку на ListItem, щоб перемикати чекбокс
            listItem.addEventListener('click', function(event) {
                // Якщо клікнули не безпосередньо на чекбокс, то перемикаємо його
                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    updateSendButtonVisibility();
                }
            });
        });
        sendModal.classList.add('active');
        updateSendButtonVisibility(); // Оновлюємо стан кнопки при відкритті
    }


    // Оновлення видимості кнопки "Відправити" в модальному вікні
    function updateSendButtonVisibility() {
        const sendToFriendButton = document.getElementById('send-confirm-button');
        const checkedCount = friendListContainer.querySelectorAll('input[type="checkbox"]:checked').length;
        sendToFriendButton.style.display = checkedCount > 0 ? 'block' : 'none';
    }

    // Кнопка підтвердження відправки в модальному вікні
    const sendToFriendButton = document.getElementById('send-confirm-button');
    sendToFriendButton.addEventListener('click', function() {
        const checkedFriends = Array.from(friendListContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        if (checkedFriends.length > 0) {
            console.log(`Відправити пост ${currentPostId} друзям: ${checkedFriends.join(', ')}`);
            alert(`Пост #${currentPostId} успішно відправлено друзям: ${checkedFriends.map(id => friendsData.find(f => f.id === id).name).join(', ')}!`);
            closeModal(sendModal);
        } else {
            alert('Будь ласка, виберіть хоча б одного друга.');
        }
    });

    // --- Додаємо ДЕЛЕГУВАННЯ ПОДІЙ для кнопок "Відправити" (.send-btn) ---
    // Цей обробник буде слухати кліки на postsContainer
    // і спрацьовуватиме для кнопок .send-btn, навіть якщо вони додані динамічно.
    if (postsContainer) {
        postsContainer.addEventListener('click', function(event) {
            const clickedSendButton = event.target.closest('.send-btn');

            if (clickedSendButton) {
                const postId = clickedSendButton.dataset.postId;
                if (postId) {
                    openSendModal(postId); // Викликаємо вашу функцію відкриття модального вікна
                } else {
                    console.error("Кнопка 'Відправити' не має data-post-id. Перевірте HTML динамічно створеного посту.");
                }
            }
        });
    }
    // --- КІНЕЦЬ БЛОКУ ДЕЛЕГУВАННЯ ПОДІЙ ---


    // --- Функціональність модального вікна "Сповіщення" ---
    const notificationsLink = document.getElementById('notifications-link');
    const notificationsModal = document.getElementById('notifications-modal');
    const notificationCountSpan = document.getElementById('notification-count');
    const notificationsList = document.getElementById('notifications-list');

    // Імітація додавання нових сповіщень
    let notificationCounter = parseInt(notificationCountSpan.textContent) || 0; // Початкова кількість сповіщень з HTML
    function addNotification(type, senderId, postId = null) {
        notificationCounter++;
        notificationCountSpan.textContent = notificationCounter;

        const newItem = document.createElement('li');
        newItem.classList.add('notification-item');
        const senderFriend = friendsData.find(f => f.id === senderId);
        const avatarSrc = senderFriend ? senderFriend.avatar : 'images/default_avatar.png';
        const senderName = senderFriend ? senderFriend.name : 'Невідомий';

        let message = '';
        if (type === 'like') {
            message = `<p><strong class="notification-sender">${senderName}</strong> лайкнув ваш пост.</p>`;
        } else if (type === 'comment') {
            message = `<p><strong class="notification-sender">${senderName}</strong> прокоментував ваш пост.</p>`;
        } else if (type === 'friend_request') {
            message = `<p><strong class="notification-sender">${senderName}</strong> надіслав вам запит на дружбу.</p>`;
        }

        newItem.innerHTML = `
            <img src="${avatarSrc}" alt="${senderName}" class="notification-avatar">
            ${message}
            <span class="notification-time">Щойно</span>
        `;
        notificationsList.prepend(newItem);
    }

    // Приклад використання:
    setTimeout(() => addNotification('like', 'dwayne'), 5000); // Дуейн Джонсон лайкнув
    setTimeout(() => addNotification('comment', 'ryan'), 10000); // Раян Рейнольдс прокоментував
    setTimeout(() => addNotification('friend_request', 'ben'), 15000); // Бен Аффлек надіслав запит

    notificationsLink.addEventListener('click', function(event) {
        event.preventDefault();
        notificationsModal.classList.add('active');
        // Очищаємо лічильник лише при відкритті модалки, щоб користувач "побачив" сповіщення
        notificationCountSpan.textContent = '0';
        notificationCounter = 0;
    });


    // --- Закриття модальних вікон ---
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === sendModal) {
            closeModal(sendModal);
        }
        if (event.target === notificationsModal) {
            closeModal(notificationsModal);
        }
    });

    function closeModal(modalElement) {
        modalElement.classList.remove('active');
        if (modalElement.id === 'send-modal') {
            friendListContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            updateSendButtonVisibility(); // Переконатися, що кнопка "Відправити" схована при закритті
        }
    }

    // --- Функціональність безкінечної прокрутки ---
    const loadingSpinner = document.getElementById('loading-spinner');
    let loadingPosts = false;

    function loadMorePosts() {
        if (loadingPosts) return;
        loadingPosts = true;
        loadingSpinner.style.display = 'flex';

        // Імітуємо завантаження даних з сервера з коректними відповідностями
        setTimeout(() => {
            const newPosts = [
                {
                    id: '5',
                    author: 'Він Дізель',
                    avatar: 'images/avatar6.png', // Аватар Він Дізеля
                    date: '3 дні тому',
                    image: 'images/img5.png', // Зображення Він Дізеля
                    description: 'Нові пригоди чекають!',
                    likes: 18,
                    comments: []
                },
                {
                    id: '6',
                    author: 'Акшай Кумар',
                    avatar: 'images/avatar7.png', // Аватар Акшая Кумара
                    date: '4 дні тому',
                    image: 'images/img6.png', // Зображення Акшая Кумара
                    description: 'Фільммейкінг - це пристрасть.',
                    likes: 25,
                    comments: [{author: 'Вілл Смітт', avatar: 'images/avatar1.png', text: 'Згоден!'}]
                },
                {
                    id: '7',
                    author: 'Лін-Мануель Міранда',
                    avatar: 'images/avatar8.png', // Аватар Лін-Мануеля Міранди
                    date: '5 дні тому',
                    image: 'images/img7.png', // Зображення Лін-Мануеля Міранди
                    description: 'Творчість надихає.',
                    likes: 12,
                    comments: []
                },
                {
                    id: '8',
                    author: 'Вілл Смітт',
                    avatar: 'images/avatar1.png', // Аватар Вілла Смітта
                    date: '6 дні тому',
                    image: 'images/img8.png', // Зображення Вілла Смітта
                    description: 'Просто гарний день.',
                    likes: 35,
                    comments: []
                }
            ];

            newPosts.forEach(postData => {
                const newPostDiv = document.createElement('div');
                newPostDiv.classList.add('post');
                newPostDiv.setAttribute('data-post-id', postData.id);

                let commentsHtml = postData.comments.map(comment => `
                    <div class="comment">
                        <img src="${comment.avatar}" alt="Аватар коментатора" class="comment-avatar">
                        <span class="comment-author">${comment.author}:</span> ${comment.text}
                    </div>
                `).join('');

                newPostDiv.innerHTML = `
                    <div class="post-header">
                        <img src="${postData.avatar}" alt="Аватар користувача" class="post-avatar">
                        <div class="post-info">
                            <span class="post-author">${postData.author}</span>
                            <span class="post-date">${postData.date}</span>
                        </div>
                    </div>
                    <img src="${postData.image}" alt="Пост ${postData.author}" class="post-image">
                    <p class="post-description">${postData.description}</p>
                    <div class="post-actions">
                        <button class="like-btn" data-likes="${postData.likes}">
                            <span class="material-icons">favorite_border</span> Лайк (<span class="like-count">${postData.likes}</span>)
                        </button>
                        <button class="comment-btn">
                            <span class="material-icons">comment</span> Коментувати
                        </button>
                        <button class="send-btn" data-post-id="${postData.id}" aria-label="Поширити допис">
                            <span class="material-icons">send</span>
                        </button>
                    </div>
                    <div class="comments-section" style="display: none;">
                        ${commentsHtml}
                        <form class="comment-form">
                            <input type="text" placeholder="Напишіть коментар..." class="comment-input">
                            <button type="submit" class="comment-submit-btn">Опублікувати</button>
                        </form>
                    </div>
                `;
                postsContainer.appendChild(newPostDiv);
            });

            loadingSpinner.style.display = 'none';
            loadingPosts = false;
        }, 1500);
    }

    // Слухач подій для безкінечної прокрутки
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && !loadingPosts) {
            loadMorePosts();
        }
    });

    // --- Функціональність фільтрації стрічки (базова імітація) ---
    const filterSelect = document.getElementById('filter-select');
    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        const posts = postsContainer.querySelectorAll('.post');

        posts.forEach(post => {
            const likes = parseInt(post.querySelector('.like-count').textContent);
            post.style.display = 'block';

            if (filterValue === 'popular') {
                if (likes < 20) {
                    post.style.display = 'none';
                }
            } else if (filterValue === 'newest') {
                // Всі пости вже відсортовані за датою додавання (приблизно)
                // Якщо є реальний бекенд, тут буде запит на відсортовані дані
            }
        });
    });

    // --- Функціональність чатів (імітація переходу) ---
    const chatListItems = document.querySelectorAll('.chat-list li');
    chatListItems.forEach(item => {
        item.addEventListener('click', function() {
            const friendId = this.dataset.friendId;
            alert(`Ви відкрили чат з другом: ${this.textContent.trim()} (ID: ${friendId}). У реальному додатку тут буде сторінка чату.`);
        });
    });

});

// --- Код для редагування профілю (якщо ви хочете, щоб він був у цьому ж файлі) ---
// Якщо ви підключаєте окремий файл для профілю (наприклад, profile-editor.js),
// то цей блок коду повинен бути там.
document.addEventListener('DOMContentLoaded', () => {
    // Тільки якщо ми на сторінці профілю
    const myProfileSection = document.getElementById('my-profile');
    if (myProfileSection) {
        const profileNameElement = myProfileSection.querySelector('h1');
        const profileInfoElement = myProfileSection.querySelector('.profile-info');
        const profilePhotoElement = myProfileSection.querySelector('.profile-photo');
        const profilePhotoInput = document.createElement('input'); // Створюємо інпут для зміни фото
        profilePhotoInput.type = 'file';
        profilePhotoInput.accept = 'image/*';
        profilePhotoInput.style.display = 'none'; // Ховаємо його
        profilePhotoElement.parentNode.insertBefore(profilePhotoInput, profilePhotoElement.nextSibling);

        // Додаємо іконку редагування для фото
        const editPhotoIcon = document.createElement('span');
        editPhotoIcon.classList.add('material-icons', 'edit-photo-icon');
        editPhotoIcon.textContent = 'edit';
        editPhotoIcon.style.cursor = 'pointer';
        editPhotoIcon.style.marginLeft = '10px';
        editPhotoIcon.style.verticalAlign = 'middle';
        profilePhotoElement.parentNode.insertBefore(editPhotoIcon, profilePhotoElement.nextSibling);


        // Завантаження збережених даних при завантаженні сторінки профілю
        const loadProfileData = () => {
            const savedName = localStorage.getItem('profileName');
            const savedInfo = localStorage.getItem('profileInfo');
            const savedAvatar = localStorage.getItem('profileAvatar'); // Завантажуємо аватар

            if (savedName) {
                profileNameElement.textContent = savedName;
            } else {
                // Якщо імені немає в localStorage, беремо з HTML і зберігаємо
                localStorage.setItem('profileName', profileNameElement.textContent);
            }
            if (savedInfo) {
                profileInfoElement.textContent = savedInfo;
            } else {
                localStorage.setItem('profileInfo', profileInfoElement.textContent);
            }
            if (savedAvatar) {
                profilePhotoElement.src = savedAvatar;
            } else {
                // Якщо аватара немає, беремо з HTML і зберігаємо
                localStorage.setItem('profileAvatar', profilePhotoElement.src);
            }
        };

        // Функція для збереження даних
        const saveProfileData = () => {
            if (profileNameElement) {
                localStorage.setItem('profileName', profileNameElement.textContent);
            }
            if (profileInfoElement) {
                localStorage.setItem('profileInfo', profileInfoElement.textContent);
            }
            if (profilePhotoElement) {
                localStorage.setItem('profileAvatar', profilePhotoElement.src); // Зберігаємо src зображення
            }
        };

        // Завантажуємо дані профілю
        loadProfileData();

        // Робимо елементи редагованими
        if (profileNameElement) {
            profileNameElement.setAttribute('contenteditable', 'true');
            profileNameElement.addEventListener('blur', saveProfileData);
            profileNameElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Запобігаємо переходу на новий рядок
                    profileNameElement.blur(); // Втрачаємо фокус, щоб зберегти
                }
            });
        }
        if (profileInfoElement) {
            profileInfoElement.setAttribute('contenteditable', 'true');
            profileInfoElement.addEventListener('blur', saveProfileData);
        }

        // Обробка зміни фото
        if (editPhotoIcon) {
            editPhotoIcon.addEventListener('click', () => {
                profilePhotoInput.click(); // Клікаємо по прихованому інпуту
            });
        }

        profilePhotoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoElement.src = e.target.result; // Змінюємо src аватара
                    saveProfileData(); // Зберігаємо новий src
                };
                reader.readAsDataURL(file); // Читаємо файл як Data URL
            }
        });
    }
});