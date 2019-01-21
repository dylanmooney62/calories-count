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


// APPLICATION FUNCTIONALITY
function getData() {
  // if theres no data object create one
  if (!localStorage.getItem('data')) {
    let data = {
      calorieGoal: 2000,
      food: {
        currentFood: [new Food('Banana Milkshake', 300, 'Lunch', 'Dairy')],
        savedFood: []
      }
    }
    localStorage.setItem('data', JSON.stringify(data));
  }

  return JSON.parse(localStorage.getItem('data'));
}

function addCurrentFood(food) {
  const data = getData();

  data.food.currentFood.push(food);

  localStorage.setItem('data', JSON.stringify(data));
}

function displayCurrentFood() {
  const currentFood = getData().food.currentFood;

  for (food of currentFood) {
    let html = `<li class="food-list__item">
    <a href="#food-detail" class="food" id="${food.id}">
      <div class="food__left-details">
        <span class="food__detail">${food.name}</span>
        <span class="food__detail">${food.mealTime}</span>
      </div>
      <div class="food__right-details">
        <span class="food__detail">${food.calories}Kcal</span>
        <span class="food__detail">${food.group}</span>
      </div>
    </a>
    </li>`

    document.getElementById('food-list').insertAdjacentHTML('afterbegin', html);
  }
}


displayCurrentFood();