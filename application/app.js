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

        // Variable pour gérer la vue actuelle
        $scope.currentView = 'chart';
        $scope.currentTitle = 'Graphique Interactif (1990-2025)';

        // Fonction pour afficher une vue
        $scope.showView = function(view) {
            $scope.currentView = view;
            if (view === 'chart') {
                $scope.currentTitle = 'Graphique Interactif (1990-2025)';
                document.getElementById('chartContainer').style.display = 'block';
                document.getElementById('mapContainer').style.display = 'none';
            } else if (view === 'map') {
                $scope.currentTitle = 'Carte du Luxembourg';
                document.getElementById('chartContainer').style.display = 'none';
                document.getElementById('mapContainer').style.display = 'block';
                if (!$scope.mapInitialized) {
                    $scope.initMap();
                    $scope.mapInitialized = true;
                }
            }
        };

                $scope.updateChart = function() {
    const filteredData = {};
    for (let year = $scope.startYear; year <= $scope.endYear; year++) {
        if ($scope.data[year]) {
            filteredData[year] = $scope.data[year];
        }
    }

    const labels = Object.keys(filteredData);
    const retirement_age = labels.map(year => filteredData[year].retirement_age);
    const life_m = labels.map(year => parseFloat(filteredData[year].life_m));
    const life_f = labels.map(year => filteredData[year].life_f);

    const ctx = document.getElementById('myChart').getContext('2d');
    if ($scope.chart) {
        $scope.chart.destroy();
    }

    $scope.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Retirement Age',
                    data: retirement_age,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Life Expectancy Male',
                    data: life_m,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label: 'Life Expectancy Female',
                    data: life_f,
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
        };

        // Initialisation de la carte du Luxembourg
        $scope.initMap = function() {
            const luxembourgCoordinates = [49.8153, 6.1296];
            const zoomLevel = 9;

            $scope.map = L.map('map').setView(luxembourgCoordinates, zoomLevel);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo($scope.map);

            L.marker(luxembourgCoordinates).addTo($scope.map)
                .bindPopup('Luxembourg')
                .openPopup();
        };

        // Gestion du menu latéral
        $scope.toggleMenu = function() {
            const menu = document.getElementById('sideMenu');
            const main = document.getElementById('main');
            if (menu.style.width === '250px') {
                menu.style.width = '0';
                main.style.marginLeft = '0';
            } else {
                menu.style.width = '250px';
                main.style.marginLeft = '250px';
            }
        };

        $scope.closeMenu = function() {
            document.getElementById('sideMenu').style.width = '0';
            document.getElementById('main').style.marginLeft = '0';
        };

        // Afficher la vue par défaut
        $scope.showView('chart');
    });