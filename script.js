// I Cubic Engineering - SPA Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initial load: Check hash or default to home
    const hash = window.location.hash.substring(1); // Remove '#'
    showSection(hash || 'home');
});

// Handle Browser Back/Forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    showSection(hash || 'home', null, false); // false = don't push state again
});

/**
 * Switch between SPA sections
 * @param {string} sectionId - The ID of the section to show
 * @param {Event} event - The click event (optional)
 * @param {boolean} updateState - Whether to update browser history (default true)
 */
function showSection(sectionId, event, updateState = true) {
    // Prevent default anchor behavior if event is provided
    if (event) {
        event.preventDefault();
    }

    // 1. Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });

    // 2. Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }

    // 3. Update Navigation Links Active State
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
            link.classList.add('active');
        }
    });

    // 4. Update Browser History (URL Hash)
    if (updateState) {
        history.pushState(null, null, `#${sectionId}`);
    }

    // 5. Scroll to top
    window.scrollTo(0, 0);

    // 6. Collapse mobile menu
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();
    }
}

/**
 * Handle Contact Form Submission
 * @param {Event} event 
 */
function handleForm(event) {
    event.preventDefault();

    // Get form values
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    // Send email using EmailJS
    // Service ID, Template ID, Parameters, User ID (configured in init)
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values from EmailJS dashboard
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }).then(
        function (response) {
            alert("SUCCESS! Your message has been sent.");
            event.target.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        },
        function (error) {
            console.error("FAILED...", error);
            alert("Failed to send message. Please try again later or check console for details.");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    );
}
