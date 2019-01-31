// EVENT LISTENERS

// ADD FOOD FORM FUNCTIONALITY
document.getElementById('add-food-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('add-food-name').value,
    time = document.getElementById('add-food-time').value,
    group = document.getElementById('add-food-group').value,
    calories = parseInt(document.getElementById('add-food-calories').value),
    description = document.getElementById('add-food-description').value;

  addCurrentFood(new Food(name, calories, time, group, description));

  displayCurrentFood();

  calculateTotalAndRemainingCalories();

  updateCalorieDisplay();

  window.location.href = '#home';

  this.reset();
});


// ADDING EVENT LISTENERS TO DYNAMICALLY CREATED FOOD
document.getElementById('food-list').addEventListener('click', (e) => {
  if(e.target.classList.contains('food')) {  
    const food = getFoodByID(e.target.id);

    if(food) {
      displayFoodDetail(food);
    }
  }
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


// ADDING FOOD
function addCurrentFood(food) {
  // get data object
  const data = getData();

  // push food object to current food array
  data.food.currentFood.push(food);

  // save change to local storage
  localStorage.setItem('data', JSON.stringify(data));
}

// REMOVING FOOD
function removeFood(id) {
  const data = getData();
  const foodList = data.food.currentFood;

  const index = foodList.findIndex((e) => {
   return e.id === id;
  })

  data.food.currentFood.splice(index, 1);

  localStorage.setItem('data', JSON.stringify(data));
}

// DISPLAY CURRENT FOOD ON FOOD-LIST
function displayCurrentFood() {
  const currentFood = getData().food.currentFood;
  const foodList = document.getElementById('food-list');
  let html = '';


  // if there is food iterate through array creating template for each food item
  if (currentFood.length >= 1) {
    // gets a copy of array and reverses it to display food items in most recent order
    for (food of currentFood.slice().reverse()) {
      html += `
      <li class="food-list__item">
            <a href="#food-detail" class="food" id="${food.id}">
              <div class="food__container">
                <div class="food__details">
                  <h4 class="food__detail">${parseHtml(food.name)}</h4>
                  <div class="food__detail">${food.calories}Kcal</div>
                </div>
                <div class="food__details">
                  <div class="food__detail">${food.mealTime}</div>
                  <div class="food__detail">${food.group}</div>
                </div>
              </div>
            </a>
          </li>`
    }
  } else {
     html = `
    <li class="food-list-item">
    <p class="food-list__text">
      Looks like you've not added any food for today.  touch the plus button to add food.
    </p>
    </li>
    `
  }
  foodList.innerHTML = html;
}

// GET FOOD BY ID 
function getFoodByID(id) {
  const foodList = getData().food.currentFood;
  return foodList.find((e) => {
    return e.id === id;
  })
}



// DISPLAYING DETAIL OF FOOD
function displayFoodDetail(food) {
  document.querySelector('.food--full-detail').id = food.id;
  document.getElementById('food-detail-name').textContent = food.name;
  document.getElementById('food-detail-calories').textContent = `${food.calories}Kcal`;
  document.getElementById('food-detail-group').textContent = food.group;
  document.getElementById('food-detail-time').textContent = food.mealTime;
  document.getElementById('food-detail-description').textContent = food.description;
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

// HELPER FUNCTIONS
function parseHtml(html) {
 return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

window.onload = () => {
  displayCurrentFood();
  calculateTotalAndRemainingCalories();
  updateCalorieDisplay();
}