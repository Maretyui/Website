let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

const navlogo = document.querySelector('.navlogo');
const navLinks = document.querySelector('.nav-links');

navlogo.addEventListener('click', () => {
    navlogo.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navlogo.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!navlogo.contains(e.target) && !navLinks.contains(e.target)) {
        navlogo.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('.mobile-nav-container');
    const navTrack = document.querySelector('.mobile-nav-track');
    const originalItems = document.querySelectorAll('.mobile-nav-item');
    
    if (!navContainer || !navTrack || originalItems.length === 0) return;
    
    const itemsData = Array.from(originalItems).map((item, index) => ({
        text: item.textContent.trim(),
        href: item.getAttribute('href') || item.dataset.href || '#',
        originalIndex: index
    }));
    
    const totalItems = itemsData.length;
    
    navTrack.innerHTML = '';
    
    for (let set = 0; set < 3; set++) {
        itemsData.forEach((data, index) => {
            const item = document.createElement('div');
            item.className = 'mobile-nav-item';
            item.textContent = data.text;
            item.dataset.originalIndex = data.originalIndex;
            item.dataset.set = set;
            item.dataset.href = data.href;
            
            if (data.href && data.href !== '#') {
                item.style.cursor = 'pointer';
            }
            
            navTrack.appendChild(item);
        });
    }
    
    const allItems = document.querySelectorAll('.mobile-nav-item');
    
    let lastActiveItem = null;
    let activationTimeout = null;
    
    function updateActiveItem(triggerNavigation = false) {
        const containerRect = navContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let centerItem = null;
        let minDistance = Infinity;
        
        allItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(containerCenter - itemCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                centerItem = item;
            }
        });
        
        allItems.forEach(item => item.classList.remove('active'));
        
        if (centerItem) {
            centerItem.classList.add('active');
            
            if (centerItem !== lastActiveItem) {
                lastActiveItem = centerItem;
                
                // Clear any existing timeout
                if (activationTimeout) {
                    clearTimeout(activationTimeout);
                }
                
                activationTimeout = setTimeout(() => {
                    const href = centerItem.dataset.href;
                    if (href && href !== '#') {
                        if (href.startsWith('http') || href.startsWith('//')) {
                            window.open(href, '_blank');
                        } else {
                            window.location.href = href;
                        }
                    }
                }, 1000);
            }
        }
    }
    
    function handleInfiniteScroll() {
        const scrollLeft = navContainer.scrollLeft;
        const itemWidth = allItems[0].offsetWidth + 16;
        const setWidth = itemWidth * totalItems;
        
        if (scrollLeft >= setWidth * 2) {
            navContainer.scrollLeft = setWidth;
        }
        else if (scrollLeft <= 0) {
            navContainer.scrollLeft = setWidth;
        }
        
        updateActiveItem(true);
    }
    
    let scrollTimeout;
    function throttledScrollHandler() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleInfiniteScroll, 10);
    }
    
    navContainer.addEventListener('scroll', throttledScrollHandler);
    
    allItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.dataset.href;

            const containerRect = navContainer.getBoundingClientRect();
            const itemRect = this.getBoundingClientRect();
            const containerCenter = containerRect.width / 2;
            const itemCenter = itemRect.width / 2;
            const scrollOffset = itemRect.left - containerRect.left - containerCenter + itemCenter;
            
            navContainer.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            });
        
            setTimeout(() => {
                updateActiveItem(false);
                
                if (href && href !== '#') {
                    if (href.startsWith('http') || href.startsWith('//')) {
                        window.open(href, '_blank');
                    } else {
                        window.location.href = href;
                    }
                }
            }, 300);
        });
        
        let clickTimeout;
        item.addEventListener('touchend', function(e) {
            if (this.classList.contains('active')) {
                const href = this.dataset.href;
                if (href && href !== '#') {
                    e.preventDefault();
                    if (href.startsWith('http') || href.startsWith('//')) {
                        window.open(href, '_blank');
                    } else {
                        window.location.href = href;
                    }
                }
            }
        });
    });
    
    const itemWidth = allItems[0].offsetWidth + 16;
    const initialScrollPosition = itemWidth * totalItems;
    navContainer.scrollLeft = initialScrollPosition;

    setTimeout(() => updateActiveItem(true), 100);
    window.addEventListener('resize', () => {
        setTimeout(updateActiveItem, 100);
    });
});