const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
countrySelect = document.getElementById("country-select"),
citySelect = document.getElementById("city-select"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

// Danh sách quốc gia và thành phố mẫu
const countries = {
    VN: ["Hanoi", "Ho Chi Minh", "Da Nang", "Long Xuyen"],
    US: ["New York", "Los Angeles", "Chicago"],
    JP: ["Tokyo", "Osaka", "Kyoto"],
    FR: ["Paris", "Lyon", "Marseille"]
};

// Thêm quốc gia vào dropdown
for (const code in countries) {
    const option = document.createElement("option");
    option.value = code;
    option.text = code;
    countrySelect.appendChild(option);
}

countrySelect.addEventListener("change", function() {
    citySelect.innerHTML = '<option value="">Select City</option>';
    const selectedCountry = countrySelect.value;
    if (selectedCountry && countries[selectedCountry]) {
        countries[selectedCountry].forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.text = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    } else {
        citySelect.disabled = true;
    }
});

citySelect.addEventListener("change", function() {
    if (citySelect.value) {
        requestApi(citySelect.value + ',' + countrySelect.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8368c3dab3e546d410c85b6826c8496d`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=8368c3dab3e546d410c85b6826c8496d`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `City isn't valid`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "icon/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icon/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icon/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icon/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icon/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icon/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        if(citySelect) citySelect.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});


