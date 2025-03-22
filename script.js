document.addEventListener('DOMContentLoaded', function () {
    AOS.init(); // Initialize AOS animations

    // RSVP Button and Form functionality
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');
    const guestNameInput = document.getElementById("guest-name");
    const numGuestsDropdown = document.getElementById("guest-count");
    const errorMessage = document.getElementById("error-message");

    // Load guest list
    let guestList = [];
    fetch("guest_list.json")
        .then(response => response.json())
        .then(data => guestList = data)
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
            document.getElementById(target).style.display = 'block';
            this.classList.add('active');
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
        const hero = document.querySelector(".hero-section::before");
        let scrollY = window.scrollY;

        if (hero) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        handleScrollEffects();
        updateParallax();
    });

    handleScrollEffects(); // Run on load in case images are already in view

    // Match guest name and set max guests allowed
    guestNameInput.addEventListener("input", function () {
        const enteredName = this.value.toLowerCase().trim();
        const matchedGuest = guestList.find(guest => guest.name.toLowerCase() === enteredName);

        if (matchedGuest) {
            errorMessage.style.display = "none";
            numGuestsDropdown.innerHTML = "";

            for (let i = 1; i <= matchedGuest.max_guests; i++) {
                let option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                numGuestsDropdown.appendChild(option);
            }

            numGuestsDropdown.disabled = false;
        } else {
            numGuestsDropdown.innerHTML = "<option value='1'>1</option>";
            numGuestsDropdown.disabled = true;
            errorMessage.style.display = "block";
        }
    });

    // RSVP Form Submission (Lock RSVP)
    const rsvpFormElement = document.getElementById("rsvp-form");

    rsvpFormElement.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent actual form submission

        const guestName = guestNameInput.value.trim();
        if (!guestList.some(guest => guest.name.toLowerCase() === guestName.toLowerCase())) {
            alert("Sorry, your name is not on the guest list.");
            return;
        }

        localStorage.setItem("userRSVP", "true"); // Store RSVP status
        alert("Thank you for your RSVP!");
        rsvpForm.style.display = 'none';
    });
});
