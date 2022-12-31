let APIKey = "800568ca8ac1381d6a664d50c4c201ee";
let cityEl = $("#search-input");
let searchBtn = $("#search-button");
searchBtn.on("click", search);
let city = cityEl.value;

let queryURL =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  APIKey;

// fetch(queryURL);

function search(event) {
  event.preventDefault();
  let city = cityEl.val();
  console.log(city);
  setLocationSearchHistory(city);
}

// Create button dynamically for each location in location array, set value, attribute and add class
$.each(getLocationSearchHistory(), function (position, location) {
  let locationBtn = $("<button>");
  locationBtn.text(location);
  locationBtn.attr("location", location);
  //Add formatting to buttons so they look like mock up
  locationBtn.addClass("btn searchBtn col-md-1");
  let historyDiv = $("#history");
  historyDiv.append(locationBtn);
});

// function to get location searches
function getLocationSearchHistory() {
  let storedLocationSearchHistory = JSON.parse(
    localStorage.getItem("locationArrayKey")
  );
  if (storedLocationSearchHistory) {
    return storedLocationSearchHistory;
  } else {
    return [];
  }
}

// function to add locations to search history
function setLocationSearchHistory(location) {
  let storedLocationSearchHistory = getLocationSearchHistory();
  // Add if logic to exclude entries that aren't cities or cities that have already been entered
  storedLocationSearchHistory.push(location);
  localStorage.setItem(
    "locationArrayKey",
    JSON.stringify(storedLocationSearchHistory)
  );
}

// Set up search history cities as array in local storage.  Create button element for each city shown and add event listener which displays 5 day forecast for that city.

// Set up a function which makes the API call.  Set up function which displays content from API call dynamically.

// weather.icon //weather icon
// main.temp //temperature
//wind.speed //wind speed
// main.humidity //humidity

// URL to make current weather API call
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// Direct geocoding, get coordinates of location by entering location name.  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// E.g. of direct geocoding
//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// Your Task
// Server APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

// Use the 5 Day Weather Forecast to retrieve weather data for cities. The link should take you to a guide on how to use the 5 Day Forecast API. You will need to register for an API key in order to use this API. After registering for a new API key, you may need to wait up to 2 hours for that API key to activate.

// The base URL for your API calls should look like the following: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}.

// Hint: Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name. Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

// You will use localStorage to store any persistent data. For more information on how to work with the OpenWeather API, refer to the Full-Stack Blog on how to use API keys.

// User Story
// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
// Acceptance Criteria
// Create a weather dashboard with form inputs.
// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
// When a user views the current weather conditions for that city they are presented with:
// The city name
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// The wind speed
// When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// When a user click on a city in the search history they are again presented with current and future conditions for that city
