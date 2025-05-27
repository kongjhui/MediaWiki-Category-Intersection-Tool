/**
 * Module for calculating category intersections.
 */
const IntersectionFinder = {
    /**
     * Finds the intersection of multiple arrays of page objects.
     * Each page object is expected to have a 'pageid' property.
     * @param {Array<Array<Object>>} pageLists - An array of arrays, where each inner array contains page objects from a category.
     * @returns {Array<Object>} - An array of page objects that are present in all input lists.
     */
    findIntersection: (pageLists) => {
        if (!pageLists || pageLists.length === 0) {
            return [];
        }
        if (pageLists.length === 1) {
            return [...pageLists[0]]; // Return a copy
        }

        // Sort lists by length to optimize: smallest first
        pageLists.sort((a, b) => a.length - b.length);

        // Use the smallest list as the base for comparison
        const baseList = pageLists[0];
        const otherLists = pageLists.slice(1);

        // Create sets of pageids for faster lookups from other lists
        const pageIdSets = otherLists.map(list => new Set(list.map(page => page.pageid)));

        const intersection = baseList.filter(page => {
            // Check if the page's pageid is present in all other sets
            return pageIdSets.every(idSet => idSet.has(page.pageid));
        });

        return intersection;
    },

    /**
     * Fetches pages for selected categories and then finds their intersection.
     * @param {MediaWikiAPI} apiHandler - Instance of MediaWikiAPI.
     * @param {Array<string>} selectedCategoryNames - Array of category names.
     * @param {Function} progressCallback - Function to update progress (type, message, current, total).
     *        Types: 'category', 'calculation', 'done', 'error'
     * @returns {Promise<Array<Object>>} - Promise resolving to an array of intersecting page objects.
     */
    fetchAndIntersect: async (apiHandler, selectedCategoryNames, progressCallback) => {
        if (selectedCategoryNames.length === 0) {
            progressCallback('done', _('noCategoriesSelected'), 0, 0); // Add this key to locales
            return [];
        }

        const allCategoryPageLists = [];
        let totalCategories = selectedCategoryNames.length;
        let categoriesProcessed = 0;

        for (const categoryName of selectedCategoryNames) {
            categoriesProcessed++;
            progressCallback(
                'category', 
                _('progressStatusFetchingCategory', categoryName), 
                categoriesProcessed, 
                totalCategories
            );
            try {
                const pages = await apiHandler.fetchPagesInCategory(categoryName, (fetched, total) => {
                     // This inner progress can be logged or used for a sub-progress bar if desired
                     // console.log(`Fetched ${fetched} pages for ${categoryName}`);
                });
                allCategoryPageLists.push(pages);
            } catch (error) {
                progressCallback('error', _('fetchError', `${categoryName}: ${error.message}`), categoriesProcessed, totalCategories);
                throw error; // Propagate error to stop processing
            }
        }

        progressCallback('calculation', _('progressStatusCalculating'), totalCategories, totalCategories);
        // Add a small delay for UI to update before potentially blocking calculation
        await new Promise(resolve => setTimeout(resolve, 50)); 

        const intersectingPages = IntersectionFinder.findIntersection(allCategoryPageLists);
        
        progressCallback('done', _('progressStatusDone'), totalCategories, totalCategories);
        return intersectingPages;
    }
};
