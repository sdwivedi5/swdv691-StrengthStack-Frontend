// Get userId and view from URL
 const urlParams = new URLSearchParams(window.location.search);
 const userId = urlParams.get('userId');
 const view = urlParams.get('view');
 

 // DOM elements
 const workoutListDiv = document.getElementById('workout-list');
 const addWorkoutForm = document.getElementById('add-workout-form');
 const addWorkoutFormInner = document.getElementById('add-workout-form-inner'); // New ID
 const messageDiv = document.getElementById('message');
 const showAddWorkoutFormButton = document.getElementById('show-add-workout-form'); // New button
 

 // Function to fetch and display workouts
 async function fetchAndDisplayWorkouts() {
  try {
  let url = '/workouts'; // Default: Get all workouts
  if (userId && view === 'mine') {
  url = `/users/${userId}/workouts`; // Assuming this backend route exists
  } else if (userId) {
  url = `/users/${userId}/workouts`; // Or whatever route you need
  }
  const response = await fetch(url);
  const workouts = await handleFetchResponse(response); // Use common error handling
 

  let workoutListHTML = '<ul>';
  workouts.forEach(workout => {
  workoutListHTML += `
  <li>
  Date: ${workout.date}, User ID: ${workout.userid}, Exercise ID: ${workout.exerciseid}
  - <a href="/workouts.html?id=${workout.workoutid}">View Details</a>
  </li>
  `;
  });
  workoutListHTML += '</ul>';
  workoutListDiv.innerHTML = workoutListHTML;
  } catch (error) {
  console.error('Error fetching workouts:', error);
  workoutListDiv.innerHTML = `<p class="error">Failed to fetch workouts.</p>`;
  }
 }
 

 // Function to handle form submission for creating a new workout
 async function handleAddWorkoutFormSubmit(event) {
  event.preventDefault();
 

  const newWorkout = {
  userid: parseInt(addWorkoutFormInner.userid.value), // Updated ID
  date: addWorkoutFormInner.date.value, // Updated ID
  exerciseid: parseInt(addWorkoutFormInner.exerciseid.value), // Updated ID
  sets: parseInt(addWorkoutFormInner.sets.value), // Updated ID
  reps: parseInt(addWorkoutFormInner.reps.value), // Updated ID
  weight: parseFloat(addWorkoutFormInner.weight.value), // Updated ID
  rir: parseInt(addWorkoutFormInner.rir.value), // Updated ID
  rpe: parseInt(addWorkoutFormInner.rpe.value) // Updated ID
  };
 

  try {
  const response = await fetch('/workouts', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  body: JSON.stringify(newWorkout)
  });
 

  if (response.ok) {
  messageDiv.textContent = 'Workout created successfully!';
  addWorkoutFormInner.reset(); // Updated ID
  fetchAndDisplayWorkouts(); // Refresh the workout list
  addWorkoutForm.style.display = 'none'; // Hide the form after submission
  } else {
  const error = await response.json();
  messageDiv.textContent = `Failed to create workout: ${error.message || 'Unknown error'}`;
  }
  } catch (error) {
  console.error('Error creating workout:', error);
  messageDiv.textContent = 'Error creating workout.';
  }
 }
 

 // Event Listeners
 addWorkoutForm.addEventListener('submit', handleAddWorkoutFormSubmit);
 showAddWorkoutFormButton.addEventListener('click', () => { // New listener
  addWorkoutForm.style.display = 'block'; // Show the form
  showAddWorkoutFormButton.style.display = 'none'; // Hide the button
 });
 

 // Initial fetch and display
 fetchAndDisplayWorkouts();
