const translations = {
    en: {
        title: "MediaWiki Category Intersection Tool",
        headerTitle: "MediaWiki Category Intersection Tool",
        headerSubtitle: "Find pages belonging to multiple categories simultaneously",
        showUsageInstructions: "Show Usage Instructions",
        hideUsageInstructions: "Hide Usage Instructions",
        usageInstructionsTitle: "Usage Instructions",
        usageInstructionsStep1: "<strong>Connect to Site:</strong> In the \"MediaWiki Site Connection\" section, enter the full URL of the <code>api.php</code> file for the target MediaWiki site (e.g., <code>https://en.wikipedia.org/w/api.php</code>), then click the \"Connect and Load Categories\" button.",
        usageInstructionsStep2: "<strong>Select Categories:</strong> Once connected, you can browse or search for categories in the \"Category Selection\" section. Click on a category name to add it to the \"Selected Categories\" list. You can select multiple categories.",
        usageInstructionsStep3: "<strong>Find Intersection:</strong> After selecting all desired categories, click the \"Find Pages in All Selected Categories\" button. The tool will begin fetching and calculating the intersection of pages within these categories.",
        usageInstructionsStep4: "<strong>View Results:</strong> Once processing is complete, the \"Intersection Results\" section will display a list of pages that belong to all selected categories. Pagination will be provided if there are many results.",
        siteInputTitle: "MediaWiki Site Connection",
        apiUrlLabel: "MediaWiki API URL",
        apiUrlPlaceholder: "e.g., https://en.wikipedia.org/w/api.php",
        apiUrlHelp: "Enter the full URL of the api.php for your MediaWiki site",
        connectButton: "Connect and Load Categories",
        connecting: "Connecting...",
        connectionSuccess: "Successfully connected to:",
        connectionFailed: "Connection failed:",
        connectionErrorInvalidEndpoint: "Invalid API endpoint or not a MediaWiki site.",
        apiWarningCirrusSearchDetection: "Could not reliably detect CirrusSearch/Elasticsearch extension: ",
        categorySelectionTitle: "Category Selection",
        searchCategoriesLabel: "Search Categories",
        searchCategoriesPlaceholder: "Type to search categories...",
        categoriesPlaceholder: "Connect to a MediaWiki site to load categories.",
        categoriesLoading: "Loading categories...",
        loadMoreButton: "Load More Categories",
        selectedCategoriesTitle: "Selected Categories",
        selectedCategoriesPlaceholder: "No categories selected.",
        findIntersectionButton: "Find Pages in All Selected Categories",
        progressTitle: "Processing Request",
        progressStatusLoading: "Loading data...",
        progressStatusFetchingCategory: "Fetching pages for category:",
        progressStatusCalculating: "Calculating intersection...",
        progressStatusDone: "Processing complete.",
        resultsTitle: "Intersection Results",
        noResultsMessage: "No pages found belonging to all selected categories.",
        pageTitleHeader: "Page Title",
        resultsCount: (count) => `${count} page(s) found.`,
        fetchError: "Error fetching data: ",
        genericError: "An unexpected error occurred.",
        confirmRemoveCategory: (categoryName) => `Are you sure you want to remove category "${categoryName}"?`,
        footerText: "MediaWiki Category Intersection Tool - Built by Neo",
        paginationPrevious: "Previous",
        paginationNext: "Next",
        lastModifiedHeader: "Last Modified",
        pageIdHeader: "Page ID",
        footerText: "MediaWiki Category Intersection Tool - Copyright &copy; 2025 公子猫",
        clickRowHint: "Click anywhere on row to open page",
        pageIndicator: (currentPage, totalPages) => `Page ${currentPage} of ${totalPages}`,
    },
    zh: {
        title: "MediaWiki 分类交集工具",
        headerTitle: "MediaWiki 分类交集工具",
        headerSubtitle: "查找同时属于多个分类的页面",
        showUsageInstructions: "显示使用说明",
        hideUsageInstructions: "隐藏使用说明",
        usageInstructionsTitle: "使用说明",
        usageInstructionsStep1: "<strong>连接站点：</strong> 在 “MediaWiki 站点连接” 部分输入目标 MediaWiki 站点的 <code>api.php</code> 文件的完整 URL (例如：<code>https://zh.wikipedia.org/w/api.php</code>)，然后点击 “连接并加载分类” 按钮。",
        usageInstructionsStep2: "<strong>选择分类：</strong> 连接成功后，可在 “分类选择” 部分浏览或搜索分类。点击分类名称将其添加到 “已选分类” 列表。您可以选择多个分类。",
        usageInstructionsStep3: "<strong>查找交集：</strong> 选择完所有目标分类后，点击 “查找所有已选分类中的页面” 按钮。工具将开始获取并计算这些分类下的页面交集。",
        usageInstructionsStep4: "<strong>查看结果：</strong> 处理完成后，“交集结果” 部分将显示同时属于所有已选分类的页面列表。如果结果过多，将提供分页导航。",
        siteInputTitle: "MediaWiki 站点连接",
        apiUrlLabel: "MediaWiki API URL",
        apiUrlPlaceholder: "例如：https://zh.wikipedia.org/w/api.php",
        apiUrlHelp: "请输入 MediaWiki 站点的 api.php 完整 URL",
        connectButton: "连接并加载分类",
        connecting: "连接中...",
        connectionSuccess: "成功连接至：",
        connectionFailed: "连接失败：",
        connectionErrorInvalidEndpoint: "无效的 API 端点或不是 MediaWiki 站点。",
        apiWarningCirrusSearchDetection: "无法可靠检测 CirrusSearch/Elasticsearch 扩展：",
        categorySelectionTitle: "分类选择",
        searchCategoriesLabel: "搜索分类",
        searchCategoriesPlaceholder: "输入以搜索分类...",
        categoriesPlaceholder: "连接到 MediaWiki 站点以加载分类。",
        categoriesLoading: "正在加载分类...",
        loadMoreButton: "加载更多分类",
        selectedCategoriesTitle: "已选分类",
        selectedCategoriesPlaceholder: "未选择任何分类。",
        findIntersectionButton: "查找所有已选分类中的页面",
        progressTitle: "处理请求",
        progressStatusLoading: "加载数据...",
        progressStatusFetchingCategory: "正在获取分类页面：",
        progressStatusCalculating: "正在计算交集...",
        progressStatusDone: "处理完成。",
        resultsTitle: "交集结果",
        noResultsMessage: "未找到属于所有已选分类的页面。",
        pageTitleHeader: "页面标题",
        resultsCount: (count) => `共找到 ${count} 个页面。`,
        fetchError: "获取数据时出错：",
        genericError: "发生意外错误。",
        confirmRemoveCategory: (categoryName) => `您确定要移除分类 “${categoryName}” 吗？`,
        footerText: "MediaWiki 分类交集工具 - 由 Neo 构建",
        paginationPrevious: "上一页",
        paginationNext: "下一页",
        lastModifiedHeader: "最后修改时间",
        pageIdHeader: "页面ID",
        footerText: "MediaWiki 分类交集工具 - Copyright &copy; 2025 公子猫",
clickRowHint: "点击行任意位置访问页面",
        pageIndicator: (currentPage, totalPages) => `第 ${currentPage} 页 / 共 ${totalPages} 页`,
    }
};

