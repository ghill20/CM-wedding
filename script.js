document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const contentSections = document.querySelectorAll('.content');
    const homeDetails = document.getElementById('home-details');
    const rsvpButton = document.getElementById('rsvp-button');
    const rsvpForm = document.getElementById('rsvp-form');
    const guestNameInput = document.getElementById('guest-name');
    const guestNameList = document.getElementById('guest-name-list');
    const guestCountDropdown = document.getElementById('guest-count');
    const guestRSVPSelect = document.getElementById('guest-rsvp');
    const numRespInput = document.getElementById('num-resp');
    const submitButton = document.getElementById('submit-rsvp');
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyNgkF6lvcJ2A6tJOh-8e2zT8vsyEWiaAqLVybKFvaW6bDvFSdLLUdXOBF7ICtT7ZaB/exec";
    let guestData = [];

    // ✅ Initialize AOS Animations if Available
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 1000, once: true });
    } else {
        console.error("AOS library failed to load.");
    }

    // ✅ Tab Navigation Logic
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

    // ✅ Fetch guest list from JSON file
    async function fetchGuestList() {
        try {
            const response = await fetch('guests.json'); // Ensure guests.json is in the same directory
            guestData = await response.json();
            populateDatalist(guestData);
        } catch (error) {
            console.error("Error fetching guest list:", error);
        }
    }

    // ✅ Populate datalist for name search
    function populateDatalist(guestData) {
        guestNameList.innerHTML = ''; // Clear previous entries
        guestData.forEach(guest => {
            let option = document.createElement("option");
            option.value = guest.name;
            guestNameList.appendChild(option);
        });
    }

    // ✅ Detect when a valid guest is selected & auto-fill fields
    guestNameInput.addEventListener('input', function() {
        const selectedGuest = guestData.find(g => g.name.toLowerCase() === guestNameInput.value.toLowerCase());
        if (selectedGuest) {
            populateGuestCountDropdown(selectedGuest.maxGuests);
            numRespInput.value = selectedGuest.numResp || 1; // Default 1 if not set
            guestRSVPSelect.value = selectedGuest.guestRSVP || "Yes"; // Default to "Yes"
        }
    });

    // ✅ Populate guest count dropdown dynamically
    function populateGuestCountDropdown(maxGuests) {
        guestCountDropdown.innerHTML = ''; // Clear previous options
        for (let i = 1; i <= maxGuests; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            guestCountDropdown.appendChild(option);
        }
        guestCountDropdown.style.display = 'block';
    }

    // ✅ Show RSVP form when clicking RSVP button
    if (rsvpButton && rsvpForm) {
        rsvpButton.addEventListener('click', function() {
            rsvpButton.style.display = 'none';
            rsvpForm.style.display = 'block';
        });
    }

    // ✅ Form Submission Logic
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("Form Submitted!");
            const guestName = guestNameInput.value.trim();
            const guestCount = guestCountDropdown.value.trim();
            const guestRSVP = guestRSVPSelect.value;
            const numResp = numRespInput.value;

            const selectedGuest = guestData.find(g => g.name.toLowerCase() === guestName.toLowerCase());
            if (!selectedGuest) {
                alert("Error: Please select a valid guest name from the list.");
                return;
            }

            if (!guestCount) {
                alert("Error: Please select the number of guests.");
                return;
            }

            // Disable button while submitting
            submitButton.textContent = "Submitting...";
            submitButton.disabled = true;

            // ✅ Prepare RSVP Data to Send
            const rsvpData = {
                name: guestName,
                guestRSVP: guestRSVP,
                guestCount: guestCount,  // This is the number of people attending
            };

            console.log("Submitting RSVP Data:", rsvpData); // Debugging

            // ✅ Send data to Google Sheets (using URLSearchParams for form-encoded data)
            fetch(scriptUrl, {
                method: "POST",
                body: new URLSearchParams(rsvpData),  // Send as URL-encoded parameters
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            })
            .then(response => response.text())
            .then(data => {
                console.log("Response from Google Sheets:", data);
                rsvpForm.style.display = 'none';
                const submittedMessage = document.createElement('p');
                submittedMessage.textContent = "RSVP Submitted! Thank you.";
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

    // ✅ Load guest names on page load
    fetchGuestList();
});
