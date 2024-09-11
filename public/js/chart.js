function updateChart() {
  const ctx = document.getElementById("statsChart").getContext("2d");
  const categories = [
    "Contests",
    "Language study",
    "Major study",
    "Networking",
    "Reading",
  ];
  const data = categories.map((category) => {
    const stat = getStat(category);
    return stat ? parseInt(stat, 10) : 0;
  });

  if (window.myChart) {
    window.myChart.destroy(); // 기존 차트를 제거하여 중복 생성 방지
  }

  window.myChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "활동 스탯",
          data: data,
          backgroundColor: "rgba(255, 105, 180, 0.2)",
          borderColor: "rgba(255, 105, 180, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255, 105, 180, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255, 105, 180, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 10, // 스케일을 10 단위로 설정하여 작은 값도 적절히 표시되도록 함
          showLabelBackdrop: false,
          backdropColor: "rgba(255, 255, 255, 0)",
          callback: function (value) {
            return value + "%"; // % 단위를 추가하여 표시
          },
        },
        angleLines: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          fontSize: 14,
          fontColor: "#4b0082",
        },
      },
      legend: {
        position: "top",
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            const label = data.labels[tooltipItem.index];
            const value = data.datasets[0].data[tooltipItem.index];
            return `${label}: ${value}%`;
          },
        },
      },
    },
  });
}
