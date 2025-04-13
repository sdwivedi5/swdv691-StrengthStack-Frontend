// Get user ID from URL
 const urlParams = new URLSearchParams(window.location.search);
 const userId = urlParams.get('id');
 

 const userDetailsDiv = document.getElementById('user-details');
 const editButton = document.getElementById('edit-user');
 const editFormDiv = document.getElementById('edit-form');
 const updateUserForm = document.getElementById('update-user-form');
 const deleteButton = document.getElementById('delete-user');
 

 // New DOM elements for navigation
 const navMyWorkoutsLink = document.getElementById('nav-my-workouts');
 const navMyProgressLink = document.getElementById('nav-my-progress');
 

 async function fetchAndDisplayUser() {
  //debugger; // Add this line
 

  try {
  const response = await fetch(`/users/${userId}`);
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const user = await response.json();
  console.log('Fetched user data:', user); // Add this
  //debugger; // Add this for breakpoint
  userDetailsDiv.innerHTML = `
  <h2>${user.username} Details</h2>
  <p>Email: ${user.email}</p>
  <p>Training Level: ${user.traininglevel}</p>
  <p>Goals: ${user.goals}</p>
  `;
 

  // Populate edit form
  document.getElementById('edit-username').value = user.username;
  document.getElementById('edit-email').value = user.email;
  document.getElementById('edit-trainingLevel').value = user.trainingLevel;
  document.getElementById('edit-goals').value = user.goals;
  } catch (error) {
  console.error('Error fetching user details:', error);
  userDetailsDiv.innerHTML = `<p class="error">Failed to fetch user details.</p>`;
  }
 }
 

 // Event listener for edit button
 editButton.addEventListener('click', () => {
  editFormDiv.style.display = 'block';
 });
 

 // Event listener for update form submission
 updateUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();
 

  const updatedUser = {
  username: updateUserForm.username.value,
  email: updateUserForm.email.value,
  trainingLevel: updateUserForm.trainingLevel.value,
  goals: updateUserForm.goals.value
  };
 

  try {
  const response = await fetch(`/users/${userId}`, {
  method: 'PUT',
  headers: {
  'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedUser)
  });
 

  if (response.ok) {
  fetchAndDisplayUser(); // Refresh user details
  editFormDiv.style.display = 'none'; // Hide form
  alert('User updated successfully!');
  } else {
  const error = await response.json();
  alert(`Failed to update user: ${error.message || 'Unknown error'}`);
  }
  } catch (error) {
  console.error('Error updating user:', error);
  alert('Error updating user.');
  }
 });
 

 // Event listener for delete button
 deleteButton.addEventListener('click', async () => {
  if (confirm('Are you sure you want to delete this user?')) {
  try {
  const response = await fetch(`/users/${userId}`, {
  method: 'DELETE'
  });
 

  if (response.ok) {
  alert('User deleted successfully!');
  window.location.href = '/index.html'; // Redirect to login or user list
  } else {
  const error = await response.json();
  alert(`Failed to delete user: ${error.message || 'Unknown error'}`);
  }
  } catch (error) {
  console.error('Error deleting user:', error);
  alert('Error deleting user.');
  }
  }
 });
 

 // Navigation event listeners
 if (navMyWorkoutsLink) {
  navMyWorkoutsLink.addEventListener('click', () => {
  window.location.href = `/workouts.html?userId=${userId}&view=mine`;
  });
 } else {
  console.error('Error: Element with id "nav-my-workouts" not found!');
 }
 

 if (navMyProgressLink) {
  navMyProgressLink.addEventListener('click', () => {
  window.location.href = `/progress.html?userId=${userId}&view=mine`;
  });
 } else {
  console.error('Error: Element with id "nav-my-progress" not found!');
 }
 

 // Initial fetch
 document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayUser();
 });
