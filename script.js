// Smooth scrolling for recommendations
document.addEventListener('DOMContentLoaded', function() {
    const recommendationsContainer = document.querySelector('.recommendations-container');
    const subscriptionsContainer = document.querySelector('.subscriptions-container');
    
    // Enable smooth scrolling
    if (recommendationsContainer) {
        recommendationsContainer.style.scrollBehavior = 'smooth';
    }
    if (subscriptionsContainer) {
        subscriptionsContainer.style.scrollBehavior = 'smooth';
    }
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const screens = document.querySelectorAll('.screen');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-screen');
            console.log('Tab clicked:', targetScreen);
            
            // Update tab states
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update screen visibility
            screens.forEach(screen => {
                screen.classList.remove('active');
                screen.style.display = 'none';
                console.log('Removed active from:', screen.className, 'Display:', window.getComputedStyle(screen).display);
            });
            
            if (targetScreen === 'recommendations') {
                const recScreen = document.querySelector('.recommendations-screen');
                if (recScreen) {
                    recScreen.classList.add('active');
                    // Force display with inline style as backup
                    recScreen.style.display = 'flex';
                    recScreen.style.flexDirection = 'column';
                    const display = window.getComputedStyle(recScreen).display;
                    console.log('Showing recommendations screen. Display:', display, 'Has active class:', recScreen.classList.contains('active'));
                }
            } else if (targetScreen === 'subscriptions') {
                const subScreen = document.querySelector('.subscriptions-screen');
                if (subScreen) {
                    subScreen.classList.add('active');
                    // Force display with inline style as backup
                    subScreen.style.display = 'flex';
                    subScreen.style.flexDirection = 'column';
                    const display = window.getComputedStyle(subScreen).display;
                    const hasActive = subScreen.classList.contains('active');
                    console.log('Showing subscriptions screen. Display:', display, 'Has active class:', hasActive);
                    console.log('Subscriptions screen element:', subScreen);
                    console.log('Subscriptions screen computed styles:', {
                        display: window.getComputedStyle(subScreen).display,
                        visibility: window.getComputedStyle(subScreen).visibility,
                        opacity: window.getComputedStyle(subScreen).opacity,
                        height: window.getComputedStyle(subScreen).height,
                        width: window.getComputedStyle(subScreen).width
                    });
                    const container = subScreen.querySelector('.subscriptions-container');
                    console.log('Subscriptions container:', container);
                    if (container) {
                        console.log('Container computed styles:', {
                            display: window.getComputedStyle(container).display,
                            height: window.getComputedStyle(container).height,
                            width: window.getComputedStyle(container).width
                        });
                    }
                } else {
                    console.error('Subscriptions screen not found!');
                }
            }
        });
    });
    
    // Navigation item switching
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close context menu when clicking outside
    document.addEventListener('click', function(event) {
        const contextMenu = document.getElementById('contextMenu');
        const menuIcon = document.querySelector('.subscription-menu-icon');
        
        if (contextMenu && menuIcon && !contextMenu.contains(event.target) && !menuIcon.contains(event.target)) {
            contextMenu.classList.remove('show');
        }
    });
});

// Toggle context menu
function toggleContextMenu(event) {
    event.stopPropagation();
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu) {
        contextMenu.classList.toggle('show');
    }
}

