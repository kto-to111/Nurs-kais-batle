document.addEventListener('DOMContentLoaded', () => {
    const wheelElement = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spin-btn');
    const resultMessage = document.getElementById('result-message');

    // Определяем секторы и их цвета/названия
    const sectors = [
        { label: "Сасуто (Сын Наруто и Саске)", color: "#ff4d4d" },
        { label: "Дцп (ыыаааыааыыыыыаа(слюньки))", color: "#ffb84d" },
    ];

    const numSectors = sectors.length;
    const rotateAngle = 360 / numSectors;
    let currentRotation = 0;

    // Функция для создания секторов в HTML и установки conic-gradient
    function createWheel() {
        // 1. Устанавливаем фон с conic-gradient (визуальные сектора)
        let conicGradient = 'conic-gradient(';
        sectors.forEach((sector, index) => {
            const startAngle = index * rotateAngle;
            const endAngle = (index + 1) * rotateAngle;
            conicGradient += `${sector.color} ${startAngle}deg ${endAngle}deg` + (index === numSectors - 1 ? '' : ', ');
        });
        conicGradient += ')';
        wheelElement.style.background = conicGradient;

        // 2. Добавляем элементы <li> для размещения текста
        sectors.forEach((sector, index) => {
            const li = document.createElement('li');
            // Угол поворота для каждого сектора
            li.style.transform = `rotate(${index * rotateAngle}deg)`;
            li.style.backgroundColor = 'transparent'; // Фон уже есть в родителе

            const span = document.createElement('span');
            span.textContent = sector.label;
            li.appendChild(span);
            wheelElement.appendChild(li);
        });
    }

    // Функция для вращения колеса
    function spinWheel() {
        spinBtn.disabled = true;
        resultMessage.textContent = 'Крутится...';

        // Генерируем случайный угол для остановки (минимум 5 полных оборотов + случайный угол)
        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = currentRotation + 360 * 5 + randomDegree;

        // Применяем анимацию через Web Animations API для плавности
        const animation = wheelElement.animate([
            { transform: `rotate(${currentRotation}deg)` },
            { transform: `rotate(${totalRotation}deg)` }
        ], {
            duration: 5000, // Длительность анимации 5 секунд
            easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)', // Плавное замедление
            fill: 'forwards' // Сохранить конечное состояние
        });

        // Обработка окончания анимации
        animation.onfinish = () => {
            currentRotation = totalRotation % 360; // Обновляем текущий угол для следующего спина
            spinBtn.disabled = false;
            determineWinner(currentRotation);
        };
    }

    // Функция определения победившего сектора
    function determineWinner(angle) {
        // Логика определения сектора под указателем (который сверху).
        // normalizedAngle - это угол под указателем, отсчет по часовой стрелке от 12 часов.
        let normalizedAngle = (360 - (angle % 360) + 90) % 360; 
        
        const winningIndex = Math.floor(normalizedAngle / rotateAngle);
        const prize = sectors[winningIndex];

        resultMessage.textContent = `Поздравляем! Вы выиграли: ${prize.label}`;
    }

    // Инициализация колеса при загрузке страницы
    createWheel();
    // Добавляем обработчик события на кнопку
    spinBtn.addEventListener('click', spinWheel);
});
