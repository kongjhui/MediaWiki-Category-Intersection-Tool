document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const apiUrlInput = document.getElementById('api-url');
    const connectButton = document.getElementById('connect-button');
    const connectionStatusDiv = document.getElementById('connection-status');
    
    const categorySearchInput = document.getElementById('category-search');
    const categoriesContainer = document.getElementById('categories-container');
    const categoriesListUl = document.getElementById('categories-list');
    const categoriesLoadingDiv = document.getElementById('categories-loading');
    const categoriesPlaceholderDiv = document.getElementById('categories-placeholder');
    const loadMoreButton = document.getElementById('load-more-button');
    const loadMoreContainer = document.getElementById('load-more-container');

    const selectedCategoriesListUl = document.getElementById('selected-categories-list');
    const selectedCategoriesPlaceholderDiv = document.getElementById('selected-categories-placeholder');
    const findIntersectionButton = document.getElementById('find-intersection-button');

    const progressSection = document.getElementById('progress-section');
    const progressStatusDiv = document.getElementById('progress-status');
    const progressBar = document.getElementById('progress-bar');
    const progressDetailsDiv = document.getElementById('progress-details');

    const resultsSection = document.getElementById('results-section');
    const resultsTableBody = document.getElementById('results-table-body');
    const noResultsMessageDiv = document.getElementById('no-results-message');
    const resultCountSpan = document.getElementById('result-count');
    const paginationContainer = document.getElementById('pagination-container');

    const toggleInstructionsButton = document.getElementById('toggle-instructions-button');
    const instructionsContent = document.getElementById('usage-instructions-content');
    const instructionsArrow = document.getElementById('instructions-arrow');
    const toggleInstructionsText = document.getElementById('toggle-instructions-text');


    // --- Application State ---
    let mediaWikiApi = new MediaWikiAPI(_); // Pass the translation function
    let allFetchedCategories = [];
    let displayedCategories = [];
    let selectedCategories = new Map(); // Using Map to store {name, object} for easy removal and access
    let categoryContinueToken = null;
    let currentCategorySearchTerm = '';

    let currentResults = [];
    let currentPage = 1;
    const itemsPerPage = 15;


    // --- Initialization ---
    setLanguage(currentLanguage); // Apply initial language from locales.js
    updateFindIntersectionButtonState();


    // --- Event Listeners ---
    connectButton.addEventListener('click', handleConnectSite);
    apiUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConnectSite();
    });

    categorySearchInput.addEventListener('input', Utils.debounce(handleCategorySearch, 300));
    loadMoreButton.addEventListener('click', loadMoreCategories);

    findIntersectionButton.addEventListener('click', handleFindIntersection);

    toggleInstructionsButton.addEventListener('click', () => {
        const isHidden = instructionsContent.classList.toggle('hidden');
        instructionsArrow.classList.toggle('rotate-180', !isHidden);
        if (toggleInstructionsText) {
           toggleInstructionsText.textContent = isHidden ? _('showUsageInstructions') : _('hideUsageInstructions');
        }
    });

    // --- Functions ---
    async function handleConnectSite() {
        const apiUrl = apiUrlInput.value.trim();
        if (!apiUrl) {
            Utils.displayConnectionStatus('error', _('apiUrlHelp')); // Or a more specific "URL is required"
            return;
        }

        connectButton.disabled = true;
        connectButton.textContent = _('connecting');
        Utils.toggleLoading(categoriesLoadingDiv, true);
        categoriesPlaceholderDiv.textContent = _('categoriesLoading');
        categoriesListUl.classList.add('hidden');
        loadMoreContainer.classList.add('hidden');
        connectionStatusDiv.classList.add('hidden');


        const connectionResult = await mediaWikiApi.validateConnection(apiUrl);

        connectButton.disabled = false;
        connectButton.textContent = _('connectButton');
        Utils.toggleLoading(categoriesLoadingDiv, false);

        if (connectionResult.success) {
            Utils.displayConnectionStatus('success', _('connectionSuccess'), `${connectionResult.siteName} (${connectionResult.apiUrl})`);
            categorySearchInput.disabled = false;
            categoriesPlaceholderDiv.classList.add('hidden');
            categoriesListUl.classList.remove('hidden');
            // Reset and fetch initial categories
            allFetchedCategories = [];
            displayedCategories = [];
            categoryContinueToken = null;
            currentCategorySearchTerm = '';
            categorySearchInput.value = '';
            await fetchAndDisplayCategories();
        } else {
            Utils.displayConnectionStatus('error', _('connectionFailed'), connectionResult.error);
            categorySearchInput.disabled = true;
            categoriesPlaceholderDiv.textContent = _('categoriesPlaceholder');
            categoriesListUl.classList.add('hidden');
        }
    }

    async function fetchAndDisplayCategories(prefix = '', loadMore = false) {
        if (!mediaWikiApi.apiUrl) return;

        Utils.toggleLoading(categoriesLoadingDiv, true);
        if (!loadMore) { // Full reload or initial load
            categoriesListUl.innerHTML = '';
            allFetchedCategories = [];
            displayedCategories = [];
        }

        try {
            const { categories, continueToken } = await mediaWikiApi.fetchCategories(prefix, loadMore ? categoryContinueToken : '');
            allFetchedCategories = loadMore ? allFetchedCategories.concat(categories) : categories;
            categoryContinueToken = continueToken;
            
            renderCategories(allFetchedCategories); // Render all based on current filter (if any)

            if (categoryContinueToken) {
                loadMoreContainer.classList.remove('hidden');
            } else {
                loadMoreContainer.classList.add('hidden');
            }
        } catch (error) {
            Utils.displayConnectionStatus('error', _('fetchError', error.message));
            categoriesPlaceholderDiv.textContent = _('fetchError', error.message); // Show error in list area too
            categoriesPlaceholderDiv.classList.remove('hidden');
        } finally {
            Utils.toggleLoading(categoriesLoadingDiv, false);
            if (allFetchedCategories.length === 0 && !prefix && !categoryContinueToken) {
                categoriesPlaceholderDiv.textContent = _('noCategoriesFound'); // Add this to locales
                categoriesPlaceholderDiv.classList.remove('hidden');
                categoriesListUl.classList.add('hidden');
            } else if (allFetchedCategories.length > 0) {
                categoriesPlaceholderDiv.classList.add('hidden');
                categoriesListUl.classList.remove('hidden');
            }
        }
    }
    
    function renderCategories(categoriesToRender) {
        // Filter based on search term if needed, though fetch might already do prefix search
        const searchTerm = categorySearchInput.value.toLowerCase();
        displayedCategories = categoriesToRender.filter(cat => cat.name.toLowerCase().includes(searchTerm));

        categoriesListUl.innerHTML = ''; // Clear current list items before re-rendering

        if (displayedCategories.length === 0 && searchTerm) {
             categoriesListUl.innerHTML = `<li class="text-gray-500 p-3 text-center">${_('noCategoriesMatchSearch')}</li>`; // Add to locales
             return;
        }
        if (displayedCategories.length === 0 && allFetchedCategories.length > 0) { // No match but others exist
             categoriesListUl.innerHTML = `<li class="text-gray-500 p-3 text-center">${_('noCategoriesMatchSearch')}</li>`;
             return;
        }


        displayedCategories.forEach(cat => {
            const li = document.createElement('li');
            li.textContent = `${cat.name} (${cat.size})`;
            li.dataset.categoryName = cat.name;
            li.classList.add('category-item', 'p-2', 'hover:bg-blue-100', 'cursor-pointer', 'rounded');
            if (selectedCategories.has(cat.name)) {
                li.classList.add('selected', 'bg-blue-100', 'font-semibold');
            }
            li.addEventListener('click', () => toggleSelectCategory(cat, li));
            categoriesListUl.appendChild(li);
        });
    }

    function handleCategorySearch() {
        const searchTerm = categorySearchInput.value.trim();
        if (searchTerm !== currentCategorySearchTerm) {
            currentCategorySearchTerm = searchTerm;
            // If API supports prefix search efficiently and CirrusSearch is available,
            // we might re-fetch with prefix. Otherwise, client-side filter.
            // For simplicity, let's assume client-side filtering for now if categories are already loaded.
            // If the list is very large, fetching with prefix is better.
            if (mediaWikiApi.hasCirrusSearch || searchTerm.length > 2 || searchTerm.length === 0) { // Re-fetch with prefix
                fetchAndDisplayCategories(searchTerm, false);
            } else { // Client-side filter for short terms if many categories already loaded
                renderCategories(allFetchedCategories);
            }
        }
    }

    function loadMoreCategories() {
        fetchAndDisplayCategories(currentCategorySearchTerm, true);
    }

    function toggleSelectCategory(category, listItemElement) {
        const categoryName = category.name;
        if (selectedCategories.has(categoryName)) {
            selectedCategories.delete(categoryName);
            listItemElement.classList.remove('selected', 'bg-blue-100', 'font-semibold');
        } else {
            selectedCategories.set(categoryName, category);
            listItemElement.classList.add('selected', 'bg-blue-100', 'font-semibold');
        }
        renderSelectedCategories();
        updateFindIntersectionButtonState();
    }

    function renderSelectedCategories() {
        selectedCategoriesListUl.innerHTML = '';
        if (selectedCategories.size === 0) {
            selectedCategoriesPlaceholderDiv.classList.remove('hidden');
            return;
        }
        selectedCategoriesPlaceholderDiv.classList.add('hidden');

        selectedCategories.forEach(cat => {
            const li = document.createElement('li');
            li.classList.add('selected-category-item', 'flex', 'justify-between', 'items-center', 'p-2', 'bg-indigo-50', 'rounded', 'text-sm');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = cat.name;
            nameSpan.className = 'truncate';
            li.appendChild(nameSpan);

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;'; // A simple 'x'
            removeBtn.classList.add('remove-category-btn', 'ml-2', 'text-red-500', 'hover:text-red-700', 'font-bold');
            removeBtn.setAttribute('aria-label', _('removeCategoryLabel', cat.name)); // Add to locales: "Remove category {0}"
            removeBtn.onclick = () => {
                selectedCategories.delete(cat.name);
                renderSelectedCategories();
                updateFindIntersectionButtonState();
                // Also update the main category list's item appearance
                const mainListItem = categoriesListUl.querySelector(`li[data-category-name="${Utils.sanitizeHTML(cat.name)}"]`);
                if (mainListItem) {
                    mainListItem.classList.remove('selected', 'bg-blue-100', 'font-semibold');
                }
            };
            li.appendChild(removeBtn);
            selectedCategoriesListUl.appendChild(li);
        });
    }

    function updateFindIntersectionButtonState() {
        findIntersectionButton.disabled = selectedCategories.size === 0;
    }
    
    async function handleFindIntersection() {
        if (selectedCategories.size === 0) return;

        progressSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        progressBar.style.width = '0%';
        progressDetailsDiv.textContent = '';
        
        const categoryNames = Array.from(selectedCategories.keys());

        try {
            currentResults = await IntersectionFinder.fetchAndIntersect(mediaWikiApi, categoryNames, 
                (type, message, current, total) => {
                    // Update progress UI
                    progressStatusDiv.textContent = message;
                    if (total > 0) {
                        const percentage = Math.round((current / total) * 100);
                        progressBar.style.width = `${percentage}%`;
                    }
                    if (type === 'category') {
                        progressDetailsDiv.textContent = _('processingCategoryCount', current, total); // Add to locales
                    } else if (type === 'done') {
                         setTimeout(() => progressSection.classList.add('hidden'), 1000); // Hide after a short delay
                    }
                }
            );
            displayResultsPage(1); // Display first page of results
            resultsSection.classList.remove('hidden');

        } catch (error) {
            console.error("Intersection error:", error);
            Utils.displayConnectionStatus('error', _('genericError'), error.message); // Show error in main status
            progressSection.classList.add('hidden'); // Hide progress on error
        }
    }

