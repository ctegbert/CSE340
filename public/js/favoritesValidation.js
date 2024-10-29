// public/js/favoritesValidation.js
document.addEventListener("DOMContentLoaded", function () {
    const favoriteForms = document.querySelectorAll("form[data-favorite]");
    favoriteForms.forEach(form => {
        form.addEventListener("submit", function (event) {
            const invId = this.getAttribute("data-inv-id");
            if (!invId || isNaN(invId)) {
                alert("Invalid vehicle ID. Please try again.");
                event.preventDefault();
            }
        });
    });
});
