myApp.controller('HomeController', function($scope, $http, $location) {

	$scope.currencies = [];
	$scope.currenciesStripped = [];
	$scope.currentAndPrevCurrencies = [];
	$scope.latestReportDates = [];
	$scope.sortType = 'currency';
	$scope.sortReverse = false;

	$http.get('/assets/currencies.json')
		.then(function(res){
			$scope.currencies = res.data;

			angular.forEach($scope.currencies, function(key, value) {
				$scope.latestReportDates.push(value);
		
			});
	
			angular.forEach($scope.currencies, function(value, key) {
				if(key == $scope.latestReportDates[$scope.latestReportDates.length-1] || 
					key == $scope.latestReportDates[$scope.latestReportDates.length-2]) {
						$scope.currentAndPrevCurrencies.push(value);
				}
			});

			angular.forEach($scope.currentAndPrevCurrencies[0].rates, function(value, key) {
				$scope.currenciesStripped.push(
					{
						"currency": key, 
						"rate": value, 
						"diff": value - $scope.currentAndPrevCurrencies[1].rates[key]
					}
				);
			});

			$scope.max = Math.max.apply(Math,$scope.currenciesStripped.map(function(item){
				return item.diff;
			}));

			$scope.formatNumber = function(i) {
				return Math.round(i * 100)/100; 
			}
	});
});