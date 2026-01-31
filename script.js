// I Cubic Engineering - SPA Logic

document.addEventListener("DOMContentLoaded", () => {
  // Initial load: Check hash or default to home
  const hash = window.location.hash.substring(1); // Remove '#'
  showSection(hash || "home");

  // Initialize Scroll Animations
  setupScrollAnimations();
  
  // Run Advanced Hero Animations
  runHeroAnimations();
});

/**
 * Advanced Hero Animations using Anime.js
 */
function runHeroAnimations() {
  // Wrap Title text in spans for letter animation
  const title = document.getElementById('hero-title');
  if (title) {
    title.innerHTML = title.textContent.replace(/\S/g, "<span class='letter' style='display:inline-block'>$&</span>");
  }

  // Wrap Tagline text for decoding effect
  const tagline = document.getElementById('hero-tagline');
  if (tagline) {
    // Split by character including spaces (handled by preservation)
    const text = tagline.textContent;
    let wrapped = '';
    for(let char of text) {
        wrapped += `<span class='letter' style='opacity:0; display:inline-block'>${char === ' ' ? '&nbsp;' : char}</span>`;
    }
    tagline.innerHTML = wrapped;
  }

  // Ensure Anime.js is loaded
  if (typeof anime !== 'undefined') {
      const tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
      });

      tl
      // 1. Animate Title Letters: Scale and Fade In Staggered
      .add({
        targets: '#hero-title .letter',
        translateY: [100, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1400,
        delay: (el, i) => 300 + 30 * i
      })
      // 2. Animate Tagline: Decoding effect (Fade in + slight scale)
      .add({
        targets: '#hero-tagline .letter',
        opacity: [0, 1],
        scale: [0.3, 1],
        translateY: [20, 0],
        easing: "easeOutElastic(1, .8)",
        duration: 1200,
        delay: (el, i) => 20 * i
      }, '-=1000');
  } else {
      console.warn("Anime.js not loaded, skipping hero animations");
      // Fallback: make visible if anime.js fails
      if(title) title.style.opacity = 1;
      if(tagline) tagline.style.opacity = 1;
  }
}

// Handle Browser Back/Forward buttons
window.addEventListener("popstate", () => {
  const hash = window.location.hash.substring(1);
  showSection(hash || "home", null, false); // false = don't push state again
});

/**
 * Setup Intersection Observer for scroll animations
 */
function setupScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Optional: Stop observing once visible?
        // observer.unobserve(entry.target);
        // Taking it out to allow re-animating if desired, or just keep it simple.
        // Usually for "entrance" animations, we want them to stay or only animate once.
        // Let's stick with animate once behavior effectively by just adding the class.
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => observer.observe(el));
}

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
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    section.classList.remove("active-section");
  });

  // 2. Show the target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active-section");
    
    // 2.5 Reset and re-trigger animations for this section
    resetAndAnimateSection(targetSection);
  }

  // 3. Update Navigation Links Active State
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    const onclickAttr = link.getAttribute("onclick");
    if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
      link.classList.add("active");
    }
  });

  // 4. Update Browser History (URL Hash)
  if (updateState) {
    history.pushState(null, null, `#${sectionId}`);
  }

  // 5. Scroll to top
  window.scrollTo(0, 0);

  // 6. Collapse mobile menu
  const navbarCollapse = document.getElementById("navbarNav");
  if (navbarCollapse && navbarCollapse.classList.contains("show")) {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false,
    });
    bsCollapse.hide();
  }
}

/**
 * Reset animations and re-trigger for a section
 * @param {HTMLElement} section
 */
function resetAndAnimateSection(section) {
  const animatedElements = section.querySelectorAll(".animate-on-scroll");
  
  // Reset all animations first
  animatedElements.forEach((el) => {
    el.classList.remove("is-visible");
  });
  
  // Small delay then re-observe
  setTimeout(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => observer.observe(el));
  }, 50);
}

/**
 * Handle Contact Form Submission
 * @param {Event} event
 */
function handleForm(event) {
  event.preventDefault();

  // Get form values
  const btn = event.target.querySelector("button");
  const originalText = btn.innerText;
  btn.innerText = "Sending...";
  btn.disabled = true;

  // Send email using EmailJS
  // Service ID, Template ID, Parameters, User ID (configured in init)
  // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values from EmailJS dashboard
  emailjs
    .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    })
    .then(
      function (response) {
        alert("SUCCESS! Your message has been sent.");
        event.target.reset();
        btn.innerText = originalText;
        btn.disabled = false;
      },
      function (error) {
        console.error("FAILED...", error);
        alert(
          "Failed to send message. Please try again later or check console for details.",
        );
        btn.innerText = originalText;
        btn.disabled = false;
      },
    );
}
