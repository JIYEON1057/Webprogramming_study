// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const numbersDisplay = document.getElementById('numbers');
const resultCenter = document.getElementById('resultCenter');
const resultSection = document.getElementById('result');
const resultNumbers = document.getElementById('resultNumbers');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const floatingBallsContainer = document.getElementById('floatingBalls');
const machineSection = document.getElementById('heroSection');

// Initialize
let history = loadHistory();
let floatingBallElements = [];
let isPicking = false;
let animationFrameId = null;

// Ball physics properties
const balls = [];
const MACHINE_RADIUS = 225;
const BALL_RADIUS = 24;
const CENTER_X = 250;
const CENTER_Y = 250;
const GRAVITY = 0.5;
const WIND_FORCE = 5; // Much stronger wind force
const DAMPING = 0.94; // Energy loss on bounce
const FRICTION = 0.98;
let isWindActive = false; // Wind only when airball machine is clicked

// Create 45 floating balls in hero section
function createFloatingBalls() {
    floatingBallsContainer.innerHTML = '';
    floatingBallElements = [];
    balls.length = 0; // Clear balls array
    
    for (let i = 1; i <= 45; i++) {
        const ball = document.createElement('div');
        ball.className = 'floating-ball';
        ball.textContent = i;
        ball.dataset.number = i;
        
        // Random starting position within circular bounds
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (MACHINE_RADIUS - BALL_RADIUS - 30);
        const x = CENTER_X + Math.cos(angle) * distance;
        const y = CENTER_Y + Math.sin(angle) * distance;
        
        ball.style.left = `${x - BALL_RADIUS}px`;
        ball.style.top = `${y - BALL_RADIUS}px`;
        
        // Add click event to each ball
        ball.addEventListener('click', (e) => {
            if (!isPicking) {
                activateWind();
                e.stopPropagation();
            }
        });
        
        floatingBallsContainer.appendChild(ball);
        floatingBallElements.push(ball);
        
        // Create physics object for this ball
        balls.push({
            element: ball,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: BALL_RADIUS
        });
    }
    
    // Start physics animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animatePhysics();
}

// Activate wind effect
function activateWind() {
    if (isWindActive) return; // Already active
    
    isWindActive = true;
    machineSection.classList.add('wind-active');
    
    // Deactivate after 2 seconds
    setTimeout(() => {
        isWindActive = false;
        machineSection.classList.remove('wind-active');
    }, 2000);
}

// Physics animation loop
function animatePhysics() {
    balls.forEach(ball => {
        if (ball.element.classList.contains('picked') || 
            ball.element.classList.contains('dimmed')) {
            return; // Don't animate picked or dimmed balls
        }
        
        // Apply gravity
        ball.vy += GRAVITY;
        
        // Apply upward wind force from bottom (only when active)
        if (isWindActive) {
            const distanceFromBottom = (CENTER_Y + MACHINE_RADIUS) - ball.y;
            const windStrength = Math.max(0, (MACHINE_RADIUS * 0.8 - distanceFromBottom) / MACHINE_RADIUS);
            ball.vy -= WIND_FORCE * windStrength * 4; // Much stronger wind (4x multiplier)
            
            // Add strong horizontal turbulence when wind is active
            ball.vx += (Math.random() - 0.5) * 0.6;
            ball.vy += (Math.random() - 0.5) * 0.4;
        }
        
        // Apply slight random turbulence
        ball.vx += (Math.random() - 0.5) * 0.1;
        ball.vy += (Math.random() - 0.5) * 0.1;
        
        // Apply friction
        ball.vx *= FRICTION;
        ball.vy *= FRICTION;
        
        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Check collision with circular boundary
        const dx = ball.x - CENTER_X;
        const dy = ball.y - CENTER_Y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance + ball.radius > MACHINE_RADIUS) {
            // Ball hit the wall - bounce back
            const angle = Math.atan2(dy, dx);
            
            // Position ball at boundary
            ball.x = CENTER_X + Math.cos(angle) * (MACHINE_RADIUS - ball.radius);
            ball.y = CENTER_Y + Math.sin(angle) * (MACHINE_RADIUS - ball.radius);
            
            // Reflect velocity (bounce)
            const normalX = dx / distance;
            const normalY = dy / distance;
            const dotProduct = ball.vx * normalX + ball.vy * normalY;
            
            ball.vx = (ball.vx - 2 * dotProduct * normalX) * DAMPING;
            ball.vy = (ball.vy - 2 * dotProduct * normalY) * DAMPING;
        }
        
        // Check collision with other balls
        balls.forEach(otherBall => {
            if (ball === otherBall) return;
            if (otherBall.element.classList.contains('picked') || 
                otherBall.element.classList.contains('dimmed')) return;
            
            const dx = otherBall.x - ball.x;
            const dy = otherBall.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball.radius + otherBall.radius;
            
            if (distance < minDistance) {
                // Balls collided - simple elastic collision
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                
                // Separate balls
                const overlap = minDistance - distance;
                ball.x -= cos * overlap * 0.5;
                ball.y -= sin * overlap * 0.5;
                otherBall.x += cos * overlap * 0.5;
                otherBall.y += sin * overlap * 0.5;
                
                // Exchange velocities (simplified)
                const tempVx = ball.vx;
                const tempVy = ball.vy;
                ball.vx = otherBall.vx * 0.95;
                ball.vy = otherBall.vy * 0.95;
                otherBall.vx = tempVx * 0.95;
                otherBall.vy = tempVy * 0.95;
            }
        });
        
        // Update DOM
        ball.element.style.left = `${ball.x - ball.radius}px`;
        ball.element.style.top = `${ball.y - ball.radius}px`;
    });
    
    animationFrameId = requestAnimationFrame(animatePhysics);
}

