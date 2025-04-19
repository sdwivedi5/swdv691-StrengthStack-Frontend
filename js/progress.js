// frontend/js/progress.js
 

 // Get user ID from URL
 const urlParams = new URLSearchParams(window.location.search);
 const userId = urlParams.get('userId');
 

 // DOM elements
 const progressChartCtx = document.getElementById('progressChart').getContext('2d');
 const progressDataDiv = document.getElementById('progress-data');
 const messageDiv = document.getElementById('message');
 const userGreetingDiv = document.getElementById('user-greeting'); // New element
 

 let progressChart; // Store chart instance globally
 

 // Function to fetch and display progress data
 async function fetchAndDisplayProgress() {
  try {
  const response = await fetch(`progress?userId=${userId}`); // Adjust URL as needed
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const progressData = await response.json();
 

  if (progressData.length === 0) {
  messageDiv.textContent = 'No progress data available for this user.';
  progressDataDiv.innerHTML = '<p>No data to display.</p>';
  return;
  }
 

  // *** Fetch user data to get username for the greeting ***
  try {
  const userResponse = await fetch(`/users/${userId}`);
  if (!userResponse.ok) {
  throw new Error(`HTTP error! Status: ${userResponse.status}`);
  }
  const user = await userResponse.json();
  userGreetingDiv.textContent = `Hello ${user.username}, you have made great progress to your health. Please refer to the chart and make adjustments to your workouts.`;
  } catch (userError) {
  console.error('Error fetching user data for greeting:', userError);
  userGreetingDiv.textContent = "Error loading user greeting."; //  Fallback message
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
  if (!data || data.length === 0) {
  console.warn('No data to render chart.');
  return; // Exit if no data
  }
 

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
  type: 'time', // Ensure X-axis treats labels as dates
  time: {
  unit: 'day' // Adjust as needed (day, week, month)
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
  drawOnChartArea: false // Don't draw gridlines for this axis
  }
  },
  ]
  },
  tooltips: { // Customize tooltips (optional)
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
  const table = document.createElement('table');
  const thead = table.createTHead();
  const tbody = table.createTBody();

  let row = thead.insertRow();
  let cell = row.insertCell();
  cell.textContent = 'Date';
  cell = row.insertCell();
  cell.textContent = 'Reps';
  cell = row.insertCell();
  cell.textContent = 'Weight (lbs)';
  cell = row.insertCell();
  cell.textContent = 'Estimated 1RM (lbs)';

  data.forEach(item => {
    row = tbody.insertRow();
    cell = row.insertCell();
    cell.textContent = item.date;
    cell = row.insertCell();
    cell.textContent = item.reps;
    cell = row.insertCell();
    cell.textContent = item.weight;
    cell = row.insertCell();
    cell.textContent = item.estimatedonerepmax;
  });

  progressDataDiv.innerHTML = ''; // Clear previous content
  progressDataDiv.appendChild(table);
} 

 // Initial fetch and display
 fetchAndDisplayProgress();
