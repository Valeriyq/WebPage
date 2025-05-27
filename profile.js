document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.querySelector('#my-profile h1');
    const profileInfo = document.querySelector('#my-profile .profile-info');

    // Функція для завантаження збережених даних при завантаженні сторінки
    const loadProfileData = () => {
        const savedName = localStorage.getItem('profileName');
        const savedInfo = localStorage.getItem('profileInfo');

        if (savedName) {
            profileName.textContent = savedName;
        }
        if (savedInfo) {
            profileInfo.textContent = savedInfo;
        }
    };

    // Функція для збереження даних при зміні
    const saveProfileData = () => {
        if (profileName) {
            localStorage.setItem('profileName', profileName.textContent);
        }
        if (profileInfo) {
            localStorage.setItem('profileInfo', profileInfo.textContent);
        }
        // Можливо, можна додати тимчасове сповіщення "Збережено!"
    };

    // Завантажуємо дані при завантаженні сторінки
    loadProfileData();

    // Додаємо обробники подій для збереження даних при втраті фокуса (blur)
    if (profileName) {
        profileName.addEventListener('blur', saveProfileData);
    }
    if (profileInfo) {
        profileInfo.addEventListener('blur', saveProfileData);
    }

    // Можливо, також можна додати кнопку "Зберегти"
    // <button id="saveProfileBtn">Зберегти зміни</button>
    // const saveButton = document.getElementById('saveProfileBtn');
    // if (saveButton) {
    //     saveButton.addEventListener('click', saveProfileData);
    // }
document.addEventListener('DOMContentLoaded', () => {
    const profileNameElement = document.querySelector('#my-profile h1'); // Елемент h1 з ім'ям профілю

    // Функція для завантаження збережених даних при завантаженні сторінки
    const loadProfileName = () => {
        const savedName = localStorage.getItem('profileName');
        if (savedName) {
            profileNameElement.textContent = savedName;
        } else {
            // Якщо імені немає в localStorage, беремо з HTML і зберігаємо
            localStorage.setItem('profileName', profileNameElement.textContent);
        }
    };

    // Функція для збереження даних при зміні
    const saveProfileName = () => {
        if (profileNameElement) {
            localStorage.setItem('profileName', profileNameElement.textContent);
        }
    };

    // Завантажуємо ім'я при завантаженні сторінки
    loadProfileName();

    // Додаємо обробник подій для збереження імені при втраті фокуса
    if (profileNameElement) {
        profileNameElement.addEventListener('blur', saveProfileName);
        // Додатково можна слухати 'input' для збереження в реальному часі
        // profileNameElement.addEventListener('input', saveProfileName);
    }
});


});