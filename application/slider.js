function initYearSlider($scope, $timeout) {
    const slider = document.getElementById('yearSlider');
    const playButton = document.getElementById('playButton');
    let playInterval = null;
    let isPlaying = false;

    // Wait until Angular finishes rendering & digesting
    $timeout(() => {
        noUiSlider.create(slider, {
            start: [1990, 2000],  // or [$scope.years[0], $scope.years[$scope.years.length - 1]]
            connect: true,
            step: 1,
            range: {
                min: 1947,
                max: 2030
            },
            tooltips: [true, true],
            format: {
                to: value => Math.round(value),
                from: value => Number(value)
            }
        });

        slider.noUiSlider.on('update', (values, handle) => {
            $scope.$applyAsync(() => {
                $scope.startYear = Math.round(values[0]);
                $scope.endYear = Math.round(values[1]);
                $scope.updateChart();
            });
        });

        playButton.addEventListener('click', () => {
            if (!isPlaying) {
                isPlaying = true;
                playButton.textContent = '⏸ Pause';
                playInterval = setInterval(() => {
                    const [start, end] = slider.noUiSlider.get().map(Number);
                    if (end >= 2030) {
                        clearInterval(playInterval);
                        isPlaying = false;
                        playButton.textContent = '▶ Play';
                    } else {
                        slider.noUiSlider.set([start, end + 1]);
                    }
                }, 500);
            } else {
                clearInterval(playInterval);
                isPlaying = false;
                playButton.textContent = '▶ Play';
            }
        });
    });
}