function displayResultsPage(pageNumber) {
    currentPage = pageNumber;
    resultsTableBody.innerHTML = '';
    
    if (currentResults.length === 0) {
        noResultsMessageDiv.classList.remove('hidden');
        resultCountSpan.textContent = _('resultsCount', 0);
        paginationContainer.classList.add('hidden');
        return;
    }
    
    noResultsMessageDiv.classList.add('hidden');
    resultCountSpan.textContent = _('resultsCount', currentResults.length);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageResults = currentResults.slice(startIndex, endIndex);

    pageResults.forEach(page => {
        const row = resultsTableBody.insertRow();
        row.classList.add('hover:bg-gray-50', 'cursor-pointer', 'group'); // 添加悬停效果
        row.dataset.pageUrl = mediaWikiApi.getPageUrl(page.title);

        // 整行点击事件
        row.addEventListener('click', (e) => {
            // 排除点击链接的情况
            if (e.target.tagName !== 'A') {
                window.open(row.dataset.pageUrl, '_blank');
            }
        });

        // 标题列
        const titleCell = row.insertCell();
        const link = document.createElement('a');
        link.href = mediaWikiApi.getPageUrl(page.title);
        link.textContent = page.title;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.add(
    'page-link', 
    'text-lg',        // 增大字号
    'font-medium',    // 中等字重
    'hover:text-blue-800', // 悬停效果
    'transition-colors'    // 颜色过渡动画
);
        titleCell.appendChild(link);

        // 阻止链接点击冒泡
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 时间戳列
        const timeCell = row.insertCell();
        const date = new Date(page.timestamp);
        const formattedDate = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日, ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
        timeCell.textContent = formattedDate;
        timeCell.classList.add('text-gray-600');

        // 页面ID列
        const idCell = row.insertCell();
        idCell.textContent = page.pageid;
        idCell.classList.add('text-gray-500', 'font-mono');
    });

    const totalPages = Math.ceil(currentResults.length / itemsPerPage);
    Utils.renderPaginationControls(paginationContainer, currentPage, totalPages, displayResultsPage);
}
});
