const MAX_DATA_VISUALIZED = 10;
const chartContainer = document.getElementById('chart-container');
const select = document.getElementById('rxt-viz-select');

let lastLoadedStats = null;
let chartEl = null;
const stabilimenti = new Map();


initChartContainer();

getStatsUtentiCorse()
  .then((stats) => getUserCorseChart(stats));


function initChartContainer() {
  chartContainer.innerHTML = `<div class="spinner"></div>`;
  getRifiutiStorageStats().then((stats) => {
    lastLoadedStats = stats;
    initSelect(stats);
    chartContainer.innerHTML = `<canvas id="rifiuti-x-tipologie"></canvas>`;
    initChart(stats);
    showTotalWeight(stats);
    showProcessedWeight(stats);
  });
}

function initSelect(stats) {
  addOption(0, "Tutti gli stabilimenti", select);
  stats.map(item => ({
    cod: item.comune+'|'+item.zona+'|'+item.stabilimento_cod,
    des: item.stabilimento_des
  })).forEach(x => stabilimenti.set(x.cod, x.des));
  stabilimenti.entries().forEach(e => addOption(e[0], e[1], select));
}

function initChart(stats) {
  const ctx = document.getElementById('rifiuti-x-tipologie');
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
  chartEl = new Chart(ctx, chartConfig);
}

function showTotalWeight(stats) {
  const pesoTotParag = document.getElementById('peso-totale');
  const w = stats.reduce((acc, item) => acc + item.peso_totale, 0).toFixed(2);
  pesoTotParag.innerHTML = `Il peso totale dei rifiuti è di ${w} kg`;
}

function showProcessedWeight(stats) {
  const pesoTotParag = document.getElementById('peso-smaltiti');
  const w = stats.filter(r => r.smaltito).reduce((acc, item) => acc + item.peso_totale, 0).toFixed(2);
  pesoTotParag.innerHTML = `Il peso totale dei rifiuti smaltiti è di ${w} kg`;
}

function filterData() {
  const value = select.value;
  let toViz = lastLoadedStats
  if (value != 0) {
    toViz = lastLoadedStats.filter(item => item.comune+'|'+item.zona+'|'+item.stabilimento_cod === value);
  }
  chartEl.destroy();
  initChart(toViz);
  showTotalWeight(toViz);
  showProcessedWeight(toViz);
}

function getUserCorseChart(stats) {
  console.log(stats);
  const ctx = document.getElementById('user-chart');
  const names = stats.map(x => x.firstname + ' ' + x.lastname);
  const chartConfig = {
    type: 'bar',
    data: {
      labels: names,
      datasets: [
        { label: 'corse eseguite', data: stats.map(x => x.count), backgroundColor: '#0E3D27FF' },
        { label: 'corse guidate', data: stats.map(x => x.guidate), backgroundColor: '#0E3D27B3' },
        { label: 'corse operate', data: stats.map(x => x.operate), backgroundColor: '#0E3D2763' },
      ]  
    }
  }
  new Chart(ctx, chartConfig);
}
