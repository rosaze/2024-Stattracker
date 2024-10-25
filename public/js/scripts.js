// 전역 변수로 카테고리 정의
const categories = [
  "Contests",
  "Language study",
  "Major study",
  "Networking",
  "Reading",
];

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  const app = document.getElementById("app");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.querySelector(".close");
  const activityForm = document.getElementById("activityForm");

  setupEventListeners(modal, closeModalBtn, activityForm);
  showSection("home");
  updateChart();
}

function createHomePageCategories() {
  const app = document.getElementById("app");
  app.innerHTML = ""; // Clear existing content
  categories.forEach((category) => {
    const stat = getStat(category);
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category", "hologram-effect");
    categoryDiv.innerHTML = `
      <h2>${category}</h2>
      <button class="record-btn" data-category="${category}">활동 기록</button>
      <p>스탯: <span id="${category}-stat">${stat}</span>%</p>
    `;
    app.appendChild(categoryDiv);
  });
}

function setupEventListeners(modal, closeModalBtn, activityForm) {
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("record-btn")) {
      const category = event.target.getAttribute("data-category");
      openModal(category);
    }
  });

  closeModalBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  };

  activityForm.onsubmit = handleActivitySubmit;

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = e.target.getAttribute("href").substring(1);
      showSection(sectionId);
    });
  });
}

function handleActivitySubmit(event) {
  event.preventDefault();
  const category = document.getElementById("activityCategory").value;
  const activityDate = document.getElementById("activityDate").value;
  const activityDetails = document.getElementById("activityDetails").value;

  if (!activityDate || !activityDetails) {
    alert("날짜와 활동 세부 사항을 입력하세요.");
    return;
  }

  updateStat(category);
  saveActivityRecord(category, activityDate, activityDetails);

  document.getElementById("modal").style.display = "none";
  updateChart();
  if (document.getElementById("activities").classList.contains("active")) {
    loadStatBars();
    loadActivityRecords();
  }
  updateHomePageStats();
}

function updateStat(category) {
  const statSpan = document.getElementById(`${category}-stat`);
  let stat = parseInt(statSpan.textContent, 10);
  stat = Math.min(stat + 1, 100);
  statSpan.textContent = stat;
  saveStat(category, stat);
}

function openModal(category) {
  const modal = document.getElementById("modal");
  document.getElementById("activityCategory").value = category;
  modal.style.display = "block";
}

function saveStat(category, stat) {
  localStorage.setItem(`${category}-stat`, stat);
}

function getStat(category) {
  const stat = localStorage.getItem(`${category}-stat`);
  return stat ? parseInt(stat, 10) : 0;
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.style.display = "none";
    section.classList.remove("active");
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";
    targetSection.classList.add("active");

    const pageTitle = document.getElementById("pageTitle");
    pageTitle.textContent =
      sectionId === "home"
        ? "College Student Stat Tracking"
        : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

    if (sectionId === "home") {
      createHomePageCategories();
    } else if (sectionId === "stats") {
      updateChart();
    } else if (sectionId === "activities") {
      loadStatBars();
      loadActivityRecords();
    }
    // goals 페이지에 대한 특정 로직이 필요하다면 여기에 추가
  } else {
    console.error(`Section with id ${sectionId} not found`);
  }
}

function loadStatBars() {
  const statBarsContainer = document.getElementById("statBars");
  if (!statBarsContainer) return;

  statBarsContainer.innerHTML = "";
  categories.forEach((category) => {
    const stat = getStat(category);
    const statBarDiv = document.createElement("div");
    statBarDiv.classList.add("stat-bar");
    statBarDiv.innerHTML = `
      <div class="label">${category}</div>
      <div class="progress">
        <div class="progress-bar" style="width: ${stat}%"></div>
      </div>
      <div class="percentage">${stat}%</div>
    `;
    statBarsContainer.appendChild(statBarDiv);
  });
}

function loadActivityRecords() {
  const recordsList = document.getElementById("recordsList");
  if (!recordsList) return;

  recordsList.innerHTML = "";
  categories.forEach((category) => {
    const records =
      JSON.parse(localStorage.getItem(`${category}-records`)) || [];
    if (records.length > 0) {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-records");

      const categoryTitle = document.createElement("h4");
      categoryTitle.innerHTML = `${category} <span>${records.length}</span>`;
      categoryTitle.addEventListener("click", toggleCategory);
      categoryDiv.appendChild(categoryTitle);

      const ul = document.createElement("ul");
      ul.classList.add("record-list");
      records.forEach((record) => {
        const li = document.createElement("li");
        li.textContent = `${record.date}: ${record.details}`;
        ul.appendChild(li);
      });
      categoryDiv.appendChild(ul);
      recordsList.appendChild(categoryDiv);
    }
  });

  if (recordsList.children.length === 0) {
    const noRecordsMessage = document.createElement("p");
    noRecordsMessage.textContent = "아직 기록된 활동이 없습니다.";
    recordsList.appendChild(noRecordsMessage);
  }
}

function toggleCategory(event) {
  const categoryTitle = event.currentTarget;
  const recordList = categoryTitle.nextElementSibling;
  categoryTitle.classList.toggle("collapsed");
  recordList.classList.toggle("expanded");
}

function saveActivityRecord(category, date, details) {
  const records = JSON.parse(localStorage.getItem(`${category}-records`)) || [];
  records.push({ date, details });
  localStorage.setItem(`${category}-records`, JSON.stringify(records));
}

function updateHomePageStats() {
  categories.forEach((category) => {
    const statSpan = document.getElementById(`${category}-stat`);
    if (statSpan) {
      statSpan.textContent = getStat(category);
    }
  });
}
