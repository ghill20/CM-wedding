document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const contentSections = document.querySelectorAll('.content');
    const homeDetails = document.getElementById('home-details');
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');
    const homeSection = document.getElementById('home');
    const guestNameInput = document.getElementById('guest-name');
    const guestCountDropdown = document.getElementById('guest-count');
    const suggestionsList = document.getElementById('suggestions');
    const scriptUrl = "https://script.google.com/macros/s/AKfycbxfCxvsuRFThv7PDvT1Q3hnHCOnzpy3koK0WskXexs/dev";
    let guestData = [];

    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 1000, once: true });
    } else {
        console.error("AOS library failed to load.");
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            contentSections.forEach(section => section.style.display = 'none');
            if (homeDetails) homeDetails.style.display = 'none';
            
            const targetId = tab.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) targetElement.style.display = 'block';

            if (targetId === 'home') {
                if (homeDetails) homeDetails.style.display = 'block';
                if (rsvpButton) rsvpButton.style.display = 'inline-block';
            } else {
                if (rsvpButton) rsvpButton.style.display = 'none';
            }

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Fetch guest list from guests.json
    async function fetchGuestList() {
        try {
            const response = await fetch('guests.json');  // Ensure guests.json is in the same directory
            const data = await response.json();
            guestData = data;  // Store the data in guestData
        } catch (error) {
            console.error("Error fetching guest list:", error);
        }
    }

    // Filter names based on input
    function filterNames() {
        const input = guestNameInput.value.trim().toLowerCase();
        suggestionsList.innerHTML = '';
        if (input.length === 0) return;

        guestData.forEach(guest => {
            if (guest.name.toLowerCase().includes(input)) {
                const li = document.createElement("li");
                li.textContent = guest.name;
                li.onclick = () => selectGuest(guest);  // Use the guest object
                suggestionsList.appendChild(li);
            }
        });
    }
    
    // When a guest is selected, show the dropdown for guest count
    function selectGuest(guest) {
        guestNameInput.value = guest.name;
        suggestionsList.innerHTML = ''; // Clear suggestions
        guestCountDropdown.innerHTML = ''; // Clear guest count dropdown
        guestCountDropdown.style.display = 'block';

        // Populate dropdown with the number of guests they can bring
        for (let i = 1; i <= guest.maxGuests; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            guestCountDropdown.appendChild(option);
        }
    }    

    guestNameInput.addEventListener('input', filterNames);  // Filter names when typing

    if (rsvpButton && rsvpForm) {
        rsvpButton.addEventListener('click', function() {
            rsvpButton.style.display = 'none';
            rsvpForm.style.display = 'block';
        });
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const guestName = guestNameInput.value.trim();
            const guestCount = guestCountDropdown.value.trim();
    
            if (!guestName || !guestCount) {
                alert("Error: Please fill out both fields.");
                return;
            }
    
            submitButton.textContent = "Submitting...";
            submitButton.disabled = true;
    
            fetch(scriptUrl, {
                method: "POST",
                body: JSON.stringify({ name: guestName, attendees: guestCount }),
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.text())
            .then(data => {
                console.log("Response from Google Sheets:", data);
                rsvpForm.style.display = 'none';
                const submittedMessage = document.createElement('p');
                submittedMessage.textContent = "Submitted!";
                submittedMessage.style.fontSize = "1.2rem";
                submittedMessage.style.fontWeight = "bold";
                submittedMessage.style.textAlign = "center";
                document.getElementById('rsvp-container').appendChild(submittedMessage);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            })
            .finally(() => {
                submitButton.textContent = "Submit RSVP";
                submitButton.disabled = false;
            });
        });
    }    

    fetchGuestList();  // Call fetch to load the guest data
});
