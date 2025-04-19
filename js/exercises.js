// DOM elements
 const exerciseListDiv = document.getElementById('exercise-list');
 const addExerciseForm = document.getElementById('add-exercise-form');
 const editExerciseForm = document.getElementById('edit-exercise-form');
 const editExerciseFormInner = document.getElementById('edit-exercise-form-inner');
 const messageDiv = document.getElementById('message');
 const deleteExerciseButton = document.getElementById('delete-exercise-button'); // Corrected ID
 const showAddExerciseFormButton = document.getElementById('show-add-exercise-button'); // Corrected ID
 
const navMyProfileLink = document.getElementById('nav-my-profile');

if (navMyProfileLink) {
  navMyProfileLink.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("Navigating to My Profile with userId:", userId); // ADD THIS LINE
    window.location.href = `/users.html?id=${userId}`;
  });
} else {
  console.error('Error: Element with id "nav-my-profile" not found!');
}


 let editingExerciseId = null;
 

 // Function to fetch and display all exercises
 async function fetchAndDisplayExercises() {
  try {
  const response = await fetch('/exercises');
  const exercises = await handleFetchResponse(response);
 

  let exerciseListHTML = '<ul>';
  exercises.forEach(exercise => {
  exerciseListHTML += `
  <li>
  ${exercise.name} (${exercise.musclegroup || 'N/A'})
  - <a href="#" data-exerciseid="${exercise.exerciseid}" class="edit-link">Edit</a>
  </li>
  `;
  });
  exerciseListHTML += '</ul>';
  exerciseListDiv.innerHTML = exerciseListHTML;
 

  // Attach event listeners to edit links
  const editLinks = document.querySelectorAll('.edit-link');
  editLinks.forEach(link => {
  link.addEventListener('click', handleEditLinkClick);
  });
  } catch (error) {
  console.error('Error fetching exercises:', error);
  messageDiv.innerHTML = `<p class="error">Failed to fetch exercises.</p>`;
  }
 }
 

 // Function to handle form submission for adding a new exercise
 async function handleAddExerciseFormSubmit(event) {
  event.preventDefault();
 

  const newExercise = {
  name: addExerciseForm.name.value,
  musclegroup: addExerciseForm.musclegroup.value
  };
 

  try {
  const response = await fetch('/exercises', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  body: JSON.stringify(newExercise)
  });
 

  if (response.ok) {
  messageDiv.textContent = 'Exercise added successfully!';
  addExerciseForm.reset();
  fetchAndDisplayExercises();
  } else {
  const error = await response.json();
  messageDiv.textContent = `Failed to add exercise: ${error.message || 'Unknown error'}`;
  }
  } catch (error) {
  console.error('Error adding exercise:', error);
  messageDiv.textContent = 'Error adding exercise.';
  }
 }
 

 // Function to handle clicking on an edit link
 async function handleEditLinkClick(event) {
  event.preventDefault();
  editingExerciseId = event.target.dataset.exerciseid;
 

  try{
  const response = await fetch(`/exercises/${editingExerciseId}`);
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const exercise = await response.json();
  document.getElementById('edit-name').value = exercise.name;
  document.getElementById('edit-musclegroup').value = exercise.musclegroup;
  editExerciseForm.style.display = 'block';
  deleteExerciseButton.style.display = 'block';
  } catch(error){
  console.error("Error fetching exercise data", error);
  messageDiv.textContent = "Error fetching exercise data";
  }
 }
 

 // Function to handle form submission for updating an exercise
 async function handleEditExerciseFormSubmit(event){
  event.preventDefault();
 

  const updatedExercise = {
  name: editExerciseFormInner.name.value,
  musclegroup: editExerciseFormInner.musclegroup.value
  }
  try {
  const response = await fetch(`/exercises/${editingExerciseId}`,{
  method: 'PUT',
  headers: {
  'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedExercise)
  });
  if(response.ok){
  messageDiv.textContent = "Exercise updated successfully";
  editExerciseForm.style.display = 'none';
  deleteExerciseButton.style.display = 'none';
  fetchAndDisplayExercises();
  } else {
  const error = await response.json();
  messageDiv.textContent = `Failed to update exercise: ${error.message || 'Unknown error'}`;
  }
  } catch(error){
  console.error('Error updating exercise', error);
  messageDiv.textContent = "Error updating exercise";
  }
 }
 

 // Function to handle deleting an exercise
 async function handleDeleteExercise(){
  if (confirm('Are you sure you want to delete this exercise?')) {
  try {
  const response = await fetch(`/exercises/${editingExerciseId}`, {
  method: 'DELETE'
  });
 

  if (response.ok) {
  messageDiv.textContent = 'Exercise deleted successfully!';
  editExerciseForm.style.display = 'none';
  deleteExerciseButton.style.display = 'none';
  fetchAndDisplayExercises();
  } else {
  const error = await response.json();
  alert(`Failed to delete exercise: ${error.message || 'Unknown error'}`);
  }
  } catch (error) {
  console.error('Error deleting exercise:', error);
  alert('Error deleting exercise.');
  }
  }
 }
 

 // Event Listeners
 addExerciseForm.addEventListener('submit', handleAddExerciseFormSubmit);
 editExerciseFormInner.addEventListener('submit', handleEditExerciseFormSubmit);
 deleteExerciseButton.addEventListener('click', handleDeleteExercise);
 showAddExerciseFormButton.addEventListener('click', () => {
  editExerciseForm.style.display = 'none';
  deleteExerciseButton.style.display = 'none';
 });
 

 // Initial fetch and display
 fetchAndDisplayExercises();
