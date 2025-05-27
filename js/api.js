/**
 * MediaWiki API interaction module
 * Handles all interaction with the MediaWiki API.
 */

class MediaWikiAPI {
    constructor(getStringFn) {
        this.apiUrl = '';
        this.siteName = '';
        this.siteBaseUrl = '';
        this.hasCirrusSearch = false;
        this._ = getStringFn || ((key, ...args) => key); // Fallback if not provided
        this.MAX_REQUEST_LIMIT = 500; // Default for most wikis (logged-in users might have 5000)
    }

    async validateConnection(url) {
        this.apiUrl = url.trim();
        if (!this.apiUrl.endsWith('api.php')) {
            if (this.apiUrl.endsWith('/')) {
                this.apiUrl += 'api.php';
            } else if (!this.apiUrl.includes('api.php')) {
                this.apiUrl += '/api.php';
            }
        }

        try {
            const response = await fetch(`${this.apiUrl}?action=query&meta=siteinfo&siprop=general|extensions&format=json&origin=*`);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            
            if (!data.query?.general?.generator) {
                throw new Error(this._('connectionErrorInvalidEndpoint'));
            }
            
            this.siteName = data.query.general.sitename;
            this.siteBaseUrl = data.query.general.base;
            this.hasCirrusSearch = data.query.extensions?.some(ext => 
                ext.name === 'CirrusSearch' || ext.name === 'Elasticsearch'
            );

            return {
                success: true,
                siteName: this.siteName,
                siteBaseUrl: this.siteBaseUrl,
                hasCirrusSearch: this.hasCirrusSearch,
                apiUrl: this.apiUrl
            };
        } catch (error) {
            console.error("Validation error:", error);
            return { success: false, error: error.message };
        }
    }

    async fetchCategories(prefix = '', continueFrom = '') {
        if (!this.apiUrl) throw new Error(this._('apiUrlNotSetError', 'fetchCategories'));

        try {
            let reqUrl = `${this.apiUrl}?action=query&list=allcategories&acprop=size&format=json&origin=*&aclimit=${this.MAX_REQUEST_LIMIT}`;
            if (prefix) reqUrl += `&acprefix=${encodeURIComponent(prefix)}`;
            if (continueFrom) reqUrl += `&accontinue=${encodeURIComponent(continueFrom)}`;

            const response = await fetch(reqUrl);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            
            return {
                categories: data.query.allcategories.map(category => ({
                    name: category['*'],
                    size: category.size || 0,
                })),
                continueToken: data.continue?.accontinue || null
            };
        } catch (error) {
            console.error(this._('fetchError', error.message));
            throw error;
        }
    }

    /**
     * 修改重点：添加 timestamp 支持
     */
    async fetchPagesInCategory(categoryName, progressCallback) {
        if (!this.apiUrl) throw new Error(this._('apiUrlNotSetError', 'fetchPagesInCategory'));

        let allPages = [];
        let continueToken = null;
        let fetchedCount = 0;

        const fetchBatch = async (cmcontinue) => {
            // 添加 cmprop=ids|title|timestamp 参数
            let reqUrl = `${this.apiUrl}?action=query&list=categorymembers` + 
                `&cmtitle=Category:${encodeURIComponent(categoryName)}` +
                `&cmlimit=${this.MAX_REQUEST_LIMIT}&format=json&origin=*` +
                `&cmprop=ids|title|timestamp`;  // 关键修改

            if (cmcontinue) reqUrl += `&cmcontinue=${encodeURIComponent(cmcontinue)}`;

            const response = await fetch(reqUrl);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();

            // 提取 timestamp 字段
            const members = data.query.categorymembers || [];
            allPages.push(...members.map(m => ({
                pageid: m.pageid,
                title: m.title,
                ns: m.ns,
                timestamp: m.timestamp  // 新增字段
            })));
            
            fetchedCount += members.length;
            if (progressCallback) progressCallback(fetchedCount, null);
            
            return data.continue?.cmcontinue || null;
        };

        try {
            continueToken = await fetchBatch(null);
            while (continueToken) {
                await new Promise(resolve => setTimeout(resolve, 50));
                continueToken = await fetchBatch(continueToken);
            }
            return allPages;
        } catch (error) {
            console.error(this._('fetchError', `fetching pages for ${categoryName}: ${error.message}`));
            throw error;
        }
    }

    getPageUrl(pageTitle) {
        let baseUrl = this.apiUrl.replace(/\/api\.php.*$/i, '');
        if (baseUrl === this.apiUrl) {
            baseUrl = this.apiUrl.substring(0, this.apiUrl.lastIndexOf('/'));
        }
        return `${baseUrl}/index.php?title=${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
    }
}

const mediaWikiAPI = new MediaWikiAPI(typeof _getString === 'function' ? _getString : undefined);