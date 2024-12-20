const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');
const accordionHeaders = document.querySelectorAll('.accordion-header');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});


// Select all sections to observe
const sections = document.querySelectorAll('.animate');

// Create an Intersection Observer instance
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add the 'visible' class when in view
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    },
    { threshold: 0.1 } // Trigger when 20% of the element is in view
);

// Observe each section
sections.forEach(section => {
    observer.observe(section);
});

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });