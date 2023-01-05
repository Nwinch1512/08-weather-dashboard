// $( document ).ready(function() {}

let APIKey = "800568ca8ac1381d6a664d50c4c201ee";

// Bringing in existing HTML elements
let cityEl = $("#search-input");
let searchBtn = $("#search-button");
let todayForecastSec = $("#today");
let futureForecastSec = $("#forecast");
searchBtn.on("click", search);
let city = cityEl.val();
// Need to convert city name into lat and lon value to make API call, and then pass lat and lon into base URL to get 5 day forecast

// Hardcoded lat and lon for now but need to get this from API call response depending on user input
let lat = 52.68064;
let lon = -1.8243991722405983;

// Base URL for current weather forecast - hardcoded city for now but need to set based on user input
let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=Lichfield&appid=${APIKey}`;

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  console.log(response);
  // Converting temp from kelvine to degrees celsius
  let tempInCelsius = Math.trunc(response.main.temp - 273.15);
  console.log(
    `You are in ${response.name}, the temperature is ${tempInCelsius} degrees celsius`
  );
  // Setting up elements for current weather forecast
  let todayForecastDiv = $("<div>");
  let headerEl = $("<h1>");
  let weatherImg = $("<img>");
  let weatherListEl = $("<ul>");

  //Appending elements for current weather forecast
  todayForecastSec.append(todayForecastDiv);
  todayForecastDiv.append(headerEl);
  todayForecastDiv.append(weatherListEl);
  headerEl.append(weatherImg);

  //Heading for current weather
  let cityName = response.name;
  let date = moment.unix(response.dt).format("DD/MM/yyyy");
  let imageURL = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
  console.log(imageURL);
  //Setting value for new HTML elements
  weatherImg.attr("src", imageURL);

  headerEl.text(cityName + " " + "(" + date + ")");
  headerEl.append(weatherImg);
  console.log(weatherImg);

  // weather.icon //weather icon.  Find out how to get icon to display - may need to use font awesome??
  // CODE THAT MIGHT HELP: $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
  let weatherIcon = response.weather[0].icon;
  // main.temp //temperature
  let temp = response.main.temp;
  //wind.speed //wind speed
  // main.humidity //humidity
  let humidity = response.main.humidity;
  let windSpeed = response.wind.speed;

  console.log(
    "city name:" + cityName,
    "\n" + "date:" + date,
    // "\n" + "icon:" + icon,
    "\n" + "temp:" + tempInCelsius + "℃",
    "\n" + "humidity:" + humidity + "%",
    "\n" + "wind-speed:" + windSpeed + " KPH"
  );
});

// Base URL for future weather forecast
let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

$.ajax({
  url: forecastURL,
  method: "GET",
}).then(function (response) {
  console.log(response);
  // Set up a function which makes the API call.  Set up function which displays content from API call dynamically.
  // bootstrap syntax <div class="container"></div>;
});

//Direct geocoding.  Hardcorded city but need to change so taking from user input

let locationCoords = `https://api.openweathermap.org/geo/1.0/direct?q=Lichfield,GB&appid=${APIKey}`;

$.ajax({
  url: locationCoords,
  method: "GET",
}).then(function (response) {
  console.log(response);
});

function search(event) {
  event.preventDefault();
  // Need to add user validation code here to ensure entries are not empty strings or duplicates and that they're proper city names
  let city = cityEl.val();
  console.log(city);
  setLocationSearchHistory(city);
}

// Create button dynamically for each location in location array, set value, attribute and add class
$.each(getLocationSearchHistory(), function (position, location) {
  let locationBtn = $("<button>");
  locationBtn.text(location);
  locationBtn.attr("location", location);
  //Add formatting to buttons so they look like mock up.  Added bootstrap format but need to add padding
  locationBtn.addClass("btn btn-primary");
  let historyDiv = $("#history");
  historyDiv.append(locationBtn);
  //   locationBtn.on("click", displayWeatherData);
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
