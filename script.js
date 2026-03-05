const times = document.getElementById("times");
const counter = document.getElementById("counter");
const addSmoke = document.getElementById("addSmoke");
const navHome = document.getElementById("navHome");
const navStats = document.getElementById("navStats");
const navSettings = document.getElementById("navSettings");
const priceInput = document.getElementById("priceInput");
const savePrice = document.getElementById("savePrice");
const resetBtn = document.getElementById("resetBtn");
const day = document.getElementById("day");
const weekly = document.getElementById("weekly");
const month = document.getElementById("month");
const moneyDay = document.getElementById("moneyDay");
const moneyWeek = document.getElementById("moneyWeek");
const moneyMonth = document.getElementById("moneyMonth");

let smokeCount = 0;
let lastSmoke = null;
let cigarettePrice = 0;
let smokeHistory = [];

// Загрузка данных
if (localStorage.getItem("smokeCount")) {
  smokeCount = Number(localStorage.getItem("smokeCount"));
  counter.textContent = smokeCount;
}

if (localStorage.getItem("savePrice")) {
  cigarettePrice = Number(localStorage.getItem("savePrice"));
  priceInput.value = cigarettePrice;
}

if (localStorage.getItem("lastSmoke")) {
  lastSmoke = new Date(localStorage.getItem("lastSmoke"));
}

if (localStorage.getItem("smokeHistory")) {
  smokeHistory = JSON.parse(localStorage.getItem("smokeHistory"));
}

// Добавить сигарету
function handleAddSmoke() {
  ++smokeCount;
  lastSmoke = new Date();
  smokeHistory.push(new Date().toISOString());
  counter.textContent = smokeCount;
  localStorage.setItem("smokeCount", smokeCount);
  localStorage.setItem("lastSmoke", lastSmoke.toISOString());
  localStorage.setItem("smokeHistory", JSON.stringify(smokeHistory));
  updateStats();

  // Анимация кнопки
  addSmoke.style.transform = "scale(0.93)";
  setTimeout(() => (addSmoke.style.transform = ""), 150);
}

addSmoke.addEventListener("click", handleAddSmoke);

// Таймер
function updateTimer() {
  const now = new Date();
  if (lastSmoke) {
    const diff = Math.floor((now - lastSmoke) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    times.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
}

updateTimer();
setInterval(updateTimer, 1000);

// Переключение экранов
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active-nav");
  });

  const navMap = { home: navHome, stats: navStats, settings: navSettings };
  navMap[id].classList.add("active-nav");
}

navHome.addEventListener("click", () => showScreen("home"));
navStats.addEventListener("click", () => {
  showScreen("stats");
  updateStats();
});
navSettings.addEventListener("click", () => showScreen("settings"));

// Сохранить цену
function handleSavePrice() {
  cigarettePrice = Number(priceInput.value);
  localStorage.setItem("savePrice", cigarettePrice);
  updateStats();

  savePrice.textContent = "сохранено ✓";
  setTimeout(() => (savePrice.textContent = "сохранить"), 1500);
}

savePrice.addEventListener("click", handleSavePrice);

// Сброс
resetBtn.addEventListener("click", () => {
  if (confirm("Сбросить все данные?")) {
    smokeCount = 0;
    lastSmoke = null;
    smokeHistory = [];
    localStorage.clear();
    counter.textContent = 0;
    times.textContent = "00:00:00";
    updateStats();
  }
});

// Статистика
function updateStats() {
  const today = new Date();

  const todaySmokes = smokeHistory.filter((date) => {
    const d = new Date(date);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
  const weekSmokes = smokeHistory.filter((date) => new Date(date) >= weekAgo);

  const monthAgo = new Date(today - 30 * 24 * 60 * 60 * 1000);
  const monthSmokes = smokeHistory.filter((date) => new Date(date) >= monthAgo);

  const pricePerCigarette = cigarettePrice / 20;

  day.textContent = todaySmokes.length;
  weekly.textContent = weekSmokes.length;
  month.textContent = monthSmokes.length;
  moneyDay.textContent = `${(todaySmokes.length * pricePerCigarette).toFixed(0)} ₽`;
  moneyWeek.textContent = `${(weekSmokes.length * pricePerCigarette).toFixed(0)} ₽`;
  moneyMonth.textContent = `${(monthSmokes.length * pricePerCigarette).toFixed(0)} ₽`;
}

updateStats();
