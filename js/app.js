// EVENT LISTENERS
document.getElementById('add-food-form').addEventListener('submit', function(e)  {
  // stop form from submitting
  e.preventDefault();

  // get all values from form
  const name = document.getElementById('add-food-name').value,
        time = document.getElementById('add-food-time').value,
        group = document.getElementById('add-food-group').value,
        calories = parseInt(document.getElementById('add-food-calories').value),
        description = document.getElementById('add-food-description').value;

  // create and add food from values
  addCurrentFood(new Food(name, calories, time, group, description));

  // display food on home page
  displayCurrentFood();

  // calculates total & remaing calories
  calculateTotalAndRemainingCalories();

  // updates display
  updateCalorieDisplay();

  // navigates to home page
  window.location.href = '#home';
});





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
        currentFood: [],
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
  const foodList = document.getElementById('food-list');

  // reset foodList
  foodList.innerHTML = '';

  // if there is food iterate through array creating template for each food item
  if (currentFood.length >= 1) {
    for (food of currentFood) {
      let html = `
    <li class="food-list__item">
      <a href="#food-detail" class="food" id="${food.id}">
        <div class="food__container">
          <div class="food__details food__details--left">
           <span class="food__detail">${food.name}</span>
          <span class="food__detail">${food.mealTime}</span>
        </div>
        <div class="food__details food__details--right">
          <span class="food__detail">${food.calories}Kcal</span>
          <span class="food__detail">${food.group}</span>
         </div>
        </div>
      </a>
    </li>`

      foodList.insertAdjacentHTML('afterbegin', html);
    }
  } else {
    foodList.innerHTML = `
    <li class="food-list-item">
    <p class="food-list__text">
      Looks like you've not added any food for today. Press the plus button to add food.
    </p>
    </li>
    `
  }
}


// SETTING CALORIE GOAL
function setGoalCalories(goal) {
  const data = getData();

  data.calories.goal = goal;

  localStorage.setItem('data', JSON.stringify(data));
}

// CALCULATE CALORIE GOALS AND REMAINING
function calculateTotalAndRemainingCalories() {
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
  const carloriesRemainingDisplay = document.getElementById('calories-remaining');


  if (caloriesRemaining >= 0) {
    carloriesRemainingDisplay.classList.add('display__number--green');
  } else {
    carloriesRemainingDisplay.classList.add('display__number--red');
  }

  carloriesRemainingDisplay.textContent = caloriesRemaining;
}


window.onload = () => {
  displayCurrentFood();
  calculateTotalAndRemainingCalories();
  updateCalorieDisplay();
}
