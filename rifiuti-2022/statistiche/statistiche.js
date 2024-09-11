const MAX_DATA_VISUALIZED = 10;
const chartContainer = document.getElementById('chart-container');

const chartConfig = {
  type: 'doughnut',
  options: {
    elements: {
      arc: {
        backgroundColor: ['#0E3D27FF', '#0E3D27DB', '#0E3D27B3', '#0E3D278B', '#0E3D2763', '#0E3D273B'],
        borderColor: '#F2F5E6'
      }
    }
  },
  data: {}
}





initChartContainer();



function initChartContainer() {
  chartContainer.innerHTML = `<div class="spinner"></div>`;
  getRifiutiStorageStats().then((stats) => {
    console.log(stats);
    chartContainer.innerHTML = `<canvas id="rifiuti-x-tipologie"></canvas>`;
    initChart(stats);
  });
}

function initChart(stats) {
  const ctx = document.getElementById('rifiuti-x-tipologie');
  let cat = new Map();
  stats.forEach(item => {
    cat.set(item.tipologia_des, (cat.get(item.tipologia_des) || 0) + item.peso_totale);
  });
  const sorted = [...cat.entries()]
    .sort((e1, e2) => e2[1] - e1[1])
    .slice(0, MAX_DATA_VISUALIZED);
  cat = new Map(sorted);

  chartConfig.data = {
    labels: [...cat.keys()],
    datasets: [{
      label: ' kg',
      data: [...cat.values()]
    }]  
  }
  new Chart(ctx, chartConfig);
}


