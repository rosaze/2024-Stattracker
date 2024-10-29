document.addEventListener("DOMContentLoaded", () => {
  const goalForm = document.getElementById("goal-form");
  const goalsList = document.getElementById("goals-list");

  loadGoals();

  goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addGoal();
  });

  function addGoal() {
    const category = document.getElementById("goal-category").value;
    const description = document.getElementById("goal-description").value;
    const targetPercentage = document.getElementById("goal-percentage").value;

    if (!description || !targetPercentage) {
      alert("Please fill in all fields");
      return;
    }

    const goal = {
      id: Date.now(),
      category,
      description,
      targetPercentage: parseInt(targetPercentage),
      achieved: false,
    };

    const goals = getGoals();
    goals.push(goal);
    saveGoals(goals);

    goalForm.reset();
    loadGoals();
  }

  function loadGoals() {
    const goals = getGoals();
    goalsList.innerHTML = "";

    goals.forEach((goal) => {
      const goalElement = createGoalElement(goal);
      goalsList.appendChild(goalElement);
    });

    updateGoalProgress();
  }

  function createGoalElement(goal) {
    const goalItem = document.createElement("div");
    goalItem.classList.add("goal-item");
    if (goal.achieved) goalItem.classList.add("goal-achieved");

    goalItem.innerHTML = `
      <div class="goal-info">
        <div class="goal-category">${goal.category}</div>
        <div class="goal-description">${goal.description}</div>
      </div>
      <div class="goal-progress">
        <span class="progress-text">0% / ${goal.targetPercentage}%</span>
        ${
          goal.achieved
            ? '<span class="achievement-badge">Achieved!</span>'
            : ""
        }
      </div>
    `;

    return goalItem;
  }

  function updateGoalProgress() {
    const goals = getGoals();
    goals.forEach((goal) => {
      const currentStat = getStat(goal.category);
      const progressPercentage = (currentStat / goal.targetPercentage) * 100;
      const goalElement = document.querySelector(
        `.goal-item:nth-child(${goals.indexOf(goal) + 1})`
      );
      const progressText = goalElement.querySelector(".progress-text");

      progressText.textContent = `${currentStat}% / ${goal.targetPercentage}%`;

      if (currentStat >= goal.targetPercentage && !goal.achieved) {
        goal.achieved = true;
        goalElement.classList.add("goal-achieved");
        goalElement.querySelector(".goal-progress").innerHTML +=
          '<span class="achievement-badge">Achieved!</span>';
        saveGoals(goals);
      }
    });
  }

  function getGoals() {
    return JSON.parse(localStorage.getItem("goals")) || [];
  }

  function saveGoals(goals) {
    localStorage.setItem("goals", JSON.stringify(goals));
  }

  function getStat(category) {
    return parseInt(localStorage.getItem(`${category}-stat`)) || 0;
  }

  setInterval(updateGoalProgress, 5000);
});
