/* =========================================================================
   CV WEBSITE SCRIPT
   -------------------------------------------------------------------------
   What this file does:
   1. Mobile nav menu toggle (hamburger open/close)
   2. Highlights the active section link while scrolling
   3. Show/hide the "back to top" button
   4. Validates and "submits" the contact form (no backend yet — see note below)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------------
     1. MOBILE NAV TOGGLE
  ----------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close the mobile menu automatically when a link is tapped
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------------------------------------
     2. ACTIVE LINK HIGHLIGHT ON SCROLL
     Adds a simple "active" feel by changing link color while its section
     is in view. Uses IntersectionObserver (works in all modern browsers).
  ----------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.navbar__links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent-2)' : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' } // triggers when section is roughly centered
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* -----------------------------------------------------------------------
     3. BACK TO TOP BUTTON
  ----------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -----------------------------------------------------------------------
     4. CONTACT FORM VALIDATION + "SUBMIT"
     -----------------------------------------------------------------------
     IMPORTANT: This form currently has NO backend attached, so right now
     it only validates the fields and shows a success message — it does
     NOT actually email you anything yet.

     To make it really send you messages, pick ONE of these options:

     OPTION A — Formspree (easiest, no code, free tier available):
       1. Create an account at https://formspree.io and create a new form.
       2. They give you an endpoint URL like https://formspree.io/f/xxxxxxx
       3. Replace the FORM_ENDPOINT value below with that URL.
       4. In the code further down, uncomment the "fetch(...)" block and
          remove the fake setTimeout block above it.

     OPTION B — EmailJS (also no backend code needed, sends straight from JS):
       1. Sign up at https://www.emailjs.com, connect your Gmail.
       2. Include their SDK script tag in index.html.
       3. Call emailjs.send(...) here instead of fetch().

     OPTION C — Your own PHP/MySQL backend (matches the skills on your CV!):
       1. Write a small PHP script (e.g. send-mail.php) that reads $_POST
          data and uses PHP's mail() function or PHPMailer to send it to
          nooruleman023@gmail.com, or saves it into a MySQL table.
       2. Set FORM_ENDPOINT below to that PHP file's URL.
       3. Uncomment the fetch() block below.
  ----------------------------------------------------------------------- */

  const FORM_ENDPOINT = ''; // <-- put your Formspree/EmailJS/PHP endpoint URL here later

  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // Simple field validators. Add more rules here if you want (e.g. phone number format).
  const validators = {
    firstName: (value) => value.trim().length > 0 || 'Please enter your first name.',
    lastName: (value) => value.trim().length > 0 || 'Please enter your last name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
  };

  function showFieldError(input, message) {
    const group = input.closest('.form-group');
    const errorEl = form.querySelector(`[data-error-for="${input.id}"]`);
    group.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateField(input) {
    const rule = validators[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    if (result === true) {
      showFieldError(input, '');
      return true;
    }
    showFieldError(input, result);
    return false;
  }

  // Live validation as the user types/leaves a field
  Object.keys(validators).forEach((name) => {
    const input = form.elements[name];
    if (input) {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('has-error')) {
          validateField(input);
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run validation on every required field
    let isValid = true;
    Object.keys(validators).forEach((name) => {
      const input = form.elements[name];
      if (input && !validateField(input)) isValid = false;
    });

    if (!isValid) {
      formStatus.textContent = 'Please fix the highlighted fields above.';
      formStatus.className = 'form-status error';
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // ---- CURRENT BEHAVIOR: fake submit (no backend yet) ----
    setTimeout(() => {
      formStatus.textContent = "Thanks! Your message has been recorded (demo mode — connect a backend to actually send it, see comments in script.js).";
      formStatus.className = 'form-status success';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
      form.reset();
    }, 700);

    // ---- REAL SUBMIT (uncomment once FORM_ENDPOINT is set above) ----
    /*
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          formStatus.textContent = 'Thanks! Your message has been sent.';
          formStatus.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(() => {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.className = 'form-status error';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      });
    */
  });

  /* -----------------------------------------------------------------------
     5. FOOTER YEAR (auto-updates so you never have to edit it)
  ----------------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
