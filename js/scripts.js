document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById('rok');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const copyrightHolderSpan = document.getElementById('copyright-holder');
  if (copyrightHolderSpan) {
    const copyrightMeta = document.querySelector('meta[name="copyright"]');
    if (copyrightMeta) {
      copyrightHolderSpan.textContent = copyrightMeta.getAttribute('content');
    }
  }

  // --- Logika ukrywania adresu e-mail ---
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    const user = emailLink.getAttribute('data-user');
    const domain = emailLink.getAttribute('data-domain');
    const email = user + '@' + domain;
    emailLink.href = 'mailto:' + email;
    emailLink.textContent = email;
    // Aktualizacja etykiety dla czytników ekranu
    emailLink.setAttribute('aria-label', 'Napisz do nas na adres ' + email);
  }

  // --- Logika przycisku "Przewiń do góry" ---
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) { // Pokaż przycisk po przewinięciu 300px
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Logika Intro Banner ---
  const scene1 = document.getElementById('scene1');
  const scene2 = document.getElementById('scene2');
  if (scene1 && scene2) {
    const sceneOneDuration = 5000; // Czas wyświetlania pierwszej sceny (5 sekund)
    const sceneTwoDuration = 4000; // Czas wyświetlania drugiej sceny (4 sekundy)
    const totalLoopTime = sceneOneDuration + sceneTwoDuration;

    function playIntro() {
      scene1.classList.remove('hidden');
      scene2.classList.remove('visible');

      setTimeout(() => {
        scene1.classList.add('hidden');
        scene2.classList.add('visible');
      }, sceneOneDuration);
    }

    playIntro();
    setInterval(playIntro, totalLoopTime);
  }

  // --- Logika formularza kontaktowego ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('imie').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('wiadomosc').value;

      const alertMessage = `Wiadomość została wysłana!\n\n` +
                           `Dane z formularza:\n` +
                           `Imię: ${name}\n`+
                           `E-mail: ${email}\n`+
                           `Wiadomość: ${message}`;

      showCustomAlert(alertMessage);
      contactForm.reset();
    });
  }

  // --- Logika niestandardowego alertu ---
  const customAlert = document.getElementById('custom-alert');
  const customAlertMessage = document.getElementById('custom-alert-message');
  const customAlertClose = document.getElementById('custom-alert-close');

  function showCustomAlert(message) {
    customAlertMessage.textContent = message;
    customAlert.classList.add('visible');
  }

  if (customAlertClose) {
    customAlertClose.addEventListener('click', () => customAlert.classList.remove('visible'));
  }

  const galleryLinks = document.querySelectorAll('.gallery-link');
  galleryLinks.forEach(link => {
    const img = link.querySelector('img');
    if (img && img.alt) {
      link.title = img.alt;
    }
  });
});

function fixWidows() {
  const elementsToFix = document.querySelectorAll('p, li');
  const regex = new RegExp('\\b(i|u|w|z|o|a|dla|na)\\s', 'gi');

  elementsToFix.forEach(element => {
    element.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        let newText = child.textContent;
        const originalText = newText;

        newText = newText.replace(regex, '$1\u00A0');
        newText = newText.replace(/(\.\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*)\s/g, '$1\u00A0');

        if (newText !== originalText) {
          element.replaceChild(document.createTextNode(newText), child);
        }
      }
    });
  });
}
window.addEventListener('load', function() {
  initLightbox();
  fixWidows(); // Przeniesiono tutaj, aby uruchomić po załadowaniu czcionek
});
// --- Logika Lightbox ---
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryLinks = document.querySelectorAll('.gallery-link');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox || !galleryLinks.length) {
    console.error("Elementy lightboxa nie zostały znalezione!");
    return;
  }

  let currentIndex = 0;

  const showImage = (index) => {
    const link = galleryLinks[index];
    const img = link.querySelector('img');
    lightboxImg.src = link.href;
    lightboxCaption.innerHTML = img.alt;
    currentIndex = index;
  };

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      lightbox.classList.add('visible');
      showImage(index);
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('visible');
  };

  const showNext = () => {
    const newIndex = (currentIndex + 1) % galleryLinks.length;
    showImage(newIndex);
  };

  const showPrev = () => {
    const newIndex = (currentIndex - 1 + galleryLinks.length) % galleryLinks.length;
    showImage(newIndex);
  };

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('visible')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });
}