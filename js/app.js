// EVENT LISTENERS














// FOOD CLASS AND ID GENERATION
class Food {
  constructor(name, calories, mealTime, group, description) {
    this.name = name;
    this.calories = calories;
    this.mealTime = mealTime;
    this.group = group;
    this.description = description;
    this.id = generateID();
  }
}

function generateID() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


// RETRIEVING AND CREATING DATA
function getData() {
  // if theres no data object create one
  if (!localStorage.getItem('data')) {
    let data = {
      calories: {
        total: 0,
        goal: 2500,
        remaining: 2500
      },
      food: {
        currentFood: [new Food('Banana Milkshake', 300, 'Lunch', 'Dairy', ''),
          new Food('Cheese Burger', 600, 'Dinner', 'Meat', ''),
          new Food('Potato', 300, 'Lunch', 'Vegetable', '')
        ],
        savedFood: []
      }
    }
    localStorage.setItem('data', JSON.stringify(data));
  }

  return JSON.parse(localStorage.getItem('data'));
}


// ADDING AND DISPLAYING FOOD 
function addCurrentFood(food) {
  // get data object
  const data = getData();

  // push food object to current food array
  data.food.currentFood.push(food);

  // save change to local storage
  localStorage.setItem('data', JSON.stringify(data));
}

function displayCurrentFood() {
  const currentFood = getData().food.currentFood;

  // iterate through array creating template for each food item
  for (food of currentFood) {
    let html = `<li class="food-list__item">
    <a href="#food-detail" class="food" id="${food.id}">
      <div class="food__details food__details--left">
        <span class="food__detail">${food.name}</span>
        <span class="food__detail">${food.mealTime}</span>
      </div>
      <div class="food__details food__details--right">
        <span class="food__detail">${food.calories}Kcal</span>
        <span class="food__detail">${food.group}</span>
      </div>
    </a>
    </li>`

    document.getElementById('food-list').insertAdjacentHTML('afterbegin', html);
  }
}


// SETTING CALORIE GOAL
function setGoalCalories(goal) {
  const data = getData();

  data.calories.goal = goal;

  localStorage.setItem('data', JSON.stringify(data));
}

// CALCULATE CALORIE GOALS AND REMAINING
function updateCalorieCalculations() {
  calculateTotalCalories();
  calculateRemainingCalories();
}

function calculateTotalCalories() {
  const data = getData();

  let totalCalories = 0;

  for (food of data.food.currentFood) {
    totalCalories += food.calories;
  }

  data.calories.total = totalCalories;

  localStorage.setItem('data', JSON.stringify(data));
}

function calculateRemainingCalories() {
  const data = getData();
  const calorieGoal = data.calories.goal;
  const totalCalories = data.calories.total;

  data.calories.remaining = calorieGoal - totalCalories;

  localStorage.setItem('data', JSON.stringify(data));
}

// DISPLAYING CALORIE GOALS, TOTALS AND REMAINING
function updateCalorieDisplay() {
  displayGoalCalories();
  displayTotalCalories();
  displayRemainingCalories();
}

function displayGoalCalories() {
  const calorieGoal = getData().calories.goal;
  document.getElementById('calories-goal').textContent = calorieGoal;
}

function displayTotalCalories() {
  const totalCalories = getData().calories.total;
  document.getElementById('calories-total').textContent = totalCalories;
}

function displayRemainingCalories() {
  const caloriesRemaining = getData().calories.remaining;
  document.getElementById('calories-remaining').textContent = caloriesRemaining;
}


// INIT
function init() {
  updateCalorieCalculations();
  displayCurrentFood();
  updateCalorieDisplay();
}

window.onload = () => {
  init();
}