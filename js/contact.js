document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic Validation
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader"></span> Sending...';
        result.innerHTML = '';
        result.className = 'form-result';

        // Send data to Web3Forms
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "Message sent successfully!";
                    result.classList.add('success');
                    form.reset();
                } else {
                    console.log(response);
                    result.innerHTML = json.message;
                    result.classList.add('error');
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Something went wrong. Please try again later.";
                result.classList.add('error');
            })
            .finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Clear success message after 5 seconds
                if (result.classList.contains('success')) {
                    setTimeout(() => {
                        result.innerHTML = '';
                        result.className = 'form-result';
                    }, 5000);
                }
            });
    });
});
