// Select all sections to observe
const sections = document.querySelectorAll('.section');
const tools = document.querySelector('#tools'); // Target the specific div

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

observer.observe(tools); // Observe only the tools div