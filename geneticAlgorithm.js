function crossover(parent1, parent2) {
  const start = Math.floor(Math.random() * parent1.length);
  const end = Math.floor(Math.random() * parent1.length);
  const child = [];
  for (let i = 0; i < parent1.length; i++) {
      child[i] = null;
  }

  for (let i = start; i < end; i++) {
      child[i] = parent1[i];
  }

  let currentIndex = 0;
  for (let i = 0; i < parent2.length; i++) {
      if (!child.includes(parent2[i])) {
          while (child[currentIndex] !== null) {
              currentIndex++;
          }
          child[currentIndex] = parent2[i];
      }
  }
  return child;
}

function mutate(route, mutationRate) {
  for (let i = 0; i < route.length; i++) {
      if (Math.random() < mutationRate) {
          const swapIndex = Math.floor(Math.random() * route.length);
          const temp = route[i];
          route[i] = route[swapIndex];
          route[swapIndex] = temp;
      }
  }
}

function selectParents(population, cities) {
  const totalFitness = population.reduce((acc, route) => acc + (1 / calculateTotalDistance(route)), 0);
  const randomFitness = Math.random() * totalFitness;
  let runningSum = 0;
  for (let i = 0; i < population.length; i++) {
      runningSum += (1 / calculateTotalDistance(population[i]));
      if (runningSum >= randomFitness) {
          return population[i];
      }
  }
  return population[0];
}