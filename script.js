let cities = points;
let population = [];
let bestRoute = [];
let generation = 0;
let fitnessData = [];
let populationSize = 100;
let mutationRate = 0.01;
let numGenerations = 500;
let elitismRate = 0.1;
let isRunning = false;

document.getElementById('startButton').addEventListener('click', startAlgorithm);
document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('clearPointsButton').addEventListener('click', clearAllPoints);

const infoIcon = document.getElementById('info-icon');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-btn')

infoIcon.addEventListener('click', function() {
    popup.style.display = 'block';
})

closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
})

window.addEventListener('click', function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

const modeIcon = document.getElementById('mode-icon');
const body = document.body

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    modeIcon.classList.remove('fa-moon');
    modeIcon.classList.add('fa-sun');
} else {
    body.classList.remove('light-mode');
    modeIcon.classList.remove('fa-sun');
    modeIcon.classList.add('fa-moon');
}

modeIcon.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
    drawPoints();
});

function startAlgorithm() {
    if (isRunning) {
        document.getElementById('clearPointsButton').style.display = 'none';
        return;
    }

    cities = [...points];

    if (cities.length === 0) {
        alert("Please add some points (cities) before starting the algorithm.");
        return;
    }

    populationSize = parseInt(document.getElementById('populationSize').value);
    mutationRate = parseFloat(document.getElementById('mutationRate').value);
    numGenerations = parseInt(document.getElementById('numGenerations').value);
    elitismRate = parseFloat(document.getElementById('elitismRate').value);

    population = [];
    for (let i = 0; i < populationSize; i++) {
        population.push(shuffle(cities.slice()));
    }
    fitnessData = [];

    isRunning = true;

    animate();
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function animate() {
    if (!isRunning) return;
    document.getElementById('clearPointsButton').style.display = 'none';

    if (generation < numGenerations) {
        population = nextGeneration(population);
        bestRoute = getBestRoute(population);
        const bestFitness = calculateTotalDistance(bestRoute);
        fitnessData.push(bestFitness);
        drawPoints(cities);
        drawRoute(bestRoute);
        updateChart();
        generation++;
        requestAnimationFrame(animate);
    }
}

function nextGeneration(population) {
  const newPopulation = [];

  population.sort((a, b) => calculateTotalDistance(a) - calculateTotalDistance(b));

  const numElites = Math.floor(population.length * elitismRate);
  for (let i = 0; i < numElites; i++) {
      newPopulation.push(population[i]);
  }

  while (newPopulation.length < population.length) {
      const parent1 = selectParents(population);
      const parent2 = selectParents(population);
      let child = crossover(parent1, parent2);
      mutate(child, mutationRate);
      newPopulation.push(child);
  }

  return newPopulation;
}


function reset() {
    isRunning = false;
    generation = 0;
    population = [];
    bestRoute = [];
    fitnessData = [];

    fitnessChart.data.labels = [];
    fitnessChart.data.datasets[0].data = [];

    fitnessChart.update();

    document.getElementById('clearPointsButton').style.display = 'none';

    if (points.length === 0) {
        visualizationMessage.innerText = 'Click to add a city';
        document.getElementById('clearPointsButton').style.display = 'none';
    } else {
        visualizationMessage.innerText = '';
        document.getElementById('clearPointsButton').style.display = 'inline-block';
    }

    drawPoints();
}



function getBestRoute(population) {
    let bestRoute = null;
    let bestDistance = Infinity;

    population.forEach(route => {
        const distance = calculateTotalDistance(route);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestRoute = route;
        }
    });

    return bestRoute;
}

function calculateTotalDistance(route) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const cityA = route[i];
        const cityB = route[i + 1];
        totalDistance += calculateDistance(cityA, cityB);
    }

    totalDistance += calculateDistance(route[route.length - 1], route[0]);
    return totalDistance;
}

function calculateDistance(cityA, cityB) {
    const dx = cityA.x - cityB.x;
    const dy = cityA.y - cityB.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function updateChart() {
    fitnessChart.data.labels.push(generation);
    fitnessChart.data.datasets[0].data = fitnessData;
    fitnessChart.update();
}

let fitnessChart = new Chart(document.getElementById('fitnessChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Best Fitness (Shortest Path Distance)',
            data: [],
            borderColor: '#ffffff',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Generation'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Fitness (Distance)'
                }
            }
        }
    }
});
