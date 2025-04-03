document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll("input[required], select[required]");
    const errorSpans = form.querySelectorAll("span.text-danger");

    form.addEventListener("submit", function (event) {
        let isValid = true;
        inputs.forEach((input, index) => {
            if (!input.value.trim()) {
                event.preventDefault(); // Stop form submission
                errorSpans[index].textContent = "This field is required";
                errorSpans[index].style.display = "block";
                input.classList.add("is-invalid");
                isValid = false;
            } else {
                errorSpans[index].style.display = "none";
                input.classList.remove("is-invalid");
            }
        });

        if (!isValid) {
            return false;
        }
    });

    // Remove error when user starts typing
    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            if (input.value.trim()) {
                errorSpans[index].style.display = "none";
                input.classList.remove("is-invalid");
            }
        });
    });

});



