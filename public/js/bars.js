document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    "Contests",
    "Language study",
    "Major study",
    "Networking",
    "Reading",
  ];

  const statBars = document.getElementById("statBars");

  categories.forEach((category) => {
    const stat = getStat(category);

    const barContainer = document.createElement("div");
    barContainer.classList.add("stat-bar");

    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = category;

    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = `${stat}%`;
    progressBar.textContent = `+${stat}%`;

    const percentage = document.createElement("div");
    percentage.classList.add("percentage");
    percentage.textContent = `${stat}%`;

    progressContainer.appendChild(progressBar);
    barContainer.appendChild(label);
    barContainer.appendChild(progressContainer);
    barContainer.appendChild(percentage);

    statBars.appendChild(barContainer);
  });
});

function getStat(category) {
  const stat = localStorage.getItem(`${category}-stat`);
  return stat ? parseInt(stat, 10) : 0;
}
