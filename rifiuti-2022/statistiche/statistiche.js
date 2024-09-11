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



initChart();





function initChart() {
  const ctx = document.getElementById('rifiuti-x-tipologie');
  chartConfig.data = {
    labels: ['Organico', 'Carta', 'Vetro', 'Plastica', 'Indifferenziata'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3]
    }]  
  }
  new Chart(ctx, chartConfig);
}
