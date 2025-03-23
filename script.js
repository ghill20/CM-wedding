document.addEventListener('DOMContentLoaded', function () {
    AOS.init(); // Initialize AOS animations

    // RSVP Button and Form functionality
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');
    const guestNameInput = document.getElementById("guest-name");
    const numGuestsDropdown = document.getElementById("guest-count");
    const rsvpDropdown = document.getElementById("rsvp-dropdown"); // Yes/No RSVP dropdown
    const errorMessage = document.getElementById("error-message");

    // Load guest list
    let guestList = [];
    fetch("guests.json")
        .then(response => response.json())
        .then(data => {
            guestList = data;
            console.log("Guest List:", guestList); // Log the guest list to see it
        })
        .catch(error => console.error("Error loading guest list:", error));

    // Check if the user has already RSVP'd
    const userRSVP = localStorage.getItem("userRSVP");
    if (userRSVP) {
        if (rsvpButton) rsvpButton.style.display = 'none';
        if (rsvpForm) rsvpForm.style.display = 'none';
    }

    if (rsvpButton && rsvpForm) {
        rsvpButton.addEventListener('click', function () {
            rsvpForm.style.display = 'block';
            rsvpButton.style.display = 'none';
        });
    }

    // Countdown Timer
    function updateCountdown() {
        const weddingDate = new Date("August 2, 2025 00:00:00").getTime();
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;

        if (timeLeft <= 0) {
            document.getElementById("countdown").textContent = "The big day is here!";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initialize on load

    // Navbar functionality (for smooth transitions between sections)
    const tabs = document.querySelectorAll('.navbar .tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
    
            // Hide all content sections & remove active class from tabs
            contents.forEach(content => content.style.display = 'none');
            tabs.forEach(tab => tab.classList.remove('active'));
    
            // Show selected section & highlight active tab
            const targetSection = document.getElementById(target);
            targetSection.style.display = 'block';
            this.classList.add('active');
    
            // Reload map section if coming back to home
            if (target === 'home') {
                const iframe = document.getElementById("google-map");
                if (iframe) {
                    iframe.src = iframe.src;  // Reload the iframe
                }
            }
        });
    });    

    // Ensure the first section is visible initially
    document.getElementById('home').style.display = 'block';

    // Scroll-based effects (Image fade-in and parallax)
    function handleScrollEffects() {
        const images = document.querySelectorAll('.photo-gallery img');
        const windowHeight = window.innerHeight;

        // Image fade-in effect
        images.forEach(image => {
            const imageTop = image.getBoundingClientRect().top;
            if (imageTop < windowHeight - 150) {
                image.classList.add('visible');
            }
        });
    }

    function updateParallax() {
        const hero = document.querySelector(".hero-section");
        let scrollY = window.scrollY;
    
        // Check if we're on mobile or desktop
        if (hero) {
            if (window.innerWidth <= 600) {
                // On mobile, simulate parallax by adjusting the background position based on scroll
                hero.style.backgroundPosition = 'center ' + (scrollY * 0.2) + 'px'; // Adjust the multiplier to control the parallax effect
            } else {
                // On desktop, use fixed background attachment
                hero.style.backgroundPosition = 'center 25%';
            }
        }
    }
    

    window.addEventListener('scroll', () => {
        handleScrollEffects();
        updateParallax(); // Call the parallax function during scroll
    });

    handleScrollEffects(); // Run on load in case images are already in view
    // Run on load to set the initial background position
    updateParallax();

    if (guestNameInput) {
        guestNameInput.addEventListener("input", function () {
            const enteredName = this.value.toLowerCase().trim().replace(/,/g, '');  // Remove commas
            console.log("Entered Name:", enteredName);  // Log entered name
    
            if (enteredName === "") {
                numGuestsDropdown.innerHTML = "<option value=''>Select guests</option>";
                numGuestsDropdown.disabled = true;
                if (errorMessage) {
                    errorMessage.style.display = "none";
                }
                return;
            }
    
            // Ensure the guest list is available and all guest objects have a 'name' property
            const matchedGuest = guestList.find(guest => guest.name && guest.name.toLowerCase().replace(/,/g, '') === enteredName);  // Remove commas in guest name
            console.log("Matched Guest:", matchedGuest);  // Log matched guest
    
            if (matchedGuest) {
                if (errorMessage) {
                    errorMessage.style.display = "none";  // Hide error message
                }
                numGuestsDropdown.innerHTML = "<option value=''>Select guests</option>";  // Reset options
    
                // Populate dropdown with the allowed number of guests
                for (let i = 1; i <= matchedGuest.max_guests; i++) {
                    let option = document.createElement("option");
                    option.value = i;
                    option.textContent = i;
                    numGuestsDropdown.appendChild(option);
                }
    
                numGuestsDropdown.disabled = false;  // Enable the dropdown
            } else {
                numGuestsDropdown.innerHTML = "<option value='1'>1</option>";  // Default option
                numGuestsDropdown.disabled = true;  // Disable the dropdown
                if (errorMessage) {
                    errorMessage.style.display = "block";  // Show error message
                }
            }
        });
    }
    

    // RSVP Form Submission (Lock RSVP)
    const rsvpFormElement = document.getElementById("rsvp-form");

    rsvpFormElement.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent actual form submission

        const guestName = guestNameInput.value.trim();
        console.log("Guest Name (on submit):", guestName);  // Log the guest name on submit

        if (!guestList.some(guest => guest.name.toLowerCase() === guestName.toLowerCase())) {
            alert("Sorry, your name is not on the guest list.");
            return;
        }

        localStorage.setItem("userRSVP", "true"); // Store RSVP status
        alert("Thank you for your RSVP!");
        rsvpForm.style.display = 'none'; // Hide the form after submission
    });
});
