// stops contact form from submitting
document.getElementById('contact-form').addEventListener('submit', e => e.preventDefault());


// adding food functionality
document.getElementById('add-food-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('add-food-name').value,
    time = document.getElementById('add-food-time').value,
    group = document.getElementById('add-food-group').value,
    calories = parseInt(document.getElementById('add-food-calories').value),
    description = document.getElementById('add-food-description').value;

  addFood(new Food(name, calories, time, group, description));
  displayFoodList();
  calculateTotalAndRemainingCalories();
  updateCalorieDisplay();
  navigateTo('#home');
  this.reset();
});


// removing food functionality
document.getElementById('remove-food-button').addEventListener('click', () => {
  const id = document.querySelector('.food-detail').id;
    removeFood(id);
    displayFoodList();
    calculateTotalAndRemainingCalories();
    updateCalorieDisplay();
    navigateTo('#home');
})


// event delegation to avoid adding event listeners to each dynamic food element
document.getElementById('food-list').addEventListener('click', (e) => {

  /* pointer events have been removed from all food element children 
    so when clicking anywhere on food the target will always be the food element */
  if (e.target.classList.contains('food')) {
    const food = getFoodByID(e.target.id);
  
    if (food) {
      displayFoodDetail(food);
    }
  }
});


// settings form 
document.getElementById('settings-form').addEventListener('submit',  (e) => {
  e.preventDefault();
  const goal = document.getElementById('settings-calorie-goal').value;
  setCalorieGoal(goal);
  calculateTotalAndRemainingCalories();
  updateCalorieDisplay();
  navigateTo('#home');
});


// reset functionality 
document.getElementById('reset-button').addEventListener('click', () => {
  removeAllFood();
  calculateTotalAndRemainingCalories();
  displayFoodList();
  updateCalorieDisplay();
})







// Food class and ID generator ---------------------
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

// unique id generator from stack overflow
function generateID() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}



// retrieving data from local storage ---------------------

function getData() {
  // if theres no data object create one
  if (!localStorage.getItem('data')) {
    let data = {
      calories: {
        total: 0,
        goal: 2500,
        remaining: 2500
      },
      foodList: [],
    }
    localStorage.setItem('data', JSON.stringify(data));
  }

  return JSON.parse(localStorage.getItem('data'));
}


// add removing, and displaying food functionality ------------

function addFood(food) {
  // get data object
  const data = getData();

  // push food object to current food array
  data.foodList.push(food);

  // save change to local storage
  localStorage.setItem('data', JSON.stringify(data));
}

function removeFood(id) {
  const data = getData();
  const foodList = data.foodList;

  const index = foodList.findIndex((e) => {
    return e.id === id;
  })

  if(index > -1) {
    data.foodList.splice(index, 1);
  }
  
  localStorage.setItem('data', JSON.stringify(data));
}

function removeAllFood() {
  const data = getData();
  data.foodList = [];
  localStorage.setItem('data', JSON.stringify(data));
}

function displayFoodList() {
  const foodList = getData().foodList;
  const uiFoodList = document.getElementById('food-list');
  let html = '';

  // this is inefficent and should be refactored*

  // if there is food iterate through array creating template for each food item
  if (foodList.length >= 1) {
    // gets a copy of array and reverses it to display food items in most recent order
    for (food of foodList.slice().reverse()) {
      html += `
      <li class="food-list__item">
      <a href="#food-detail" class="food" id="${food.id}">
        <div class="food__container">
          <div class="food__section">
            <h4 class="food__info">${parseHtml(food.name)}</h4>
            <div class="food__info">${food.calories}Kcal</div>
          </div>
          <div class="food__section">
            <div class="food__info">${food.mealTime}</div>
            <div class="food__info">${food.group}</div>
          </div>
        </div>
      </a>
    </li>`
    }
  } else {
    html = `
    <p class="message">
      Looks like you've not added any food for today.  touch the plus button to add food.
    </p>  
    `
  }
  uiFoodList.innerHTML = html;
}


function getFoodByID(id) {
  const foodList = getData().foodList;
  return foodList.find((e) => {
    return e.id === id;
  })
}

function displayFoodDetail(food) {
  if(food) {
    document.querySelector('.food-detail').id = food.id;
    document.getElementById('food-detail-name').textContent = parseHtml(food.name);
    document.getElementById('food-detail-calories').textContent = `${food.calories}Kcal`;
    document.getElementById('food-detail-group').textContent = food.group;
    document.getElementById('food-detail-time').textContent = food.mealTime;
    document.getElementById('food-detail-description').textContent = parseHtml(food.description);
  }
}




// Calorie calculations and displaying calories functionality -------------

function setCalorieGoal(goal) {
  const data = getData();

  data.calories.goal = goal;

  localStorage.setItem('data', JSON.stringify(data));
}

function calculateTotalAndRemainingCalories() {
  calculateTotalCalories();
  calculateRemainingCalories();
}

function calculateTotalCalories() {
  const data = getData();

  let totalCalories = 0;


  for (food of data.foodList) {
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
    carloriesRemainingDisplay.classList.remove('display__number--red');
  } else {
    carloriesRemainingDisplay.classList.add('display__number--red');
    carloriesRemainingDisplay.classList.remove('display__number--green');
  }

  carloriesRemainingDisplay.textContent = caloriesRemaining;
}



function navigateTo(id) {
  window.location.href = id;
}

function parseHtml(html) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function populateSettings() {
  const calorieGoal = getData().calories.goal;
  document.getElementById('settings-calorie-goal').value = calorieGoal;
}

window.onload = () => {
  displayFoodList();
  calculateTotalAndRemainingCalories();
  updateCalorieDisplay();
  populateSettings();
}
