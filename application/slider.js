// slider.js
function initYearSlider($scope) {
    const slider = document.getElementById('yearSlider');
    const playButton = document.getElementById('playButton');
    let playInterval = null;
    let isPlaying = false;

    noUiSlider.create(slider, {
        start: [$scope.years[0], $scope.years[$scope.years.length - 1]],
        connect: true,
        step: 1,
        range: {
            min: $scope.years[0],
            max: $scope.years[$scope.years.length - 1]
        },
        tooltips: [true, true],
        format: {
            to: value => Math.round(value),
            from: value => Number(value)
        }
    });

    // --- Listen to slider movement ---
    slider.noUiSlider.on('update', function(values) {
        const start = parseInt(values[0]);
        const end = parseInt(values[1]);
        if ($scope.startYear !== start || $scope.endYear !== end) {
            $scope.$apply(() => {
                $scope.startYear = start;
                $scope.endYear = end;
                $scope.updateChart();
            });
        }
    });

    // --- Stop animation if user interacts ---
    slider.noUiSlider.on('start', () => stopAnimation());

    // --- Play / Pause Button ---
    playButton.addEventListener('click', () => {
        if (!isPlaying) startAnimation();
        else stopAnimation();
    });

    function startAnimation() {
        isPlaying = true;
        playButton.textContent = '⏸ Pause';
        const maxYear = $scope.years[$scope.years.length - 1];

        playInterval = setInterval(() => {
            const values = slider.noUiSlider.get().map(Number);
            let [start, end] = values;

            if (end >= maxYear) {
                stopAnimation();
                return;
            }

            end += 1;
            slider.noUiSlider.set([start, end]); // Move right handle only
        }, 500); // Change speed here (1000ms = 1 second)
    }

    function stopAnimation() {
        if (playInterval) clearInterval(playInterval);
        isPlaying = false;
        playButton.textContent = '▶️ Play';
    }
}
