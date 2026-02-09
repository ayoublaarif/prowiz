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
                showLoadingScreen: false,
                loadingFadeToBlack: false,
                loadingCount: 0,
                loadingTotal: 345,
                loadingIntervalId: null,
                contextMenuSubscriptionId: null,
                removedSubscriptionIds: [],
                fadingOutSubscriptionIds: [],
                fadingOutDetectedIds: [],
                subscriptionRemovalTimeouts: {},
                detectedRemovalTimeouts: {},
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
                markedAsNotSubscribedIds: [],
                detectedSubscriptions: [
                    {
                        id: 'apple-tv',
                        name: 'Apple TV +',
                        logo: 'assets/appletv-logo.png',
                        interactions: '6 interactions in the past 30 days',
                        price: '$9.99/month'
                    },
                    {
                        id: 'disney',
                        name: 'Disney +',
                        logo: 'assets/disney.webp',
                        interactions: '0 interactions in the past 30 days',
                        price: '$10.99/month'
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
        computed: {
            hasVisibleRecommendations() {
                return this.recommendations.some(r => this.isRecommendationVisible(r.id));
            }
        },
        methods: {
            switchTab(tab) {
                console.log('Switching to tab:', tab);
                this.activeTab = tab;
                console.log('Active tab is now:', this.activeTab);
            },
            toggleContextMenu(event, subscriptionId) {
                event.stopPropagation();
                this.contextMenuSubscriptionId = this.contextMenuSubscriptionId === subscriptionId ? null : subscriptionId;
            },
            removeSubscription(subscriptionId) {
                if (this.subscriptionRemovalTimeouts[subscriptionId]) {
                    clearTimeout(this.subscriptionRemovalTimeouts[subscriptionId]);
                    delete this.subscriptionRemovalTimeouts[subscriptionId];
                }
                if (!this.removedSubscriptionIds.includes(subscriptionId)) {
                    this.removedSubscriptionIds.push(subscriptionId);
                }
                this.contextMenuSubscriptionId = null;
                const timeoutId = setTimeout(() => {
                    this.fadingOutSubscriptionIds = [...this.fadingOutSubscriptionIds, subscriptionId];
                    setTimeout(() => {
                        this.mySubscriptions = this.mySubscriptions.filter(s => s.id !== subscriptionId);
                        this.removedSubscriptionIds = this.removedSubscriptionIds.filter(id => id !== subscriptionId);
                        this.fadingOutSubscriptionIds = this.fadingOutSubscriptionIds.filter(id => id !== subscriptionId);
                        delete this.subscriptionRemovalTimeouts[subscriptionId];
                    }, 400);
                }, 10000);
                this.subscriptionRemovalTimeouts[subscriptionId] = timeoutId;
            },
            undoRemoveSubscription(subscriptionId) {
                if (this.subscriptionRemovalTimeouts[subscriptionId]) {
                    clearTimeout(this.subscriptionRemovalTimeouts[subscriptionId]);
                    delete this.subscriptionRemovalTimeouts[subscriptionId];
                }
                this.removedSubscriptionIds = this.removedSubscriptionIds.filter(id => id !== subscriptionId);
            },
            isSubscriptionRemoved(subscriptionId) {
                return this.removedSubscriptionIds.includes(subscriptionId);
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
            removeProviderNotSubscribed(serviceId) {
                this.mySubscriptions = this.mySubscriptions.filter(s => s.id !== serviceId);
                this.detectedSubscriptions = this.detectedSubscriptions.filter(d => d.id !== serviceId);
                this.markedAsNotSubscribedIds = this.markedAsNotSubscribedIds.filter(id => id !== serviceId);
                if (!this.hiddenRecommendations.includes(serviceId)) {
                    this.hiddenRecommendations.push(serviceId);
                }
                const service = this.recommendations.find(r => r.id === serviceId);
                const name = service ? service.name : serviceId;
                this.showNotificationMessage(`${name} removed – you’re not subscribed`);
            },
            isRecommendationVisible(serviceId) {
                return !this.hiddenRecommendations.includes(serviceId);
            },
            remindMeRecommendations() {
                this.showNotificationMessage('We’ll remind you when new recommendations are ready');
            },
            giveFeedback() {
                this.showNotificationMessage('Thanks! Feedback link would open here.');
            },
            goToSubscriptions() {
                this.activeNav = 'lists';
                this.activeTab = 'subscriptions';
            },
            goToRecommendations() {
                this.activeNav = 'lists';
                this.activeTab = 'recommendations';
            },
            startOptimizeLoading() {
                if (this.loadingIntervalId) return;
                this.showLoadingScreen = true;
                this.loadingFadeToBlack = false;
                this.loadingCount = 0;
                const total = this.loadingTotal;
                const durationMs = 2600;
                const intervalMs = durationMs / total;
                this.loadingIntervalId = setInterval(() => {
                    this.loadingCount++;
                    if (this.loadingCount >= total) {
                        clearInterval(this.loadingIntervalId);
                        this.loadingIntervalId = null;
                        this.loadingFadeToBlack = true;
                        setTimeout(() => {
                            this.showLoadingScreen = false;
                            this.loadingFadeToBlack = false;
                            this.goToRecommendations();
                        }, 500);
                    }
                }, intervalMs);
            },
            openSignUpPage(serviceId) {
                const service = this.recommendations.find(r => r.id === serviceId);
                if (service && service.signUpUrl) {
                    window.open(service.signUpUrl, '_blank');
                }
            },
            confirmSubscription(serviceId) {
                const item = this.detectedSubscriptions.find(d => d.id === serviceId);
                if (!item) return;

                const alreadySubscribed = this.mySubscriptions.some(s => s.id === serviceId);
                if (alreadySubscribed) {
                    this.showNotificationMessage(`${item.name} is already in your subscriptions`);
                    return;
                }

                this.mySubscriptions.push({
                    id: item.id,
                    name: item.name,
                    price: item.price || '—/month',
                    logo: item.logo,
                    logoColor: item.logoColor || '#000000'
                });
                this.detectedSubscriptions = this.detectedSubscriptions.filter(d => d.id !== serviceId);
                this.markedAsNotSubscribedIds = this.markedAsNotSubscribedIds.filter(id => id !== serviceId);
                this.showNotificationMessage(`${item.name} has been added to your subscriptions`);
            },
            markAsNotSubscribed(serviceId) {
                if (this.detectedRemovalTimeouts[serviceId]) {
                    clearTimeout(this.detectedRemovalTimeouts[serviceId]);
                    delete this.detectedRemovalTimeouts[serviceId];
                }
                if (!this.markedAsNotSubscribedIds.includes(serviceId)) {
                    this.markedAsNotSubscribedIds.push(serviceId);
                }
                const timeoutId = setTimeout(() => {
                    this.fadingOutDetectedIds = [...this.fadingOutDetectedIds, serviceId];
                    setTimeout(() => {
                        this.detectedSubscriptions = this.detectedSubscriptions.filter(d => d.id !== serviceId);
                        this.markedAsNotSubscribedIds = this.markedAsNotSubscribedIds.filter(id => id !== serviceId);
                        this.fadingOutDetectedIds = this.fadingOutDetectedIds.filter(id => id !== serviceId);
                        delete this.detectedRemovalTimeouts[serviceId];
                    }, 400);
                }, 10000);
                this.detectedRemovalTimeouts[serviceId] = timeoutId;
            },
            undoMarkNotSubscribed(serviceId) {
                if (this.detectedRemovalTimeouts[serviceId]) {
                    clearTimeout(this.detectedRemovalTimeouts[serviceId]);
                    delete this.detectedRemovalTimeouts[serviceId];
                }
                this.markedAsNotSubscribedIds = this.markedAsNotSubscribedIds.filter(id => id !== serviceId);
            },
            isMarkedNotSubscribed(serviceId) {
                return this.markedAsNotSubscribedIds.includes(serviceId);
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
                if (!event.target.closest('.subscription-menu-icon') && !event.target.closest('.context-menu')) {
                    this.contextMenuSubscriptionId = null;
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
