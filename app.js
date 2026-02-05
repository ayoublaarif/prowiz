// Wait for Vue to load
if (typeof Vue === 'undefined') {
    console.error('Vue is not loaded!');
} else {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                activeTab: 'recommendations',
                activeNav: 'home',
                showContextMenu: false,
                showNotification: false,
                notificationMessage: '',
                hiddenRecommendations: [],
                mySubscriptions: [
                    {
                        id: 'crunchyroll',
                        name: 'Crunchyroll',
                        price: '$9.99/month',
                        logo: 'assets/crunchyroll.avif',
                        logoColor: '#000000'
                    }
                ],
                recommendations: [
                    {
                        id: 'paramount',
                        name: 'Paramount+',
                        title: 'Out of 500 streaming services, Paramount+ has the most titles from your watchlist',
                        price: '$12.99',
                        logo: 'assets/paramount-logo.png',
                        logoColor: '#0066FF',
                        signUpUrl: 'https://www.paramountplus.com/intl/',
                        posters: [
                            'assets/poster1.png',
                            'assets/poster2.png',
                            'assets/poster3.png',
                            'assets/poster4.png',
                            'assets/poster5.png'
                        ]
                    },
                    {
                        id: 'hulu',
                        name: 'Hulu',
                        title: 'Your number of interactions with titles on Peacock has been low.',
                        price: '$9.99',
                        logo: 'assets/hulu-logo.png',
                        logoColor: '#1CE783',
                        signUpUrl: 'https://www.hulu.com/welcome'
                    },
                    {
                        id: 'netflix',
                        name: 'Netflix',
                        title: 'You had few interactions with titles available on Netflix last month. Consider canceling.',
                        price: '$9.99',
                        logo: 'assets/netflix-logo.png',
                        logoColor: '#E50914',
                        signUpUrl: 'https://www.netflix.com/us-en/'
                    }
                ]
            };
        },
        methods: {
            switchTab(tab) {
                console.log('Switching to tab:', tab);
                this.activeTab = tab;
                console.log('Active tab is now:', this.activeTab);
            },
            toggleContextMenu(event) {
                event.stopPropagation();
                this.showContextMenu = !this.showContextMenu;
            },
        handleImageError(event) {
            // Hide the broken image
            event.target.style.display = 'none';
        },
            addToSubscriptions(serviceId) {
                // Find the service in recommendations
                const service = this.recommendations.find(r => r.id === serviceId);
                if (!service) return;

                // Check if already in subscriptions
                const exists = this.mySubscriptions.find(s => s.id === serviceId);
                if (exists) {
                    this.showNotificationMessage('This service is already in your subscriptions');
                    return;
                }

                // Add to subscriptions
                this.mySubscriptions.push({
                    id: service.id,
                    name: service.name,
                    price: service.price + '/month',
                    logo: service.logo,
                    logoColor: service.logoColor
                });

                // Hide the recommendation card
                if (!this.hiddenRecommendations.includes(serviceId)) {
                    this.hiddenRecommendations.push(serviceId);
                }

                // Show notification (user stays on recommendations screen)
                this.showNotificationMessage(`${service.name} has been moved to your subscriptions`);
            },
            isRecommendationVisible(serviceId) {
                return !this.hiddenRecommendations.includes(serviceId);
            },
            openSignUpPage(serviceId) {
                const service = this.recommendations.find(r => r.id === serviceId);
                if (service && service.signUpUrl) {
                    window.open(service.signUpUrl, '_blank');
                }
            },
            showNotificationMessage(message) {
                this.notificationMessage = message;
                this.showNotification = true;
                
                // Hide after 3 seconds
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            }
        },
        mounted() {
            // Close context menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.subscription-menu-icon') && 
                    !event.target.closest('.context-menu')) {
                    this.showContextMenu = false;
                }
            });

            // Enable smooth scrolling
            const recommendationsContainer = document.querySelector('.recommendations-container');
            const subscriptionsContainer = document.querySelector('.subscriptions-container');
            
            if (recommendationsContainer) {
                recommendationsContainer.style.scrollBehavior = 'smooth';
            }
            if (subscriptionsContainer) {
                subscriptionsContainer.style.scrollBehavior = 'smooth';
            }
        }
    }).mount('#app');
    
    console.log('Vue app mounted successfully');
}
