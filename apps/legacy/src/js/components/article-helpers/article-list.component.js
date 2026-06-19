class ArticleListCtrl {
  constructor(Articles, $scope) {
    'ngInject';

    this._Articles = Articles;

    // NOTE: bindings are NOT yet resolved in the constructor.
    // Initial load is deferred to $onInit where '@' bindings are guaranteed available.

    $scope.$on('setListTo', (ev, newList) => {
      this.setListTo(newList);
    });

    $scope.$on('setPageTo', (ev, pageNumber) => {
      this.setPageTo(pageNumber);
    });

  }

  $onInit() {
    this.setListTo(this.listConfig);
  }

  setListTo(newList) {
    // Set the current list to an empty array
    this.list = [];

    // Set listConfig to the new list's config
    this.listConfig = newList;

    this.runQuery();
  }

  setPageTo(pageNumber) {
    this.listConfig.currentPage = pageNumber;

    this.runQuery();
  }


  runQuery() {
    // Show the loading indicator
    this.loading = true;
    this.listConfig = this.listConfig || {};

    // Parse limit as integer - the '@' binding delivers it as a string
    const limit = parseInt(this.limit, 10);

    // Create an object for this query
    let queryConfig = {
      type: this.listConfig.type || undefined,
      filters: this.listConfig.filters || {}
    };

    // Set the limit filter from the component's attribute
    queryConfig.filters.limit = limit;

    // If there is no page set, set page as 1
    if (!this.listConfig.currentPage) {
      this.listConfig.currentPage = 1;
    }

    // Add the offset filter
    queryConfig.filters.offset = (limit * (this.listConfig.currentPage - 1));

    // Run the query
    this._Articles
      .query(queryConfig)
      .then(
        (res) => {
          this.loading = false;

          // Update list and total pages
          this.list = res.articles;

          this.listConfig.totalPages = Math.ceil(res.articlesCount / limit);
        }
      );
  }

}

let ArticleList = {
  bindings: {
    limit: '@',
    listConfig: '='
  },
  controller: ArticleListCtrl,
  templateUrl: 'components/article-helpers/article-list.html'
};

export default ArticleList;
