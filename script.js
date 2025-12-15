document.addEventListener('DOMContentLoaded', () => {
    const wheelElement = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spin-btn');
    const resultMessage = document.getElementById('result-message');

    // Определяем секторы и их цвета
    const sectors = [
        { label: "Приз 1", color: "#ff4d4d" },
        { label: "Приз 2", color: "#ffb84d" },
        { label: "Приз 3", color: "#ffe64d" },
        { label: "Приз 4", color: "#8aff4d" },
        { label: "Приз 5", color: "#4dffb8" },
        { label: "Приз 6", color: "#4db8ff" },
        { label: "Приз 7", color: "#4d4dff" },
        { label: "Приз 8", color: "#b84dff" }
    ];

    const numSectors = sectors.length;
    const rotateAngle = 360 / numSectors;
    let currentRotation = 0;

    // Функция для создания секторов в HTML и установки conic-gradient
    function createWheel() {
        let gradientColors = [];
        sectors.forEach((sector, index) => {
            // Добавляем элемент списка для текста приза (для простоты примера оставим только градиент)
            // Более сложное позиционирование текста решается с помощью JS или Canvas
        });

        // Используем conic-gradient для создания визуальных секторов
        // Это более простой способ, чем позиционировать <li> элементы
        let conicGradient = 'conic-gradient(';
        sectors.forEach((sector, index) => {
            const startAngle = index * rotateAngle;
            const endAngle = (index + 1) * rotateAngle;
            conicGradient += `${sector.color} ${startAngle}deg ${endAngle}deg` + (index === numSectors - 1 ? '' : ', ');
        });
        conicGradient += ')';
        wheelElement.style.background = conicGradient;
    }

    // Функция для вращения колеса
    function spinWheel() {
        spinBtn.disabled = true;
        resultMessage.textContent = 'Крутится...';

        // Генерируем случайный угол для остановки (минимум 3 полных оборота + случайный угол)
        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = currentRotation + 360 * 3 + randomDegree;

        // Применяем анимацию через Web Animations API для плавности
        const animation = wheelElement.animate([
            { transform: `rotate(${currentRotation}deg)` },
            { transform: `rotate(${totalRotation}deg)` }
        ], {
            duration: 4000, // Длительность анимации 4 секунды
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
        // Указатель находится сверху (0 градусов).
        // Угол нужно отсчитывать от верха против часовой стрелки или скорректировать
        // для текущей реализации градиента (от 0 на 3 часа по часовой стрелке).
        
        // Корректируем угол так, чтобы 0 градусов был на позиции указателя (12 часов)
        // и вращение было по часовой стрелке для определения сектора.
        // Наша анимация вращает по часовой стрелке (увеличение градусов).
        // Угол в 0 градусов соответствует началу первого сектора (если считать от 3 часов).
        
        // Чтобы определить сектор под указателем (вверху, 0/360 град),
        // нужно скорректировать угол с учетом смещения на 90 градусов (от 3 часов до 12 часов)
        // и инвертировать направление счета для удобства.

        let normalizedAngle = (360 - (angle % 360) + 90) % 360; // Угол под указателем, отсчет по часовой стрелке от 12ч
        
        const winningIndex = Math.floor(normalizedAngle / rotateAngle);
        // Индекс может немного отличаться из-за округлений, используем ближайший целый индекс
        const prize = sectors[winningIndex];

        resultMessage.textContent = `Поздравляем! Вы выиграли: ${prize.label}`;
    }

    createWheel();
    spinBtn.addEventListener('click', spinWheel);
});
