// Smooth scrolling for in-page navigation links only
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignore placeholder links like "#".
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Intersection Observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.service-card, .project-card').forEach(el => {
    observer.observe(el);
});

// Hamburger menu toggle functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    });
}

// Close mobile menu when a link is clicked
const navLinkItems = document.querySelectorAll('.nav-links a, .hero-buttons a');
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Contact Form Handling with EmailJS
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create an Email Service (Gmail, Outlook, etc.) and get your SERVICE_ID
// 3. Create an Email Template and get your TEMPLATE_ID
// 4. Get your Public Key from EmailJS Dashboard > Account > API Keys
// 5. Replace the placeholders below with your actual values:
//    - YOUR_PUBLIC_KEY: Your EmailJS Public Key
//    - YOUR_SERVICE_ID: Your Email Service ID
//    - YOUR_TEMPLATE_ID: Your Email Template ID
//
// Template variables: {{user_name}}, {{user_email}}, {{subject}}, {{message}}
// In EmailJS template set: Subject = "Website contact: {{subject}}"
// and Reply To = {{user_email}} so replying goes to the visitor.
//
(function() {
    // Initialize EmailJS (you'll need to replace with your public key)
    emailjs.init("N_WgNrdXCBsdy2gVB"); // Replace with your EmailJS Public Key
    
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            
            // Build template params from form (ensures subject is never empty)
            const templateParams = {
                user_name: contactForm.user_name.value.trim(),
                user_email: contactForm.user_email.value.trim(),
                subject: contactForm.subject.value.trim() || 'Contact from website',
                message: contactForm.message.value.trim()
            };

            // Send email using EmailJS (use send so we control subject & params)
            emailjs.send('service_arw52j8', 'template_wqegfez', templateParams)
                .then(function() {
                    // Success
                    formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                    }, 5000);
                }, function(error) {
                    // Error
                    formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
                    formMessage.className = 'form-message error';
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    console.error('EmailJS Error:', error);
                });
        });
    }
})();
