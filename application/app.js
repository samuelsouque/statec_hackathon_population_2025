angular.module('myApp', [])
    .controller('MainCtrl', function($scope, $http, $timeout) {
        // Load graph data
        $http.get('data.json').then(function(response) {
            $scope.data = response.data;

            // Init years available
            $scope.years = Object.keys($scope.data).map(Number).sort();
            $scope.startYear = $scope.years[0];
            $scope.endYear = $scope.years[$scope.years.length - 1];

            // Init graph
            $scope.updateChart();

            // Initialize slider (pass the $scope)
            initYearSlider($scope, $timeout);

        });

        // Load map data
        $http.get('Population_65plus_long 1.json').then(function(response) {
            $scope.pop65 = response.data;
        });

        // Variables of current view
        $scope.currentView = 'chart';
        $scope.currentTitle = "Évolution de l'espérance de vie, de l'âge moyen de départ à la retraite et du nombre de pensionnés au Luxembourg, de 1990 à 2025";

        // Function to show a view
        $scope.showView = function(view) {
            $scope.currentView = view;
            if (view === 'chart') {
                $scope.currentTitle = "Évolution de l'espérance de vie, de l'âge moyen de départ à la retraite et du nombre de pensionnés au Luxembourg, de 1990 à 2025";
                document.getElementById('chartContainer').style.display = 'block';
                document.getElementById('mapContainer').style.display = 'none';
            } else if (view === 'map') {
                $scope.currentTitle = 'Répartition des personnes âgée de 65 et plus par commune';
                document.getElementById('chartContainer').style.display = 'none';
                document.getElementById('mapContainer').style.display = 'block';
                if (!$scope.mapInitialized) {
                    $scope.initMap();
                    $scope.mapInitialized = true;
                }
            } else if (view === 'info'){
                $scope.currentTitle = 'Activité, services et associations pour seniors par commune';
                document.getElementById('chartContainer').style.display = 'none';
                document.getElementById('mapContainer').style.display = 'none';
                document.getElementById('infoContainer').style.display = 'block';
            }
        };

        // Order of views for navigation
        $scope.views = ['chart', 'map', 'info'];

        // Function to go to the next view
        $scope.nextPage = function() {
            let currentIndex = $scope.views.indexOf($scope.currentView);
            let nextIndex = (currentIndex + 1) % $scope.views.length; // Loop around
            $scope.showView($scope.views[nextIndex]);
        };

        // Function to go to the previous view
        $scope.previousPage = function() {
            let currentIndex = $scope.views.indexOf($scope.currentView);
            let prevIndex = (currentIndex - 1 + $scope.views.length) % $scope.views.length; // Loop around
            $scope.showView($scope.views[prevIndex]);
        };



        // Init graph
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

    if ($scope.chart) {
        // Update existing chart data smoothly
        $scope.chart.data.datasets = datasets;
        $scope.chart.update('none'); // 'none' mode prevents animation
    } else {
        // Create it once
        $scope.chart = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                animation: {
                    duration: 0 // Disable initial animation
                },
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
    }
};


        // Init Luxembourg's map
        $scope.initMap = function() {
            const luxembourgCoordinates = [49.8153, 6.1296];
            const zoomLevel = 9;

            $scope.map = L.map('map').setView(luxembourgCoordinates, zoomLevel);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo($scope.map);

            //L.marker(luxembourgCoordinates).addTo($scope.map)
            //    .bindPopup('Luxembourg')
            //    .openPopup();

            // Administrative limits of Luxembourg
            $http.get('limadmin.geojson').then(function(response) {
                var geojson = response.data['communes'];

                var filtered_pop65 = $scope.pop65.filter(item => item.YEAR === "2025") // Year between "2020" and "2025"

                var pop65ByCommune = filtered_pop65.reduce(function(acc, item) {
                    if (!acc[item.COMMUNE_NOM]) {
                        acc[item.COMMUNE_NOM] = [];
                    }
                    acc[item.COMMUNE_NOM].push(item);
                    return acc;
                }, {});

                L.geoJSON(geojson, {
                    style: function(feature) {
                        if ((typeof pop65ByCommune[feature.properties.COMMUNE] === 'undefined') || (typeof (pop65ByCommune[feature.properties.COMMUNE][0]) === 'undefined')) {
                            console.log(feature.properties.COMMUNE)//, pop65ByCommune[feature.properties.COMMUNE][0]['PERC65PLUS'])
                        } else {
                        return {
                            //color: $scope.getColor(feature.properties.PERC65PLUS),
                            weight: 1,
                            fillColor: $scope.getColor(pop65ByCommune[feature.properties.COMMUNE][0]['PERC65PLUS']),
                            fillOpacity: 0.7
                        };
                    }
                }
                }).addTo($scope.map);
            });

            // Add legend
            // const legend = L.control({ position: 'bottomright' });
            // legend.onAdd = function(map) {
            // const div = L.DomUtil.create('div', 'info legend');
            // const grades = [0, 4.07, 8.135, 12.2, 16.27];
            // const labels = [];
            // grades.forEach((grade, index) => {
            //     labels.push(
            //     `<i style="background:${getColor(grade)}"></i> ${grade}${grades[index + 1] ? `–${grades[index + 1]}` : '+'}`
            //     );
            // });
            // div.innerHTML = labels.join('<br>');
            // return div;
            // };
            // legend.addTo($scope.map);
        };

        // Function for heatmap color
        $scope.getColor = function(value) {
            const scale = chroma.scale(['blue', 'green', 'red']).domain([0, 16.27]);
            return scale(value).hex();
        }

        // Lateral menu
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

        // Default view
        $scope.showView('chart');
    })
    .controller('SearchCtrl', function($scope, $http) {
        $scope.allData = [];
        $scope.filteredResults = [];

        // Load Excel file
        $http.get('liens_seniors_hackathon.xlsx', { responseType: 'arraybuffer' }).then(function(response) {
            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            // json will now look like:
            // [
            //   { commune: "Beaufort", lien: "https://...", "texte lien": "Centre de jour paiperleck" },
            //   { commune: "Bech", lien: "https://...", "texte lien": "Le Service Seniors" },
            //   ...
            // ]
            $scope.allData = json;
            $scope.filteredResults = [...$scope.allData];
        });


        $scope.filterResults = function() {
            const query = ($scope.searchQuery || '').toLowerCase();
            $scope.filteredResults = $scope.allData.filter(item =>
                item.commune.toLowerCase().includes(query)
            );
};


    });