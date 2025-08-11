// DOM elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');

// API endpoint
const API_URL = 'https://api.quotable.io/random';

// Fallback quotes in case API is not accessible
const fallbackQuotes = [
    {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        content: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        content: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
    },
    {
        content: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        content: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
    },
    {
        content: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        content: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        content: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        content: "Don't let yesterday take up too much of today.",
        author: "Will Rogers"
    },
    {
        content: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
        author: "Unknown"
    },
    {
        content: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
        author: "Steve Jobs"
    },
    {
        content: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        content: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson"
    },
    {
        content: "Go confidently in the direction of your dreams. Live the life you have imagined.",
        author: "Henry David Thoreau"
    }
];

let usedQuoteIndices = [];

// Get a random fallback quote
function getFallbackQuote() {
    // Reset used indices if we've used all quotes
    if (usedQuoteIndices.length >= fallbackQuotes.length) {
        usedQuoteIndices = [];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    } while (usedQuoteIndices.includes(randomIndex));
    
    usedQuoteIndices.push(randomIndex);
    return fallbackQuotes[randomIndex];
}

// Fetch a new quote from the API
async function fetchQuote() {
    try {
        // Show loading state
        setLoadingState(true);
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add fade out effect
        const quoteCard = document.querySelector('.quote-card');
        quoteCard.classList.add('quote-fade-out');
        
        // Wait for fade out animation
        setTimeout(() => {
            // Update quote content
            quoteText.textContent = data.content;
            quoteAuthor.textContent = `- ${data.author}`;
            
            // Add fade in effect
            quoteCard.classList.remove('quote-fade-out');
            quoteCard.classList.add('quote-fade-in');
            
            // Remove loading state
            setLoadingState(false);
        }, 300);
        
    } catch (error) {
        console.error('Error fetching quote from API, using fallback:', error);
        
        // Use fallback quote instead of showing error
        const fallbackQuote = getFallbackQuote();
        const quoteCard = document.querySelector('.quote-card');
        quoteCard.classList.add('quote-fade-out');
        
        setTimeout(() => {
            quoteText.textContent = fallbackQuote.content;
            quoteAuthor.textContent = `- ${fallbackQuote.author}`;
            
            quoteCard.classList.remove('quote-fade-out');
            quoteCard.classList.add('quote-fade-in');
            
            setLoadingState(false);
        }, 300);
    }
}

// Set loading state for button
function setLoadingState(isLoading) {
    if (isLoading) {
        newQuoteBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
    } else {
        newQuoteBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

// Event listener for the new quote button
newQuoteBtn.addEventListener('click', fetchQuote);

// Keyboard support - press Enter or Space to get new quote
document.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !newQuoteBtn.disabled) {
        event.preventDefault();
        fetchQuote();
    }
});

// Load initial quote when page loads
window.addEventListener('load', () => {
    // Small delay to let the page fully render
    setTimeout(() => {
        fetchQuote();
    }, 500);
});

// Add some extra interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Add a subtle animation to the quote card on load
    const quoteCard = document.querySelector('.quote-card');
    quoteCard.style.opacity = '0';
    quoteCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        quoteCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        quoteCard.style.opacity = '1';
        quoteCard.style.transform = 'translateY(0)';
    }, 100);
});

// Share functionality (optional enhancement)
function shareQuote() {
    const currentQuote = quoteText.textContent;
    const currentAuthor = quoteAuthor.textContent;
    const shareText = `"${currentQuote}" ${currentAuthor}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Inspirational Quote',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            // Could show a toast notification here
            console.log('Quote copied to clipboard!');
        });
    }
}

// Add double-click to share (optional feature)
document.querySelector('.quote-card').addEventListener('dblclick', shareQuote); 