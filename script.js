// Step 1: Store Important Elements

// DOM Elements
const orderSection = document.getElementById('orderSection');
const trackerSection = document.getElementById('trackerSection');
const progressFill = document.getElementById('progressFill');
const estimatedTime = document.getElementById('estimatedTime');
const currentStatus = document.getElementById('currentStatus');
const updateList = document.getElementById('updateList');
const notification = document.getElementById('notification');

// Step Elements
const steps = [
    document.getElementById("step1"),
    document.getElementById("step2"),
    document.getElementById("step3"),
    document.getElementById("step4"),
    document.getElementById("step5"),
    document.getElementById("step6"),
];

// Step 2: Create Timer Variables

// Timer variables
let countdownTimer;
let preparationTimer;
let deliveryTimer;
let minutesLeft = 15;
let secondsLeft = 0;
let currentStep = 0;

// Step 3: Create processSteps array

// Process steps with timing (in seconds for the demo)
const processSteps = [
    { name: "Order Received", duration: 5, progress: 0 },
    { name: "Preparing", duration: 10, progress: 20 },
    { name: "In the Oven", duration: 15, progress: 40 },
    { name: "Quality Check", duration: 5, progress: 60 },
    { name: "Out for Delivery", duration: 20, progress: 80 },
    { name: "Delivered", duration: 0, progress: 100 },
];

// Step 4: Create updateOrderSummary() function

function updateOrderSummary() {
    let size = document.getElementById("pizzaSize").value;
    let crust = document.getElementById("crustType").value;

    let options = document.getElementById("toppings").options;
    let toppings = [];

    for (let i = 0; i < options.length; i++) {
        if (options[i].selected == true) {
            toppings.push(options[i].value);
        }
    }

    let basePrice = 0;

    if (size === "Small") basePrice = 8.99;
    if (size === "Medium") basePrice = 12.99;
    if (size === "Large") basePrice = 15.99;
    if (size === "Extra Large") basePrice = 18.99;

    let toppingsPrice = toppings.length * 1.5;
    let deliveryFee = 2.99;

    let total = basePrice + toppingsPrice + deliveryFee;

    orderSummary.innerHTML = `
        <div class="summary-title">Order Summary</div>

        <div class="summary-item">
            <span>${size} ${crust} Crust Pizza</span>
            <span>${basePrice}</span>
        </div>

        <div class="summary-item">
            <span>Toppings (${toppings.length})</span>
            <span>$${toppingsPrice.toFixed(2) }</span>
        </div>

        <div class="summary-item">
            <span>Delivery Fee</span>
            <span>$${deliveryFee.toFixed(2) }</span>
        </div>

        <div class="summary-total">
            Total: $${total.toFixed(2) }
        </div>
    `;
}

// Step 5: Create startDeliveryProcess() function

function startDeliveryProcess() {
    // Hide order section and show tracker
    orderSection.style.display = "none";
    trackerSection.style.display = "block";

    // Show notification
    showNotification("Your order has been placed!");

    // Add initial update
    addUpdate(
        "Order Received",
        "Your order has been received and is being processed.",
    );

    // Start countdown timer
    startCountdown();

    // Start the preparation process
    startPreparation();
}

// Step 6: startCountdown() function

function startCountdown() {
    // Add log entry for timer method
    addUpdate(
        "Timer Started",
        "Countdown timer started using setInterval() to update every second",
    );

    // Update timer display initially
    updateTimerDisplay();

    // Set interval to update every second
    countdownTimer = setInterval(() => {
        // Decrease time
        if (secondsLeft === 0) {
            if (minutesLeft === 0) {
                // Time's up - should coincide with delivery complete
                clearInterval(countdownTimer);
                return;
            }
            minutesLeft--;
            secondsLeft = 59;
        } else {
            secondsLeft--;
        }

        // Update display
        updateTimerDisplay();
    }, 1000);
}

// Step 7: Create updateTimerDisplay() function

function updateTimerDisplay() {
    estimatedTime.textContent =
    `${minutesLeft.toString().padStart(2, "0")}:
    ${secondsLeft.toString().padStart(2, "0")}`;
}

// Step 8: create startPreparation() function

function startPreparation() {
    // Start with fisrt step already active
    updateStepProgress(0);

    // Log the setTimeout usage for the first transition
    addUpdate(
        "Timer Method",
        `Using setTimeout(${processSteps[0].duration * 1000}) to simulate
        moving to "${processSteps[1].name}" stage`,
    );

    // Set timeout for first step transition
    preparationTimer = setTimeout(
        processNextStep,
        processSteps[0].duration * 100,
    );

    // Function to process next step
    function processNextStep() {
        // if all steps are done, stop
        if (currentStep >= processSteps.length - 1) {
            return;
        }

        // Move to next step
        currentStep++

        // Update progress and status
        updateStepProgress(currentStep);

        // Set the timeout for the next step
        const currentDuration = processSteps[currentStep].duration;

        if (currentStep < processSteps.length - 1) {
            // Log the setTimeout usage for this step
            addUpdate(
                "Timer Method",
                `Using setTimeout(${currentDuration * 1000}) to simulate
                "${processSteps[currentStep].name}" stage`,
            );

            preparationTimer = setTimeout(processNextStep, currentDuration *
            1000);
        }
    }
}

// Step 9: Create updateStepProgress(stepIndex) function

function updateStepProgress(stepIndex) {
    // Update the progress bar
    progressFill.style.width = `${processSteps[stepIndex].progress}%`;

    // Update status text
    currentStatus.textContent = processSteps[stepIndex].name;

    // Update step markers
    for (let i = 0; i <= stepIndex; i++) {
        steps[i].classList.add("active");
        if (i < stepIndex) {
            steps[i].classList.add("completed");
        }
    }

    // Add update to the list
    addUpdate(processSteps[stepIndex].name, getStatusMessage(stepIndex));
}

// Step 10: Create getStatusMessage(stepIndex) Function

function getStatusMessage(stepIndex) {
    const messages = [
        "We've received your order and it's been sent to the kitchen.",
        "Our chefs are preparing your pizza with freah ingredients",
        "Your pizza is now baking in our brick oven at 700 degree F.",
        "We're checking that your pizza meets our quality standards.",
        "Your pizza is on its way! Our delivery person is en route.",
        "Your pizza has been delivered. Enjoy you meal!",
    ];

    return messages[stepIndex];
}

// Step 11: Create addUpdate(title, message) function

function addUpdate(title, message) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const updateItem = document.createElement("div");
    updateItem.className = "update-item";

    updateItem.innerHTML = `
       <div class="update-time>${timeStr}</div>
       <div class="update-text>
           <strong>${title}</strong><br>
           ${message}
       </div>
    `;
    updateList.prepend(updateItem);
}

// Step 12: Create showNotification(message) function

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Step 13: Create resetProcess()

function resetProcess() {
    // Clear alll timers
    clearInterval(countdownTimer);
    clearTimeout(preparationTimer);
    clearInterval(deliveryTimer);

    // Reset variables
    minutesLeft = 35;
    secondsLeft = 0;
    currentStep = 0;

    // Reset progress bar and status
    progressFill.style.width = "0%";
    currentStatus.textContent = "Order Received";

    // Reset step markers
    steps.forEach((step) => {
        step.classList.remove("active");
        step.classList.remove("completed");
    });
    steps[0].classList.add("active");

    // Clear updates
    updateList.innerHTML = "";

    // Hide tracker and show order form
    trackerSection.style.display = "none";
    orderSection.style.display = "block";
}