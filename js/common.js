//  frontend/js/common.js (Helper functions)
 

 //  A basic function to handle common fetch errors and JSON parsing
 async function handleFetchResponse(response) {
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
 }