let currentLanguage = 'zh';

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (translations[lang] && translations[lang][key]) {
            if (typeof translations[lang][key] === 'function') {
                // Placeholder for functions that need arguments, currently not used for static text
                // If you need to pass args, you'll need a more complex setup
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    document.querySelectorAll('[data-lang-key-placeholder]').forEach(el => {
        const key = el.dataset.langKeyPlaceholder;
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update dynamic text like button text based on state
    const instructionsButton = document.getElementById('toggle-instructions-button');
    const instructionsContent = document.getElementById('usage-instructions-content');
    if (instructionsButton && instructionsContent) {
        const textSpan = instructionsButton.querySelector('span');
        if (textSpan) {
            textSpan.textContent = instructionsContent.classList.contains('hidden') ?
                _('showUsageInstructions') : _('hideUsageInstructions');
        }
    }
}

function _(key, ...args) {
    const stringTemplate = translations[currentLanguage]?.[key] || translations.en?.[key];
    if (typeof stringTemplate === 'function') {
        return stringTemplate(...args);
    }
    if (typeof stringTemplate === 'string') {
        // Basic placeholder replacement, e.g., "{0}"
        let result = stringTemplate;
        args.forEach((arg, index) => {
            result = result.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
        });
        return result;
    }
    return key; // Fallback to key if not found
}

document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-switcher button');
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            setLanguage(button.dataset.lang);
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    // Set initial language based on active button or default
    const activeLangButton = document.querySelector('.lang-switcher button.active');
    if (activeLangButton) {
        setLanguage(activeLangButton.dataset.lang);
    } else {
        setLanguage(currentLanguage); // default 'zh'
        document.getElementById(`lang-${currentLanguage}`)?.classList.add('active');
    }
});
