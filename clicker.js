// Класс для управления счётчиком кликов в стиле котиков
class ClickerManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.counters = this.loadCounters();
        this.init();
    }

    // Определение текущей страницы по URL
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('Породы.html')) return 'Породы';
        if (path.includes('Питание.html')) return 'Питание';
        if (path.includes('Здоровье.html')) return 'Здоровье';
        return 'Главная';
    }

    // Загрузка сохранённых счётчиков
    loadCounters() {
        const saved = localStorage.getItem('clickerCounters');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch(e) {
                return {};
            }
        }
        return {};
    }

    // Сохранение счётчиков
    saveCounters() {
        localStorage.setItem('clickerCounters', JSON.stringify(this.counters));
    }

    // Получение счётчика для текущей страницы
    getCurrentCounter() {
        if (!this.counters[this.currentPage]) {
            this.counters[this.currentPage] = 0;
        }
        return this.counters[this.currentPage];
    }

    // Увеличение счётчика
    incrementCounter(event) {
        this.counters[this.currentPage] = this.getCurrentCounter() + 1;
        this.saveCounters();
        this.updateDisplay();
        this.showCatEffect(event);
        this.playMeow();
    }

    // Сброс счётчика
    resetCounter() {
        this.counters[this.currentPage] = 0;
        this.saveCounters();
        this.updateDisplay();
        this.showResetEffect();
        this.playPurr();
    }

    // Обновление отображения
    updateDisplay() {
        const counterElement = document.getElementById('clickCounter');
        if (counterElement) {
            counterElement.textContent = this.getCurrentCounter();
        }
    }

    // Кошачий эффект в месте клика
    showCatEffect(event) {
        // Главный эффект +1 с лапкой
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        
        // Разные эмодзи для разнообразия
        const catEmojis = ['🐱', '🐈', '😺', '😸', '😻', '🐾', '🐱‍👤'];
        const randomCat = catEmojis[Math.floor(Math.random() * catEmojis.length)];
        effect.textContent = randomCat;
        
        effect.style.left = (event.clientX - 20) + 'px';
        effect.style.top = (event.clientY - 20) + 'px';
        document.body.appendChild(effect);
        
        // Добавляем отпечаток лапки
        this.addPawPrint(event);
        
        setTimeout(() => {
            effect.remove();
        }, 500);
        
        // Эффект мурчания на счётчике
        const counter = document.getElementById('clickCounter');
        if (counter) {
            counter.classList.add('purr');
            setTimeout(() => {
                counter.classList.remove('purr');
            }, 300);
        }
    }

    // Добавление отпечатка лапки
    addPawPrint(event) {
        const paw = document.createElement('div');
        paw.className = 'cat-paw';
        paw.textContent = 'МЯУ';
        paw.style.left = (event.clientX + 15) + 'px';
        paw.style.top = (event.clientY + 10) + 'px';
        document.body.appendChild(paw);
        
        setTimeout(() => {
            paw.remove();
        }, 800);
    }

    // Эффект при сбросе
    showResetEffect() {
        const counter = document.getElementById('clickCounter');
        if (counter) {
            counter.style.transform = 'scale(1.2)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Добавляем много лапок при сбросе
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const fakeEvent = {
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                };
                this.addPawPrint(fakeEvent);
            }, i * 100);
        }
    }

    // Звук мяу (используем Web Audio API)
    playMeow() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            
            oscillator.type = 'sine';
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            setTimeout(() => {
                audioContext.close();
            }, 500);
        } catch(e) {
            // Если звук не поддерживается, просто молчим
        }
    }

    // Эффект мурчания
    playPurr() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 150;
            gainNode.gain.value = 0.05;
            
            oscillator.type = 'triangle';
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
            oscillator.stop(audioContext.currentTime + 1);
            
            setTimeout(() => {
                audioContext.close();
            }, 1000);
        } catch(e) {
            // Если звук не поддерживается, просто молчим
        }
    }

    // Обработчик клика по всей странице
    handlePageClick(event) {
        // Проверяем, что клик не по кнопке сброса
        if (event.target.id !== 'resetButton' && !event.target.classList.contains('reset-button')) {
            this.incrementCounter(event);
        }
    }

    // Инициализация обработчиков событий
    init() {
        const resetButton = document.getElementById('resetButton');
        
        if (resetButton) {
            resetButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.resetCounter();
            });
        }
        
        // Добавляем обработчик клика на всю страницу
        document.addEventListener('click', (event) => {
            this.handlePageClick(event);
        });
        
        this.updateDisplay();
    }
}

// Инициализация счётчика при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.clicker = new ClickerManager();
});