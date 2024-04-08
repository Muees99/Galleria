

document.addEventListener("DOMContentLoaded", function() {
    // Once the DOM is fully loaded

    // Select all the figure elements inside the .images container
    const images = document.querySelectorAll('.images figure');

    // Select other necessary elements
    const overlay = document.querySelector('.overlay');
    const overlayImage = document.querySelector('.overlay-image');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');

    let currentImageIndex = 0;
    let currentPage = 0;
    const imagesPerPage = 28; // Adjusted for 6-7 images in a column

    // Function to check if navigation buttons should be shown or hidden
    function checkNavigationButtons() {
        const isOverlayVisible = overlay.style.display === 'flex';
        if (isOverlayVisible) {
            showNavigationButtons();
        } else {
            hideNavigationButtons();
        }
    }

    // Show navigation buttons
    function showNavigationButtons() {
        localStorage.setItem('navigationButtonsVisible', 'true'); // Save state in local storage
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }

    // Hide navigation buttons
    function hideNavigationButtons() {
        localStorage.setItem('navigationButtonsVisible', 'false'); // Save state in local storage
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    // Show overlay with clicked image
    function showOverlay(index) {
        overlayImage.src = images[index].querySelector('img').src;
        overlay.style.display = 'flex';
        showNavigationButtons(); // Show prev and next buttons
    }

    // Hide overlay
    function hideOverlay() {
        overlay.style.display = 'none';
        hideNavigationButtons(); // Hide prev and next buttons
    }

    // Show next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        overlayImage.src = images[currentImageIndex].querySelector('img').src;
    }

    // Show previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        overlayImage.src = images[currentImageIndex].querySelector('img').src;
    }

    // Show page
    function showPage(page) {
        const startIndex = page * imagesPerPage;
        const endIndex = Math.min(startIndex + imagesPerPage, images.length);
        images.forEach((image, index) => {
            if (index >= startIndex && index < endIndex) {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        });
    }

    // Navigate to next page
    function nextPage() {
        currentPage = Math.min(currentPage + 1, Math.ceil(images.length / imagesPerPage) - 1);
        showPage(currentPage);
    }

    // Navigate to previous page
    function prevPage() {
        currentPage = Math.max(currentPage - 1, 0);
        showPage(currentPage);
    }

    // Function to check if the device is a mobile device
    function isMobileDevice() {
        return window.innerWidth <= 768; // Adjust as needed for your specific breakpoint
    }

    // Event listeners
    images.forEach((image, index) => {
        image.addEventListener('click', () => {
            currentImageIndex = index;
            showOverlay(currentImageIndex);
        });
    });

    closeBtn.addEventListener('click', hideOverlay);
    overlay.addEventListener('click', hideOverlay);
    overlayImage.addEventListener('click', e => e.stopPropagation());
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    nextPageBtn.addEventListener('click', nextPage);
    prevPageBtn.addEventListener('click', prevPage);

    // On page load, check if navigation buttons should be shown or hidden based on local storage
    const navigationButtonsVisible = localStorage.getItem('navigationButtonsVisible');
    if (navigationButtonsVisible === 'true') {
        showNavigationButtons();
    } else {
        hideNavigationButtons();
    }

    // Show the first page initially
    showPage(currentPage);

    // Function to filter images based on label
    function filterImagesByLabel(label) {
        images.forEach(figure => {
            if (figure.dataset.label.toLowerCase().includes(label.toLowerCase())) {
                figure.style.display = 'block';
            } else {
                figure.style.display = 'none';
            }
        });
    }

    // Event listener for search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim();
        if (searchValue === '') {
            // If search input is empty, show all images
            images.forEach(figure => {
                figure.style.display = 'block';
            });
        } else {
            // Filter images based on search input
            filterImagesByLabel(searchValue);
        }
    });

    // Add fade-in animation for images after they are fully loaded
    images.forEach((figure, index) => {
        const img = figure.querySelector('img');
        img.addEventListener('load', () => {
            figure.style.opacity = 1;
        });
        img.addEventListener('error', () => {
            figure.style.display = 'none'; // Hide the figure if the image fails to load
        });
    });
});
