// Containers
const loginContainer = document.getElementById("loginContainer");
const signupContainer = document.getElementById("signupContainer");
const mealInputContainer = document.getElementById("mealInputContainer");
const imagePreview = document.getElementById("imagePreview");
const capturePhotoButton = document.getElementById("capturePhoto");

let videoStream = null; // Camera video stream
let mealCounter = 0; // Track which meal is being recorded
const mealCaloriesData = [
    {
        name: "Breakfast",
        calories: { rice: 143, fish: 275, egg: 89 },
    },
    {
        name: "Lunch",
        calories: { kimbap: 460, tofu: 301 },
    },
    {
        name: "Dinner",
        calories: { chicken: 245, sausage: 300, seaweed: 19 },
    },
];

// Handle Login
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const dailyCalories = parseInt(
        document.getElementById("dailyCalories").value.trim()
    );

    if (username && password && dailyCalories > 0) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(
            (user) => user.username === username && user.password === password
        );

        if (user) {
            user.calorieGoal = dailyCalories;
            localStorage.setItem("users", JSON.stringify(users));
            alert(`Welcome, ${username}!`);
            loginContainer.style.display = "none";
            mealInputContainer.style.display = "block";
            document.getElementById("goalCalories").textContent = dailyCalories;
        } else {
            alert("Invalid credentials.");
        }
    } else {
        alert("Please fill all fields.");
    }
});

// Open Camera
document.getElementById("openCamera").addEventListener("click", () => {
    if (mealCounter >= mealCaloriesData.length) {
        alert("All meals recorded. Proceed to manual entry.");
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoStream = stream;
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        video.width = 300;
        video.height = 300;
        imagePreview.innerHTML = "";
        imagePreview.appendChild(video);
        capturePhotoButton.style.display = "block";
    });
});

// Capture Photo and Display Meal Details
capturePhotoButton.addEventListener("click", () => {
    const meal = mealCaloriesData[mealCounter];
    const foodDetails = Object.entries(meal.calories)
        .map(([food, kcal]) => `${food} (${kcal}kcal)`)
        .join(" + ");
    const totalCalories = Object.values(meal.calories).reduce(
        (sum, value) => sum + value,
        0
    );

    const message = `${meal.name}: ${foodDetails} = ${totalCalories} kcal`;
    if (mealCounter === 0)
        document.getElementById("detectedBreakfast").textContent = message;
    if (mealCounter === 1)
        document.getElementById("detectedLunch").textContent = message;
    if (mealCounter === 2)
        document.getElementById("detectedDinner").textContent = message;

    alert(message);
    mealCounter++;
    capturePhotoButton.style.display = "none";
    videoStream.getTracks().forEach((track) => track.stop());
});

// Manual Input Form
document.getElementById("mealForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const breakfastCalories = parseInt(
        document.getElementById("breakfastCalories").value
    ) || 0;
    const lunchCalories = parseInt(
        document.getElementById("lunchCalories").value
    ) || 0;
    const dinnerCalories = parseInt(
        document.getElementById("dinnerCalories").value
    ) || 0;

    // Calculate total consumed calories
    const totalConsumed = breakfastCalories + lunchCalories + dinnerCalories;

    // Get the user's goal
    const calorieGoal = parseInt(
        document.getElementById("goalCalories").textContent
    );

    // Calculate remaining calories
    const remainingCalories = calorieGoal - totalConsumed;

    // Display the results
    document.getElementById("breakfastTotal").textContent = breakfastCalories;
    document.getElementById("lunchTotal").textContent = lunchCalories;
    document.getElementById("dinnerTotal").textContent = dinnerCalories;
    document.getElementById("totalConsumed").textContent = totalConsumed;
    document.getElementById("remainingCalories").textContent = remainingCalories;

    // Provide feedback to the user
    if (remainingCalories >= 0) {
        alert(`You are on track! You have ${remainingCalories} kcal remaining.`);
    } else {
        alert(
            `You have exceeded your goal by ${Math.abs(remainingCalories)} kcal.`
        );
    }
});
