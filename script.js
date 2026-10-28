// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden', isExpanded);
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

mobileMenu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus();
    }
});

// ==========================================
// Smooth Scroll & Active Navigation
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('nav-active');
            link.setAttribute('aria-current', 'location');
        }
    });
});

// ==========================================
// GitHub API Integration
// ==========================================
const GITHUB_USERNAME = 'nahom0478'; // Replace with your username
const reposContainer = document.getElementById('repos-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const manualProjects = document.getElementById('manual-projects');

// Function to fetch repositories from GitHub API
async function fetchGitHubRepos() {
    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        reposContainer.classList.add('hidden');
        errorElement.classList.add('hidden');
        
        // Make API request
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON data
        const repos = await response.json();
        
        // Hide loading, show repos
        loadingElement.classList.add('hidden');
        reposContainer.classList.remove('hidden');
        
        // If no repos or want to hide manual projects
        if (repos.length > 0) {
            manualProjects.style.display = 'none';
        }
        
        // Sort repos by last updated (most recent first)
        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        // Take only the first 6 repos
        const recentRepos = repos.slice(0, 6);
        
        // Display each repository
        recentRepos.forEach(repo => {
            const repoCard = createRepoCard(repo);
            reposContainer.appendChild(repoCard);
        });
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        
        // Show error state
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        
        // Keep manual projects visible as fallback
        manualProjects.style.display = 'grid';
    }
}

// Function to create a repository card
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    // Get language color
    const langClass = getLanguageClass(repo.language);
    
    // Format date
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Build card HTML
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-ink">${repo.name}</h3>
            <span class="text-xs text-muted">${repo.visibility === 'public' ? 'Public' : 'Private'}</span>
        </div>
        
        <p class="text-muted text-sm mb-4 line-clamp-2">
            ${repo.description || 'No description available'}
        </p>
        
        <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-3">
                ${repo.language ? `
                    <span class="${langClass} px-2 py-1 rounded-full text-xs">
                        ${repo.language}
                    </span>
                ` : ''}
                
                <span class="flex items-center text-muted">
                    <i class="fas fa-star mr-1" aria-hidden="true"></i>
                    ${repo.stargazers_count} stars
                </span>
                
                <span class="flex items-center text-muted">
                    <i class="fas fa-code-branch mr-1" aria-hidden="true"></i>
                    ${repo.forks_count} forks
                </span>
            </div>
        </div>
        
        <div class="mt-4 pt-3 border-t border-paper flex justify-between items-center">
            <span class="text-xs text-muted">Updated: ${updatedDate}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
               class="text-forest hover:text-forest-dark text-sm font-medium" aria-label="View ${repo.name} on GitHub (opens in a new tab)">
                View <i class="fas fa-external-link-alt ml-1" aria-hidden="true"></i>
            </a>
        </div>
    `;
    
    return card;
}

// Function to get language badge color class
function getLanguageClass(language) {
    if (!language) return 'bg-paper text-muted';
    
    const langLower = language.toLowerCase();
    
    switch(langLower) {
        case 'html':
            return 'lang-html';
        case 'css':
            return 'lang-css';
        case 'javascript':
            return 'lang-javascript';
        case 'python':
            return 'lang-python';
        case 'java':
            return 'lang-java';
        case 'c++':
            return 'lang-cpp';
        default:
            return 'lang-html';
    }
}

// ==========================================
// Initialize on page load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Fetch GitHub repos
    fetchGitHubRepos();
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});