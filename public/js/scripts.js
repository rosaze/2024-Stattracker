document.addEventListener("DOMContentLoaded", () => {
  // 변수 선언
  const app = document.getElementById("app");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.querySelector(".close");
  const activityForm = document.getElementById("activityForm");

  // 카테고리 정의
  const categories = [
    "Contests",
    "Language study",
    "Major study",
    "Networking",
    "Reading",
  ];

  // 카테고리별로 동적 요소 생성
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

  // 활동 기록 버튼 클릭 이벤트 핸들러
  document.querySelectorAll(".record-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const category = event.target.getAttribute("data-category");
      openModal(category);
    });
  });

  // 모달 닫기 이벤트
  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // 활동 기록 저장 처리
  activityForm.onsubmit = function (event) {
    event.preventDefault(); // 기본 폼 제출 막기

    const category = document.getElementById("activityCategory").value;
    const activityDate = document.getElementById("activityDate").value;
    const activityDetails = document.getElementById("activityDetails").value;

    // 필드가 비어있는지 확인
    if (!activityDate || !activityDetails) {
      alert("날짜와 활동 세부 사항을 입력하세요.");
      return;
    }

    // 스탯 업데이트
    const statSpan = document.getElementById(`${category}-stat`);
    let stat = parseInt(statSpan.textContent, 10);
    stat = Math.min(stat + 1, 100);
    statSpan.textContent = stat;

    saveStat(category, stat);
    saveActivityRecord(category, activityDate, activityDetails);

    // 모달 닫기 및 차트 업데이트
    modal.style.display = "none";
    updateChart();
  };

  // 페이지 초기화
  showSection("home");
  updateChart();
});

// 모달 열기 함수
function openModal(category) {
  const modal = document.getElementById("modal");
  const activityCategory = document.getElementById("activityCategory");
  activityCategory.value = category;
  modal.style.display = "block";
}

// 스탯 저장
function saveStat(category, stat) {
  localStorage.setItem(`${category}-stat`, stat);
}

// 활동 기록 저장
function saveActivityRecord(category, date, details) {
  const records = JSON.parse(localStorage.getItem(`${category}-records`)) || [];
  records.push({ date: date, details: details });
  localStorage.setItem(`${category}-records`, JSON.stringify(records));
}

// 스탯 가져오기
function getStat(category) {
  const stat = localStorage.getItem(`${category}-stat`);
  return stat ? parseInt(stat, 10) : 0;
}

// 섹션 보여주기
function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.style.display = "none";
    section.classList.remove("active");
  });
  const targetSection = document.getElementById(sectionId);
  targetSection.style.display = "block";
  targetSection.classList.add("active");

  if (sectionId === "stats") {
    updateChart(); // 'stats' 섹션으로 전환 시 차트를 업데이트
  } else if (sectionId === "activities") {
    loadActivityRecords(); // 'activities' 섹션으로 전환 시 활동 기록을 로드
  }
}

// 활동 기록 로드
function loadActivityRecords() {
  const recordsList = document.getElementById("recordsList");
  if (!recordsList) return; // recordsList가 없는 경우 함수 종료

  recordsList.innerHTML = ""; // 기존 기록들을 초기화

  const categories = [
    "Contests",
    "Language study",
    "Major study",
    "Networking",
    "Reading",
  ];

  categories.forEach((category) => {
    const records =
      JSON.parse(localStorage.getItem(`${category}-records`)) || [];
    if (records.length > 0) {
      const categoryTitle = document.createElement("h4");
      categoryTitle.textContent = category;
      recordsList.appendChild(categoryTitle);

      const ul = document.createElement("ul");
      records.forEach((record) => {
        const li = document.createElement("li");
        li.textContent = `${record.date}: ${record.details}`;
        ul.appendChild(li);
      });
      recordsList.appendChild(ul);
    }
  });
}
