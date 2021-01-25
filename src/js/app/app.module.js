angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
      controller: ["$scope", "$rootScope", appController],
    };

    function appController($scope, $rootScope) {
      $rootScope.titleList = makeDefaulData();
      $scope.currentTitleItem = null;

      $rootScope.$on('titleItemSelect', (event, titleItem) => {
        $scope.currentTitleItem = titleItem;
      });
    };
  })
  .directive("contentView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
      controller: ["$scope", "$rootScope", contentViewController],
    };

    function contentViewController($scope, $rootScope) {
      $scope.viewData = {
        order: 'title',
        onlyDate: false,
        searchTerm: '',
        newTitleItemTitle: '',
        selectedTitleItemId: null,
      };
      
      const sortTitleList = () => {
        const sortBy = $scope.viewData.order;
        $rootScope.titleList.sort((aItem, bItem) => aItem[sortBy] < bItem[sortBy] ? -1 : aItem[sortBy] > bItem[sortBy] ? 1 : 0);
      };

      sortTitleList();

      $scope.onOrderSelect = () => sortTitleList();
      
      $scope.filteredTitleList = () => {
        const term = $scope.viewData.searchTerm;
        return $rootScope.titleList.filter(item => item.title && item.title.includes(term));
      };

      $scope.onTitleInputClick = (titleItem) => {
        $scope.viewData.selectedTitleItemId = titleItem.id;
        $rootScope.$emit('titleItemSelect', titleItem);
      };

      $scope.addTitleItem = () => {
        $rootScope.titleList.push({
          id: makeDataId(),
          title: $scope.viewData.newTitleItemTitle,
          tags: [],
          date: new Date().toISOString(),
        });

        $scope.viewData.newTitleItemTitle = '';
      };
    };
  })
  .directive("sidebarView", () => {
    return {
      scope: {
        titleItem: '='
      },
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", sidebarViewController],
    };

    function sidebarViewController($scope) {
      $scope.viewData = {
        newTagName: ''
      };

      $scope.onTagRemove = (tagName) => {
        $scope.titleItem.tags = $scope.titleItem.tags.filter(tag => tag !== tagName);
      };

      $scope.onAddTag = () => {
        $scope.titleItem.tags.push($scope.viewData.newTagName);
        $scope.viewData.newTagName = '';
      };
      
    };
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })
  .directive("some1", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-2></some-2>",
    };
  })
  .directive("some2", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-3></some-3>",
    };
  })
  .directive("some3", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<summary-view></summary-view>",
    };
  })
  .directive("summaryView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
      controller: ["$scope", "$rootScope", summaryViewController],
    };

    function summaryViewController($scope, $rootScope) {
      $scope.getLastItemTitle = () => {
        return $rootScope.titleList.reduce((latestItem, titleItem) => latestItem.date > titleItem.date ? latestItem : titleItem).title;
      };

      $scope.uniqueTagsStrList = () => {
        return $rootScope.titleList.reduce((tagList, titleItem) => {
          const uniqueTags = titleItem.tags.filter(tag => tagList.indexOf(tag) < 0);
          return tagList.concat(uniqueTags);
        }, []).join(', ');
      };
    }
  });