// Generate 6 unique random lottery numbers (1-45)
function generateLotteryNumbers() {
    const numbers = new Set();
    
    while (numbers.size < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNum);
    }
    
    // Convert to array and sort
    return Array.from(numbers).sort((a, b) => a - b);
}

// Display generated numbers with animation
function displayNumbers(numbers) {
    numbersDisplay.innerHTML = '';
    
    numbers.forEach((num, index) => {
        setTimeout(() => {
            const ball = document.createElement('span');
            ball.className = 'number-ball show';
            ball.textContent = num;
            numbersDisplay.appendChild(ball);
        }, index * 150); // Stagger animation
    });
}

// Pick balls from hero section with animation
async function pickBallsFromHero(numbers) {
    isPicking = true;
    generateBtn.disabled = true;
    
    // Stop physics animation temporarily
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Clear result displays and hide them
    numbersDisplay.innerHTML = '';
    resultCenter.classList.remove('show');
    resultNumbers.innerHTML = '';
    resultSection.classList.remove('show');
    
    // Dim all balls
    floatingBallElements.forEach(ball => {
        ball.classList.add('dimmed');
    });
    
    // Pick each number one by one
    for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        
        // Find the ball element with this number
        const ballElement = floatingBallElements.find(ball => 
            parseInt(ball.dataset.number) === num
        );
        
        if (ballElement) {
            // Highlight and animate the picked ball
            ballElement.classList.remove('dimmed');
            ballElement.classList.add('picked');
            
            // Add shake effect to machine
            machineSection.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                machineSection.style.animation = '';
            }, 300);
            
            // Hide the ball with fade out
            await sleep(200);
            ballElement.style.transition = 'opacity 0.3s ease';
            ballElement.style.opacity = '0';
            await sleep(300);
            
            // Add to result display in center (temporary)
            const centerBall = document.createElement('span');
            centerBall.className = 'number-ball show';
            centerBall.textContent = num;
            numbersDisplay.appendChild(centerBall);
            
            // Show result center
            resultCenter.classList.add('show');
        }
        
        // Wait before picking next ball
        await sleep(400);
    }
    
    // All numbers picked - show below machine
    await sleep(800);
    
    // Fade out center results
    resultCenter.classList.remove('show');
    await sleep(500);
    
    // Display all results below machine
    numbers.forEach((num, index) => {
        setTimeout(() => {
            const resultBall = document.createElement('span');
            resultBall.className = 'number-ball show';
            resultBall.textContent = num;
            resultNumbers.appendChild(resultBall);
        }, index * 100);
    });
    
    // Show result section below
    resultSection.classList.add('show');
    
    // Keep results visible
    await sleep(1000);
    
    // Reset machine
    floatingBallElements.forEach(ball => {
        ball.classList.remove('dimmed', 'picked');
        ball.style.opacity = '';
        ball.style.transition = '';
    });
    isPicking = false;
    generateBtn.disabled = false;
    
    // Recreate balls for next round
    createFloatingBalls();
}

// Sleep utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add to history
function addToHistory(numbers) {
    const now = new Date();
    const dateString = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const historyItem = {
        numbers: numbers,
        date: dateString,
        timestamp: now.getTime()
    };
    
    history.unshift(historyItem);
    saveHistory();
    displayHistory();
}

// Display history
function displayHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">아직 생성된 번호가 없습니다.</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    history.forEach((item) => {
        const historyItemDiv = document.createElement('div');
        historyItemDiv.className = 'history-item';
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = item.date;
        
        const numbersDiv = document.createElement('div');
        numbersDiv.className = 'numbers';
        
        item.numbers.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'number-ball';
            ball.textContent = num;
            numbersDiv.appendChild(ball);
        });
        
        historyItemDiv.appendChild(dateDiv);
        historyItemDiv.appendChild(numbersDiv);
        historyList.appendChild(historyItemDiv);
    });
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('lottoHistory', JSON.stringify(history));
}

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('lottoHistory');
    return saved ? JSON.parse(saved) : [];
}

// Clear history
function clearHistory() {
    if (history.length === 0) {
        alert('삭제할 히스토리가 없습니다.');
        return;
    }
    
    if (confirm('모든 히스토리를 삭제하시겠습니까?')) {
        history = [];
        saveHistory();
        displayHistory();
    }
}

// Event Listeners
generateBtn.addEventListener('click', async () => {
    if (isPicking) return;
    
    // Add button click animation
    generateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        generateBtn.style.transform = 'scale(1)';
    }, 100);
    
    // Activate wind effect
    activateWind();
    
    // Let wind blow balls around for a moment
    await sleep(1500);
    
    // Generate numbers
    const numbers = generateLotteryNumbers();
    
    // Pick balls from hero section with animation
    await pickBallsFromHero(numbers);
    
    // Add to history
    addToHistory(numbers);
});

clearHistoryBtn.addEventListener('click', clearHistory);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createFloatingBalls();
    displayHistory();
});
