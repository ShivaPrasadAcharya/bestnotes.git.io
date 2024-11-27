class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.prevMatch = document.getElementById('prevMatch');
        this.nextMatch = document.getElementById('nextMatch');
        this.matchCount = document.getElementById('matchCount');
        this.currentMatchIndex = -1;
        this.matches = [];
        
        this.initialize();
    }

    initialize() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.prevMatch.addEventListener('click', () => this.navigateMatch(-1));
        this.nextMatch.addEventListener('click', () => this.navigateMatch(1));
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        
        // Remove existing highlights
        document.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
        });

        if (searchTerm === '') {
            this.searchResults.classList.add('d-none');
            return;
        }

        // Find and highlight matches
        this.matches = [];
        const walker = document.createTreeWalker(
            document.getElementById('notesContainer'),
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return node.textContent.toLowerCase().includes(searchTerm) ?
                        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const text = node.textContent;
            const parent = node.parentNode;
            
            let lastIndex = 0;
            let match;
            const regex = new RegExp(searchTerm, 'gi');
            
            while ((match = regex.exec(text)) !== null) {
                const before = text.slice(lastIndex, match.index);
                const highlighted = document.createElement('span');
                highlighted.className = 'highlight';
                highlighted.textContent = match[0];
                
                if (before) {
                    parent.insertBefore(document.createTextNode(before), node);
                }
                parent.insertBefore(highlighted, node);
                this.matches.push(highlighted);
                
                lastIndex = regex.lastIndex;
            }
            
            if (lastIndex < text.length) {
                parent.insertBefore(
                    document.createTextNode(text.slice(lastIndex)),
                    node
                );
            }
            parent.removeChild(node);
        }

        // Update UI
        this.searchResults.classList.remove('d-none');
        this.currentMatchIndex = -1;
        this.updateMatchCount();
        if (this.matches.length > 0) {
            this.navigateMatch(1);
        }
    }

    navigateMatch(direction) {
        if (this.matches.length === 0) return;

        // Remove active highlight from current match
        if (this.currentMatchIndex >= 0) {
            this.matches[this.currentMatchIndex].classList.remove('active');
        }

        // Update current match index
        this.currentMatchIndex += direction;
        if (this.currentMatchIndex >= this.matches.length) {
            this.currentMatchIndex = 0;
        } else if (this.currentMatchIndex < 0) {
            this.currentMatchIndex = this.matches.length - 1;
        }

        // Highlight and scroll to new match
        const currentMatch = this.matches[this.currentMatchIndex];
        currentMatch.classList.add('active');
        currentMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        this.updateMatchCount();
    }

    updateMatchCount() {
        this.matchCount.textContent = this.matches.length > 0 ?
            `${this.currentMatchIndex + 1}/${this.matches.length}` : '0/0';
    }
}

// Initialize search functionality
new SearchManager();