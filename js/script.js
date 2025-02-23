// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  // Hero Slideshow
  const heroImages = document.querySelectorAll('.hero-image');
  let currentImage = 0;

  // Preload hero images to prevent flickering
  heroImages.forEach(img => new Image().src = img.src);

  function cycleImages() {
    if (!heroImages.length) return; // Early return if no images found

    heroImages[currentImage].classList.remove('active');
    currentImage = (currentImage + 1) % heroImages.length;
    heroImages[currentImage].classList.add('active');
  }

  try {
    setInterval(cycleImages, 4000); // Change image every 4 seconds
    if (heroImages.length > 0) {
      heroImages[0].classList.add('active'); // Initialize first image
    }
  } catch (error) {
    console.error('Hero slideshow initialization failed:', error);
  }

  // Prevent right-click and drag on images (optional, consider UX impact)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // Lightbox Functionality
  const galleryImages = document.querySelectorAll('.gallery img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const prevArrow = document.querySelector('.nav-arrow.prev');
  const nextArrow = document.querySelector('.nav-arrow.next');
  const closeButton = document.querySelector('.close');

  let currentIndex = -1;

  // Function to open lightbox with debugging
  function openLightbox(src, alt) {
    console.log('Opening lightbox with src:', src, 'alt:', alt); // Debug
    if (!lightbox || !lightboxImg) {
      console.error('Lightbox elements not found');
      return;
    }

    lightbox.style.display = 'flex';
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Lightbox image';
    currentIndex = Array.from(galleryImages).findIndex(img => img.src === src);
    if (currentIndex === -1) {
      console.warn('Image not found in gallery, setting currentIndex to 0');
      currentIndex = 0;
    }
  }

  // Function to close lightbox
  function closeLightbox() {
    if (lightbox) {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      lightboxImg.alt = '';
      currentIndex = -1; // Reset index
    }
  }

  // Function to navigate lightbox images
  function navigateLightbox(direction) {
    if (currentIndex === -1 || !galleryImages.length) {
      console.warn('No valid currentIndex or gallery images');
      return;
    }

    currentIndex += direction;
    if (currentIndex < 0) currentIndex = galleryImages.length - 1;
    if (currentIndex >= galleryImages.length) currentIndex = 0;

    const img = galleryImages[currentIndex];
    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Lightbox image';
    } else {
      console.error('Navigation failed: image or lightboxImg not found');
    }
  }

  // Attach event listeners to gallery images with debugging
  try {
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        console.log('Clicked gallery image at index:', index, 'src:', img.src); // Debug
        openLightbox(img.src, img.alt);
      });
    });
  } catch (error) {
    console.error('Failed to attach gallery image listeners:', error);
  }

  // Attach event listeners to lightbox controls with debugging
  try {
    if (prevArrow) {
      prevArrow.addEventListener('click', (e) => {
        console.log('Clicked prev arrow, currentIndex:', currentIndex); // Debug
        e.preventDefault(); // Prevent default if needed
        navigateLightbox(-1);
      });
    } else {
      console.warn('Prev arrow not found');
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', (e) => {
        console.log('Clicked next arrow, currentIndex:', currentIndex); // Debug
        e.preventDefault();
        navigateLightbox(1);
      });
    } else {
      console.warn('Next arrow not found');
    }

    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        console.log('Clicked close button'); // Debug
        e.preventDefault();
        closeLightbox();
      });
    } else {
      console.warn('Close button not found');
    }
  } catch (error) {
    console.error('Failed to attach lightbox control listeners:', error);
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (event) => {
    if (lightbox && lightbox.style.display === 'flex') {
      switch (event.key) {
        case 'ArrowRight':
          navigateLightbox(1);
          break;
        case 'ArrowLeft':
          navigateLightbox(-1);
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    }
  });

  // Close lightbox when clicking outside the image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
});