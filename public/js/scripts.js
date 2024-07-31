document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.querySelector(".close");
  const activityForm = document.getElementById("activityForm");

  const categories = [
    "Contests",
    "Language study",
    "Major study",
    "Networking",
    "Reading",
  ];

  categories.forEach((category) => {
    const stat = getStat(category);

    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.innerHTML = `
            <h2>${category}</h2>
            <button class="record-btn" data-category="${category}">활동 기록</button>
            <p>스탯: <span id="${category}-stat">${stat}</span>%</p>
        `;
    app.appendChild(categoryDiv);
  });

  document.querySelectorAll(".record-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const category = event.target.getAttribute("data-category");
      openModal(category);
    });
  });

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  activityForm.onsubmit = function (event) {
    event.preventDefault();
    const category = document.getElementById("activityCategory").value;
    const statSpan = document.getElementById(`${category}-stat`);
    let stat = parseInt(statSpan.textContent);
    stat = Math.min(stat + 1, 100);
    statSpan.textContent = stat;
    saveStat(category, stat);
    modal.style.display = "none";
  };
});

function openModal(category) {
  const modal = document.getElementById("modal");
  const activityCategory = document.getElementById("activityCategory");
  activityCategory.value = category;
  modal.style.display = "block";
}

function saveStat(category, stat) {
  localStorage.setItem(`${category}-stat`, stat);
}

function getStat(category) {
  return localStorage.getItem(`${category}-stat`) || 0;
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.style.display = "none";
    section.classList.remove("active");
  });
  const targetSection = document.getElementById(sectionId);
  targetSection.style.display = "block";
  targetSection.classList.add("active");
}
