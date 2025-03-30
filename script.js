document.addEventListener('DOMContentLoaded', function () {
    AOS.init(); // Initialize AOS animations

    // RSVP Button and Form functionality
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');
    const guestNameInput = document.getElementById("guest-name");
    const numGuestsDropdown = document.getElementById("guest-count");
    const rsvpDropdown = document.getElementById("rsvp-dropdown"); // Yes/No RSVP dropdown
    const autocompleteList = document.getElementById("autocomplete-list");


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
                hero.style.backgroundPosition = 'center ' + (scrollY * 0.5) + 'px'; // Adjust multiplier for the effect
            } else {
                // On desktop, set fixed background position (using CSS fixed background attachment)
                hero.style.backgroundPosition = 'center 25%';
            }
        }
    }

    // Throttle scroll event to improve performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(() => {
                handleScrollEffects();
                updateParallax(); // Call the parallax function during scroll
                isScrolling = false;
            });
        }
    });

    // Run on load in case images are already in view
    handleScrollEffects();
    // Run on load to set the initial background position
    updateParallax();

    if (guestNameInput) {
        guestNameInput.addEventListener("input", function () {
            const enteredName = this.value.toLowerCase().trim();
            autocompleteList.innerHTML = '';
    
            if (enteredName === "") {
                numGuestsDropdown.innerHTML = "<option value=''>Select guests</option>";
                numGuestsDropdown.disabled = true;
                return;
            }
    
            const matchedGuests = [];
            const seenNames = new Set();
            
            guestList.forEach(guest => {
              const guestName = guest["guest-name"];
              const lowerName = guestName.toLowerCase();
              
              if (lowerName.includes(enteredName) && !seenNames.has(lowerName)) {
                matchedGuests.push(guest);
                seenNames.add(lowerName);
              }
            });
            
            matchedGuests.splice(5); // Limit to 5 suggestions
            
    
            if (matchedGuests.length > 0) {
                matchedGuests.forEach(guest => {
                    const li = document.createElement("li");
                    li.textContent = guest["guest-name"];
        
                    li.addEventListener("click", function () {
                        // Fill in the input
                        guestNameInput.value = guest["guest-name"];
                        autocompleteList.innerHTML = ''; // Hide suggestions
        
                        // Populate guest count dropdown
                        numGuestsDropdown.innerHTML = "<option value=''>Select guests</option>";
                        const maxGuests = parseInt(guest["num-resp"]);
        
                        for (let i = 1; i <= maxGuests; i++) {
                            let option = document.createElement("option");
                            option.value = i;
                            option.textContent = i;
                            numGuestsDropdown.appendChild(option);
                        }
        
                        numGuestsDropdown.disabled = false;
                    });
        
                    autocompleteList.appendChild(li);
                });
            }
        });
    }

    // // RSVP Form Submission (Lock RSVP)
    // const rsvpFormElement = document.getElementById("rsvp-form");

    // rsvpFormElement.addEventListener("submit", function (event) {
    //     event.preventDefault(); // Prevent default form submission
        
    //     const guestName = guestNameInput.value.trim();
    //     console.log("Guest Name (on submit):", guestName);  // Log the guest name on submit
    
    //     // Ensure the guest list is available
    //     if (!guestList || guestList.length === 0) {
    //         alert("The guest list is not available at the moment. Please try again later.");
    //         return;
    //     }
    
    //     // Check if the entered guest name exists in the guest list
    //     const matchedGuest = guestList.find(guest => guest["guest-name"] && guest["guest-name"].toLowerCase() === guestName.toLowerCase());
        
    //     if (!matchedGuest) {
    //         alert("Sorry, your name is not on the guest list.");
    //         return;
    //     }
    
    //     // Store the RSVP in local storage (to prevent further submissions)
    //     localStorage.setItem("userRSVP", "true"); // Store RSVP status
        
    //     // If valid, submit the form (this will send data to Google Sheets)
    //     this.submit();  // Manually submit the form after validation
        
    //     rsvpForm.style.display = 'none'; // Hide the form after submission
    // });

    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        loop: true, // Set to true if you want autoplay to loop
      
        autoplay: {
          delay: 7000,             // 3 seconds between slides
          disableOnInteraction: false, // Keeps autoplay going even after user clicks
        },
      
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            const labels = ['Welcome Drinks', 'Ceremony', 'Reception'];
            return `
              <div class="custom-bullet-wrapper">
                <span class="${className}"></span>
                <p class="custom-label">${labels[index]}</p>
              </div>`;
          }
        }
      });
      
      
});
