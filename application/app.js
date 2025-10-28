angular.module('myApp', [])
    .controller('MainCtrl', function($scope, $http) {
        // Chargement des données JSON
        $http.get('data.json').then(function(response) {
            $scope.data = response.data;

            // Initialisation des années disponibles
            $scope.years = Object.keys($scope.data).map(Number).sort();
            $scope.startYear = $scope.years[0];
            $scope.endYear = $scope.years[$scope.years.length - 1];

            // Initialisation du graphique
            $scope.updateChart();
        });

        // Mise à jour du graphique en fonction des années sélectionnées
        $scope.updateChart = function() {
            const filteredData = {};
            for (let year = $scope.startYear; year <= $scope.endYear; year++) {
                if ($scope.data[year]) {
                    filteredData[year] = $scope.data[year];
                }
            }

            const labels = Object.keys(filteredData);
            const values = Object.values(filteredData);

            const ctx = document.getElementById('myChart').getContext('2d');
            if ($scope.chart) {
                $scope.chart.destroy();
            }

            $scope.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Valeurs',
                        data: values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        };
    });