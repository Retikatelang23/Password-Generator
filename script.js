const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[dataPasswordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_-+={}[]|:;"<>,.?/'

let length = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()

//set strength circle color to be grey
document.addEventListener("DOMContentLoaded", function () {
    setIndicator("#ccc");
});

//set password length
function handleSlider() {
    inputSlider.value = passwordLength
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) +"% 100%"
}

//circle color
function setIndicator(color) {
     indicator.style.backgroundColor = color;
     //shadow
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

// to generate the random password
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min 
}

function generateRandomNumber() {   
    return getRandomInteger(0, 9);
}

function generateLowercase() {
    //to convert integer into string
    return String.fromCharCode(getRandomInteger(97, 123))
}

function generateUppercase() {
    //to convert integer into string
    return String.fromCharCode(getRandomInteger(65, 91))
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length)
    return symbols.charAt(randNum);
}


async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied"
    }
    catch(e){
        copyMsg.innerText = "Falied"
    }
    //to make copy vala span invisible
    copyMsg.classList.add("active")

    //to remove copied tag after some seconds
    setTimeout( () => {
        copyMsg.classList.remove("active")
    }, 2000)
}

function shufflePassword(array) {
    //fisher yates method
    for(let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    let str = ""
    array.forEach((el) => (str += el))
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount
        handleSlider()
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click", () => {
    if(passwordDisplay.value)
    copyContent()
})

generateBtn.addEventListener("click", () => {
    //none of the checkbox are selected
    if(checkCount ==0) 
        return

        if (passwordDisplay < checkCount){
        passwordLength = checkCount
        handleSlider()
    }

    // journey to find new password

    console.log("starting the journey")
    //remove old password
    let password = ""

    //putting the stuff mentioned by checkboxes
    //method 1
    /*if(uppercaseCheck.checked){
        password += generateUppercase()
    }

    if(lowercaseCheck.checked){
        password += generateLowercase()
    }

    if(numbersCheck.checked){
        password += generateRandomNumber()
    }

    if(symbolsCheck.checked){
        password += generateSymbol()
    }*/

    //method 2
    let funArr = []

    if(uppercaseCheck.checked)
        funArr.push(generateUppercase)

    if(lowercaseCheck.checked)
        funArr.push(generateLowercase)

    if(numbersCheck.checked)
        funArr.push(generateRandomNumber)

    if(symbolsCheck.checked)
        funArr.push(generateSymbol)

    //compulsory addition
    for(let i = 0; i<funArr.length; i++){
        password += funArr[i]()
    }  
    console.log("compulsory addition done")  

    //remaining addition 
    for(let i = 0; i<passwordLength-funArr.length; i++){
        let randIndex = getRandomInteger(0, funArr.length)
        console.log("randIndex" + randIndex)
        password += funArr[randIndex]()
    }
    console.log("remaining addition done")  
    
    //suffeling the elements
    password = shufflePassword(Array.from(password))
    console.log("Shuffling done")  

    //showing in UI
    passwordDisplay.value = password
    console.log("UI addition done")  

    //calculating strength
})