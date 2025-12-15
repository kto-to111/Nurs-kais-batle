document.addEventListener('DOMContentLoaded', () => {
    const wheelElement = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spin-btn');
    const resultMessage = document.getElementById('result-message');

    // Ваши секторы из примера
    const sectors = [
        { label: "Дцп (ыыаааыааыыыыыаа(слюньки))", color: "#ff4d4d" },
        { label: "Сасуто (Сын Наруто и Саске)", color: "#ffb84d" },
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
            
            // Угол поворота для каждого сектора (поворачивает весь li по радиусу)
            li.style.transform = `rotate(${index * rotateAngle}deg)`;

            const span = document.createElement('span');
            span.textContent = sector.label;
            
            // ВАЖНО: Поворачиваем текст обратно ровно на тот же угол, что и li, 
            // чтобы он всегда оставался горизонтальным.
            span.style.transform = `rotate(-${index * rotateAngle}deg)`;

            li.appendChild(span);
            wheelElement.appendChild(li);
        });
    }

    // ... (Остальные функции spinWheel и determineWinner остаются прежними) ...
    function spinWheel() {
        spinBtn.disabled = true;
        resultMessage.textContent = 'Крутится...';

        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = currentRotation + 360 * 5 + randomDegree;

        const animation = wheelElement.animate([
            { transform: `rotate(${currentRotation}deg)` },
            { transform: `rotate(${totalRotation}deg)` }
        ], {
            duration: 5000,
            easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
            fill: 'forwards'
        });

        animation.onfinish = () => {
            currentRotation = totalRotation % 360;
            spinBtn.disabled = false;
            determineWinner(currentRotation);
        };
    }

    function determineWinner(angle) {
        let normalizedAngle = (360 - (angle % 360) + 90) % 360; 
        const winningIndex = Math.floor(normalizedAngle / rotateAngle);
        const prize = sectors[winningIndex];

        resultMessage.textContent = `Поздравляем! Вы выиграли: ${prize.label}`;
    }

    createWheel();
    spinBtn.addEventListener('click', spinWheel);
});
