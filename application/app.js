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

            // Initialize slider (pass the $scope)
            initYearSlider($scope);
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
        if ($scope.data[year]) filteredData[year] = $scope.data[year];
    }

    const datasets = [];

    // Helper to split into past/future for line datasets
    function splitByYear(dataObj, key, color, labelBase) {
        const past = [];
        const future = [];
        for (const yearStr of Object.keys(dataObj)) {
            const year = parseInt(yearStr);
            const d = dataObj[yearStr];
            if (d[key] != null) {
                const point = { x: year, y: parseFloat(d[key]) };
                (year > 2024 ? future : past).push(point);
            }
        }
        if (past.length) {
            datasets.push({
                label: `${labelBase} (observed)`,
                data: past,
                borderColor: color,
                tension: 0.1,
                fill: false,
                yAxisID: 'y1'
            });
        }
        if (future.length) {
            datasets.push({
                label: `${labelBase} (expected)`,
                data: future,
                borderColor: color,
                borderDash: [6, 4],
                tension: 0.1,
                fill: false,
                yAxisID: 'y1'
            });
        }
    }

    // --- Line datasets
    splitByYear(filteredData, 'retirement_age', 'rgb(75, 192, 192)', 'Retirement Age');
    splitByYear(filteredData, 'life_m', 'rgb(255, 99, 132)', 'Life Expectancy Male');
    splitByYear(filteredData, 'life_f', 'rgb(54, 162, 235)', 'Life Expectancy Female');

    // --- Bar (histogram) dataset: split past/future too
    const pointsBeneficiaryPast = [];
    const pointsBeneficiaryFuture = [];
    for (const yearStr of Object.keys(filteredData)) {
        const year = parseInt(yearStr);
        const d = filteredData[yearStr];
        if (d.beneficiary_avg !== null) {
            const point = { x: year, y: d.beneficiary_avg };
            (year > 2024 ? pointsBeneficiaryFuture : pointsBeneficiaryPast).push(point);
        }
    }

    if (pointsBeneficiaryPast.length) {
        datasets.push({
            label: 'Beneficiaries (avg, observed)',
            data: pointsBeneficiaryPast,
            type: 'bar',
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            borderColor: 'rgb(255, 206, 86)',
            borderWidth: 1,
            yAxisID: 'y2'
        });
    }

    if (pointsBeneficiaryFuture.length) {
        datasets.push({
            label: 'Beneficiaries (avg, expected)',
            data: pointsBeneficiaryFuture,
            type: 'bar',
            backgroundColor: 'rgba(255, 206, 86, 0.3)', // lighter
            borderColor: 'rgba(255, 206, 86, 0.6)',
            borderWidth: 1,
            yAxisID: 'y2'
        });
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    if ($scope.chart) $scope.chart.destroy();

    $scope.chart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Year' }
                },
                y1: {
                    position: 'left',
                    title: { display: true, text: 'Years / Expectancy' },
                    beginAtZero: false
                },
                y2: {
                    position: 'right',
                    title: { display: true, text: 'Beneficiaries (avg)' },
                    grid: { drawOnChartArea: false },
                    beginAtZero: true
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