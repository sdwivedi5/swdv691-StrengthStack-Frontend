

// frontend/js/progress.js


 // Get user ID from URL
 const urlParams = new URLSearchParams(window.location.search);
 const userId = urlParams.get('userId');
console.log('User ID from URL:', userId); // Add this line


 // DOM elements
 const progressChartCtx = document
  .getElementById('progressChart')
  .getContext('2d');
 const progressDataDiv = document.getElementById('progress-data');
 const messageDiv = document.getElementById('message');


 let progressChart; // Store chart instance globally


 // Function to fetch and display progress data
 async function fetchAndDisplayProgress() {
  try {
  const response = await fetch(`/users/${userId}/progress`); // Adjust URL as needed
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const progressData = await response.json();


  if (progressData.length === 0) {
  messageDiv.textContent = 'No progress data available for this user.';
  progressDataDiv.innerHTML = '<p>No data to display.</p>';
  return;
  }


  renderChart(progressData);
  displayProgressData(progressData);
  } catch (error) {
  console.error('Error fetching progress data:', error);
  messageDiv.textContent = 'Error fetching progress data.';
  }
 }


 // Function to render the chart
 function renderChart(data) {
  const labels = data.map(item => item.date);
  const weightData = data.map(item => item.weight);
  const oneRepMaxData = data.map(item => item.estimatedonerepmax);


  if (progressChart) {
  progressChart.destroy(); // Destroy previous chart if it exists
  }


  progressChart = new Chart(progressChartCtx, {
  type: 'line',
  data: {
  labels: labels,
  datasets: [{
  label: 'Weight (lbs)',
  data: weightData,
  borderColor: 'rgba(75, 192, 192, 1)',
  fill: false,
  yAxisID: 'y1'
  },
  {
  label: 'Estimated 1RM (lbs)',
  data: oneRepMaxData,
  borderColor: 'rgba(192, 75, 75, 1)',
  fill: false,
  yAxisID: 'y2'
  }
  ]
  },
  options: {
  responsive: true,
  title: {
  display: true,
  text: 'Your Progress Over Time'
  },
  scales: {
  xAxes: [{
  display: true,
  scaleLabel: {
  display: true,
  labelString: 'Date'
  },
  type: 'time',  //  Ensure X-axis treats labels as dates
  time: {
  unit: 'month'  //  Adjust as needed (day, week, month)
  }
  }],
  yAxes: [{
  id: 'y1',
  type: 'linear',
  position: 'left',
  title: {
  display: true,
  labelString: 'Weight (lbs)'
  }
  },
  {
  id: 'y2',
  type: 'linear',
  position: 'right',
  title: {
  display: true,
  labelString: 'Estimated 1RM (lbs)'
  },
  gridLines: {
  drawOnChartArea: false, //  Don't draw gridlines for this axis
  }
  },
  ]
  },
  tooltips: {  //  Customize tooltips (optional)
  mode: 'index',
  intersect: false
  },
  hover: {
  mode: 'nearest',
  intersect: true
  }
  }
  });
 }


 function displayProgressData(data) {
  let tableHTML = '<table>';
  tableHTML += '<thead><tr><th>Date</th><th>Reps</th><th>Weight (lbs)</th><th>Estimated 1RM (lbs)</th></tr></thead><tbody>';
  data.forEach(item => {
  tableHTML += `
  <tr>
  <td><span class="math-inline">\{item\.date\}</td\>
<td\></span>{item.reps}</td>
  <td><span class="math-inline">\{item\.weight\}</td\>
<td\></span>{item.estimatedonerepmax}</td>
  </tr>
  `;
  });
  tableHTML += '</tbody></table>';
  progressDataDiv.innerHTML = tableHTML;
 }


 // Initial fetch and display
 fetchAndDisplayProgress();
