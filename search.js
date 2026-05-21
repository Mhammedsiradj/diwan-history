// ==================== SEARCH FUNCTIONALITY ====================

// Search configuration
const searchConfig = {
    searchInput: null,
    searchResults: [],
    currentFilter: 'all'
};

// Initialize search
function initSearch() {
    searchConfig.searchInput = document.getElementById('searchInput');
    
    if (searchConfig.searchInput) {
        searchConfig.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    initFilters();
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        resetSearch();
        return;
    }
    
    performSearch(searchTerm);
}

// Perform search on elements
function performSearch(term) {
    const searchableElements = document.querySelectorAll('.hist-card, .figure-card, .timeline-event, .index-item li');
    let resultsCount = 0;
    
    searchableElements.forEach(element => {
        // Safe text search
        const textContent = element.textContent.toLowerCase();
        
        if (textContent.includes(term)) {
            element.style.display = '';
            resultsCount++;
            // We use a simplified highlighting that doesn't break HTML
            // Only apply to simple text elements or specific parts
            if (element.tagName === 'LI' || element.classList.contains('timeline-event')) {
                highlightSafe(element, term);
            }
        } else {
            element.style.display = 'none';
        }
    });
    
    showSearchResults(resultsCount);
}

// Safe Highlight: Only replaces text outside tags
function highlightSafe(element, term) {
    // Remove existing highlights first to avoid nesting
    const html = element.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/gi, '$1');
    
    // Create a regex that only matches the term outside of HTML tags
    // This is still complex, so we use a safer approach:
    // Only highlight if the element is simple
    const regex = new RegExp(`(${term})`, 'gi');
    if (!html.includes('<a') && !html.includes('<img')) {
        element.innerHTML = html.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
}

// Reset search and remove highlights
function resetSearch() {
    const allElements = document.querySelectorAll('.hist-card, .figure-card, .timeline-event, .index-item li');
    allElements.forEach(element => {
        element.style.display = '';
        if (element.innerHTML.includes('search-highlight')) {
            element.innerHTML = element.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/gi, '$1');
        }
    });
    
    const resultsMessage = document.getElementById('searchResultsMessage');
    if (resultsMessage) resultsMessage.remove();
}

// Show search results count
function showSearchResults(count) {
    let resultsMessage = document.getElementById('searchResultsMessage');
    
    if (!resultsMessage) {
        resultsMessage = document.createElement('div');
        resultsMessage.id = 'searchResultsMessage';
        resultsMessage.className = 'search-results-message';
        // Add to body instead of relative to input to avoid layout shifts
        document.body.appendChild(resultsMessage);
    }
    
    resultsMessage.innerHTML = `<i class="fas fa-search"></i> تم العثور على ${count} نتيجة`;
    resultsMessage.style.display = 'block';
    resultsMessage.style.opacity = '1';
    
    setTimeout(() => {
        resultsMessage.style.opacity = '0';
        setTimeout(() => {
            if (resultsMessage.parentNode) resultsMessage.parentNode.removeChild(resultsMessage);
        }, 500);
    }, 3000);
}

// Initialize filter buttons
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            searchConfig.currentFilter = this.dataset.filter;
            applyFilter();
        });
    });
}

// Apply filter to cards based on data-filter attribute
function applyFilter() {
    const cards = document.querySelectorAll('.hist-card');
    
    cards.forEach((card) => {
        const cardFilter = card.dataset.filter;
        if (searchConfig.currentFilter === 'all') {
            card.style.display = '';
        } else {
            card.style.display = cardFilter === searchConfig.currentFilter ? '' : 'none';
        }
    });
}


// Removed initEpochPills to allow standard <a> tag navigation

// Add search styles
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-highlight {
        background-color: var(--gold-primary);
        color: var(--dark-bg);
        padding: 0 2px;
        border-radius: 4px;
    }
    
    .search-results-message {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gold-primary);
        color: var(--dark-bg);
        padding: 0.8rem 1.5rem;
        border-radius: 50px;
        font-family: 'Reem Kufi', sans-serif;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: opacity 0.3s ease;
        white-space: nowrap;
    }
    
    @media (max-width: 480px) {
        .search-results-message {
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
            white-space: nowrap;
        }
    }
`;
document.head.appendChild(searchStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});