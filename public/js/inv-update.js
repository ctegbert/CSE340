// Target the form using the ID
const form = document.querySelector("#updateForm");

// Add an event listener for input events within the form
form.addEventListener("input", function () {
  // Target the button within the form using the 'button' tag
  const updateBtn = form.querySelector("button[type='submit']");
  updateBtn.removeAttribute("disabled");
});
