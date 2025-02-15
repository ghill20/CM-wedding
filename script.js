document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const contentSections = document.querySelectorAll('.content');
    const homeDetails = document.getElementById('home-details');
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');
    const homeSection = document.getElementById('home'); // Home section

    // Initialize AOS (Animate on Scroll) if available
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            once: true,
        });
    } else {
        console.error("AOS library failed to load.");
    }

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();

            // Hide all content sections and home details
            contentSections.forEach(section => section.style.display = 'none');
            if (homeDetails) {
                homeDetails.style.display = 'none';
            }

            // Get target content and show it if it exists
            const targetId = tab.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.style.display = 'block';
            } else {
                console.error("No element found with id:", targetId);
            }

            // Show RSVP button only on the Home page
            if (targetId === 'home') {
                if (homeDetails) {
                    homeDetails.style.display = 'block';
                }
                if (rsvpButton) {
                    rsvpButton.style.display = 'inline-block';
                }
            } else {
                if (rsvpButton) {
                    rsvpButton.style.display = 'none';
                }
            }

            // Highlight the active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Live Countdown Timer
    function updateCountdown() {
        const weddingDate = new Date("August 2, 2025 16:00:00").getTime();
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = days.toString().padStart(2, '0');
            document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById("countdown").innerHTML = "🎉 It's Wedding Day! 🎉";
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // RSVP Button Click Logic: Hide button and show the form
    if (rsvpButton && rsvpForm) {
        rsvpButton.addEventListener('click', function() {
            rsvpButton.style.display = 'none'; // Hide the RSVP button
            rsvpForm.style.display = 'block';   // Show the RSVP form
        });
    }

    // RSVP Form Submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const guestName = document.getElementById('guest-name').value.trim();
            const guestCount = document.getElementById('guest-count').value.trim();
            const submitButton = rsvpForm.querySelector('button[type="submit"]');

            // Check for empty fields
            if (!guestName || !guestCount) {
                alert("Error: Please fill out both fields.");
                return;
            }

            // Disable the submit button and show loading text
            submitButton.textContent = "Submitting...";
            submitButton.disabled = true;

            // Send RSVP data to Google Sheets
            fetch("GOOGLE_SCRIPT_DEPLOYMENT_URL_HERE", {
                method: "POST",
                body: JSON.stringify({ name: guestName, attendees: guestCount }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.text())
            .then(data => {
                console.log("Response from Google Sheets:", data);
                // Hide the form and display a "Submitted" message
                rsvpForm.style.display = 'none';
                const submittedMessage = document.createElement('p');
                submittedMessage.textContent = "Submitted!";
                submittedMessage.style.fontSize = "1.2rem";
                submittedMessage.style.fontWeight = "bold";
                submittedMessage.style.textAlign = "center";
                // Append the message to the RSVP container
                const rsvpContainer = document.getElementById('rsvp-container');
                rsvpContainer.appendChild(submittedMessage);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            })
            .finally(() => {
                // Reset the submit button regardless of the outcome
                submitButton.textContent = "Submit RSVP";
                submitButton.disabled = false;
            });
        });
    }
});
