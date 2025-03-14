document.addEventListener('DOMContentLoaded', function () {
    AOS.init(); // Initialize AOS animations

    // RSVP Button and Form functionality
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');

    if (rsvpButton && rsvpForm) {
        rsvpButton.addEventListener('click', function () {
            if (rsvpForm.style.display === 'none' || rsvpForm.style.display === '') {
                rsvpForm.style.display = 'block';  // Show the form
                rsvpButton.style.display = 'none'; // Hide the RSVP button
            }
        });
    }

    // Countdown Timer
    function updateCountdown() {
        const weddingDate = new Date("August 2, 2025 00:00:00").getTime();
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;

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

    // Navbar functionality (for smooth transitions between sections)
    const tabs = document.querySelectorAll('.navbar .tab');
    const contents = document.querySelectorAll('.content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            const target = event.target.getAttribute('data-target');

            // Hide all content sections
            contents.forEach(content => content.style.display = 'none');
            // Remove active class from all tabs
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show the clicked content section
            document.getElementById(target).style.display = 'block';
            event.target.classList.add('active');
        });
    });

    // Initialize the first section to be visible
    document.getElementById('home').style.display = 'block';


    window.addEventListener('scroll', () => {
        const images = document.querySelectorAll('.photo-gallery img');
        const windowHeight = window.innerHeight;
      
        images.forEach(image => {
          const imageTop = image.getBoundingClientRect().top;
          if (imageTop < windowHeight - 150) {
            image.classList.add('visible');
          }
        });
      });
      


});
