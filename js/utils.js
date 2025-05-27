/**
 * Utility functions for the MediaWiki Category Intersection Tool
 */
const Utils = {
    /**
     * Debounces a function to limit the rate at which it's called.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The debounce delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    },

    /**
     * Renders pagination controls.
     * @param {HTMLElement} container - The HTML element to render pagination into.
     * @param {number} currentPage - The current active page.
     * @param {number} totalPages - The total number of pages.
     * @param {Function} onPageClickCallback - Callback function when a page button is clicked, receives page number.
     */
    renderPaginationControls: (container, currentPage, totalPages, onPageClickCallback) => {
        container.innerHTML = ''; // Clear existing controls
        if (totalPages <= 1) {
            container.classList.add('hidden');
            return;
        }
        container.classList.remove('hidden');

        const createButton = (text, page, isDisabled = false, isActive = false, isIcon = false) => {
            const button = document.createElement('button');
            button.classList.add('pagination-button');
            if (isActive) button.classList.add('active');
            if (isIcon) {
                 button.innerHTML = text; // For SVG icons or text like "«"
            } else {
                button.textContent = text;
            }
            button.disabled = isDisabled;
            if (!isDisabled) {
                button.addEventListener('click', () => onPageClickCallback(page));
            }
            return button;
        };

        // Previous Button
        container.appendChild(createButton(_('paginationPrevious'), currentPage - 1, currentPage === 1));
        
        // Page Number Buttons
        const maxVisiblePages = 5; // Max number of page buttons to show (excluding prev/next)
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            container.appendChild(createButton('1', 1));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'px-2 py-1 text-gray-500';
                container.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            container.appendChild(createButton(i.toString(), i, false, i === currentPage));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'px-2 py-1 text-gray-500';
                container.appendChild(ellipsis);
            }
            container.appendChild(createButton(totalPages.toString(), totalPages));
        }

        // Next Button
        container.appendChild(createButton(_('paginationNext'), currentPage + 1, currentPage === totalPages));
    
        // Optional: Page indicator text
        const pageInfo = document.createElement('div');
        pageInfo.className = 'ml-3 text-sm text-gray-600 hidden md:block';
        pageInfo.textContent = _('pageIndicator', currentPage, totalPages);
        container.appendChild(pageInfo);
    },


    /**
     * Displays a status message (e.g., for API connection).
     * @param {string} type - 'success' or 'error'.
     * @param {string} message - The message to display.
     * @param {string} [details=''] - Additional details for the message.
     */
    displayConnectionStatus: (type, message, details = '') => {
        const statusContainer = document.getElementById('connection-status');
        statusContainer.innerHTML = ''; // Clear previous messages
        statusContainer.classList.remove('hidden');

        const alertDiv = document.createElement('div');
        alertDiv.className = 'p-4 rounded-md';
        
        let titleText = '';
        if (type === 'success') {
            alertDiv.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-200');
            titleText = _('connectionSuccess');
        } else if (type === 'error') {
            alertDiv.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
            titleText = _('connectionFailed');
        } else { // 'info' or 'warning'
             alertDiv.classList.add('bg-blue-50', 'text-blue-700', 'border', 'border-blue-200');
             titleText = message; // Use message as title for info
             message = details; // Use details as main message content
        }

        const titleSpan = document.createElement('strong');
        titleSpan.className = 'font-semibold';
        titleSpan.textContent = titleText;
        
        alertDiv.appendChild(titleSpan);
        if (message && type !== 'info' && type !== 'warning') { // Don't add message again if it was used as title
             alertDiv.appendChild(document.createTextNode(` ${message}`));
        }
         if (details && (type === 'info' || type === 'warning')) { // For info/warning, details become the main content
            const detailText = document.createElement('p');
            detailText.className = 'text-sm';
            detailText.textContent = details;
            alertDiv.appendChild(detailText);
        } else if (details) { // For success/error, details are additional
            const detailText = document.createElement('p');
            detailText.className = 'text-sm mt-1';
            detailText.textContent = details;
            alertDiv.appendChild(detailText);
        }


        statusContainer.appendChild(alertDiv);
    },

    /**
     * Shows or hides a loading indicator.
     * @param {HTMLElement} element - The loading indicator element.
     * @param {boolean} show - True to show, false to hide.
     */
    toggleLoading: (element, show) => {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    },

    /**
     * Sanitizes HTML string to prevent XSS.
     * A very basic sanitizer. For production, use a robust library.
     * @param {string} str - The string to sanitize.
     * @returns {string} - The sanitized string.
     */
    sanitizeHTML: (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};
