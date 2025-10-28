angular.module('myApp', [])
    .controller('MainCtrl', function($scope, $http) {
        // Load graph data
        $http.get('data.json').then(function(response) {
            $scope.data = response.data;

            // Init years available
            $scope.years = Object.keys($scope.data).map(Number).sort();
            $scope.startYear = $scope.years[0];
            $scope.endYear = $scope.years[$scope.years.length - 1];

            // Init graph
            $scope.updateChart();
        });

        // Load map data
        $http.get('POP65PLUS_commune_total.json').then(function(response) {
            $scope.pop65 = response.data;
        });

        // Variables of current view
        $scope.currentView = 'chart';
        $scope.currentTitle = 'Graphique Interactif (1990-2025)';

        // Function to show a view
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

        // Init graph
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

        // Init Luxembourg's map
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

            // Administrative limits of Luxembourg
            $http.get('limadmin.geojson').then(function(response) {
                var geojson = response.data['communes'];

                var filtered_pop65 = $scope.pop65.filter(item => item.YEAR === '2024')

                var pop65ByCommune = filtered_pop65.reduce(function(acc, item) {
                    if (!acc[item.COMMUNE_NOM]) {
                        acc[item.COMMUNE_NOM] = [];
                    }
                    acc[item.COMMUNE_NOM].push(item);
                    return acc;
                }, {});

                L.geoJSON(geojson, {
                    style: function(feature) {
                        if ((typeof pop65ByCommune[feature.properties.COMMUNE] !== 'undefined') && (typeof (pop65ByCommune[feature.properties.COMMUNE][0]) !== 'undefined')) {
                        console.log(feature.properties.COMMUNE, pop65ByCommune[feature.properties.COMMUNE][0]['PERC65PLUS'])
                        return {
                            //color: $scope.getColor(feature.properties.PERC65PLUS),
                            weight: 0,
                            fillColor: $scope.getColor(pop65ByCommune[feature.properties.COMMUNE][0]['PERC65PLUS']),
                            fillOpacity: 0.5
                        };
                    }
                }
                }).addTo($scope.map);
                    // if (feature.properties.COMMUNE === "Diekirch") { // Fill other countries in grey
                    //     return {
                    //         //color: "#cccccc",
                    //         weight: 0,
                    //         fillColor: "red",
                    //         fillOpacity: 0.5
                    //     };
                    // } else if ( feature.properties.COMMUNE === "Bettendorf") {// No fill for Luxembourg
                    //     return {
                    //         //color: "white",
                    //         weight: 0,
                    //         fillColor: "blue",
                    //         fillOpacity: 0.5
                    //     };
                    // }
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
    });
