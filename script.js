/**
 * Portfolio Interactivity & Theme Management
 * Left Vertical Navigation, Theme Toggle with CSS Media Queries & Quick Chat
 */
document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. NIGHT MODE / THEME TOGGLE
  // Uses CSS Media Queries to detect default browser theme
  // ========================================================
  const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
  const htmlElement = document.documentElement;
  const darkSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Determine saved manual override or rely on system media query
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    applyTheme(savedTheme, false);
  } else {
    // If no manual preference has been saved yet, update ARIA labels based on media query
    const initialSystemTheme = darkSchemeMediaQuery.matches ? 'dark' : 'light';
    updateToggleButtons(initialSystemTheme);
  }

  // Handle click on any theme toggle button
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 
        (darkSchemeMediaQuery.matches ? 'dark' : 'light');

      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  });

  // Listen to browser/OS theme changes dynamically
  darkSchemeMediaQuery.addEventListener('change', (event) => {
    if (!localStorage.getItem('portfolio-theme')) {
      const newSystemTheme = event.matches ? 'dark' : 'light';
      updateToggleButtons(newSystemTheme);
    }
  });

  function applyTheme(theme, persist = true) {
    htmlElement.setAttribute('data-theme', theme);
    if (persist) {
      localStorage.setItem('portfolio-theme', theme);
    }
    updateToggleButtons(theme);
  }

  function updateToggleButtons(activeTheme) {
    const isDark = activeTheme === 'dark';
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('title', `Current: ${isDark ? 'Night' : 'Day'} Mode. Click to switch.`);
    });
  }

  // ========================================================
  // 2. VERTICAL SIDEBAR DRAWER TOGGLE (MOBILE / TABLET)
  // ========================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarNav = document.getElementById('sidebar-nav');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');

  function openSidebar() {
    if (sidebarNav) sidebarNav.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scrolling while drawer is open
  }

  function closeSidebar() {
    if (sidebarNav) sidebarNav.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = sidebarNav && sidebarNav.classList.contains('open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar drawer when clicking any link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });

  // Close with Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('open')) {
      closeSidebar();
    }
  });

  // ========================================================
  // 3. DYNAMIC FOOTER YEAR
  // ========================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ========================================================
  // 4. ACTIVE VERTICAL NAVIGATION TRACKER ON SCROLL
  // ========================================================
  const trackedSections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 160;

    trackedSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');

      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  });

  // ========================================================
  // 5. INTERACTIVE CHAT NPC RESPONSES
  // ========================================================
  const chatMessagesBox = document.getElementById('chat-messages-box');
  const quickReplyBtns = document.querySelectorAll('.quick-reply-btn[data-reply]');

  const npcResponses = {
    'Tell me about your tech stack!': 'I specialize in Java, JavaScript/TypeScript, React, Next.js, Node.js, distributed databases (PostgreSQL, MongoDB), and cloud orchestration with Docker & AWS.',
    'Are you available for full-time roles?': 'Yes! I am actively looking for full-time Software Engineer positions and impactful projects. Feel free to download my resume or drop me a line via the contact form!',
    'Can we schedule a call?': 'I would love to connect! You can reach out via email at mariyasnehal@example.com or submit the contact form with your preferred date and time.'
  };

  quickReplyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-reply');
      if (!chatMessagesBox || !question) return;

      // Add user speech bubble
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user-msg';
      userMsg.innerHTML = `<span class="msg-speaker pixel-font" style="color: var(--pixel-accent-gold);">YOU:</span><p class="msg-bubble" style="border-color: var(--pixel-accent);">${question}</p>`;
      chatMessagesBox.appendChild(userMsg);

      // Typing feedback & bot response
      setTimeout(() => {
        const answer = npcResponses[question] || "Thanks for reaching out! Let's build something great together.";
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot-msg';
        botMsg.innerHTML = `<span class="msg-speaker pixel-font">MARIYA_BOT:</span><p class="msg-bubble">${answer}</p>`;
        chatMessagesBox.appendChild(botMsg);
        chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
      }, 400);

      chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    });
  });

  // ========================================================
  // 6. SKILLS SECTION — FILTER PILL INTERACTION
  //    Clicking a filter pill shows only cards matching
  //    data-category. Clicking [ALL SKILLS] resets all.
  // ========================================================
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update aria-selected & active class on filter pills
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show or hide cards based on category match
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const isVisible = (filter === 'all') || (cat === filter);

        if (isVisible) {
          // Re-show: remove hidden class and restore display
          card.classList.remove('skill-hidden');
          card.style.display = '';
        } else {
          // Hide: add faded class (CSS handles opacity + scale)
          card.classList.add('skill-hidden');
          // After the CSS transition finishes, fully remove from layout
          setTimeout(() => {
            if (card.classList.contains('skill-hidden')) {
              card.style.display = 'none';
            }
          }, 320);
        }
      });
    });
  });

  // ========================================================
  // 7. SKILLS SECTION — PROGRESS BAR SCROLL ANIMATION
  //    Uses a single IntersectionObserver to trigger the
  //    CSS width transition when each bar enters the viewport.
  //    All bars start at width:0 and fill to their target
  //    when visible — creating a satisfying RPG "XP gain" reveal.
  // ========================================================
  const progressFills = document.querySelectorAll('.pixel-progress-fill');

  // Step 1: Store each bar's target width in a data attribute,
  //         then immediately reset width to 0 so the transition
  //         has a "from 0" starting point.
  progressFills.forEach(fill => {
    const targetWidth = fill.style.width; // e.g. "92%"
    if (targetWidth) {
      fill.dataset.targetWidth = targetWidth;
    }
    fill.style.width = '0'; // start collapsed
    fill.style.transition = 'none'; // prevent premature animation
  });

  // Step 2: Observe each bar — when it enters the viewport,
  //         re-enable the transition and animate to the target width.
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = fill.dataset.targetWidth || '0%';

        // Re-enable the CSS transition for smooth fill-in
        fill.style.transition = 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1)';

        // Double rAF ensures the transition triggers after the style reset
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = target; // animate 0 → target%
          });
        });

        // Only animate once per bar
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  progressFills.forEach(fill => barObserver.observe(fill));
});

