import { form, userInput, emailInput, passwordInputs, messages } from "./selectors.js";

const STORAGE_KEY = "USER_INFO"


// HandleSubmit
form.addEventListener("submit", handleSubmit)


function handleSubmit(e) {
    e.preventDefault()

    let isValid = true;

    const inputs = getInputArray(form.elements)
    let userAuth = {
        password: "",
        confirm: ""
    }

    for(const {id, name, value, type, minLength, maxLength} of inputs) {
        if(type !== "submit" && !value) {
            isValid &&= !!value
            showError(id, `${formatInput(name)} is required`, !!value)
        }
        else if(type === "email") {
            let result = isValidEmail(value)
            !isValidEmail(value) ?  showError(id, `${formatInput(name)} is Invalid`, result) : ""
            isValid &&= result
        } else if(type === "text") {
            let result = 
            !isValidInput(value, minLength, maxLength) ?  showError(id, `${formatInput(name)} must length in range of ${minLength} and ${maxLength} characters`, isValidEmail(value)) : ""
            isValid &&= isValidEmail(value)
        } else if (name === "password") {
            userAuth = {
                ...userAuth,
                password: value,
            }
            !isValidInput(value, minLength, maxLength) ?  showError(id, `${formatInput(name)} must length in range of ${minLength} and ${maxLength} characters`) : ""
        } else if (name === "confirm") {
            userAuth = {
                ...userAuth,
                confirm: value,
            }
            if(userAuth.password && userAuth.confirm) {
                showError("password", `${formatInput("password")} is not matched`)
                showError("confirm", `${formatInput("confirm")} is not matched`)
                isValid &&= isPassMatch(userAuth.password, userAuth.confirm)
            }
        }
    }
    
    console.log(isPassMatch(password, confirm))

    console.log(userAuth)

}



function getInputArray(formElements = {}) {
    if(!Object.keys(formElements).length) return
    const inputs = []
    for(const {id, name, value, type, minLength, maxLength} of formElements)  {
        inputs.push({id, name, value, type, minLength, maxLength})
    }        
    return inputs
}



function isValidEmail(email = "") {
    let isValid = true
    const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    isValid &&= EMAIL_REG.test(email)
    return isValid
}

function isValidInput(input = "", min = 0, max = 0) {
    let isValid = true
    isValid &&= (input.length >= min && input.length <= max) && (min >= 1 && max >= min)
    return isValid
}

function isPassMatch(pass = "", confirm = "") {
    let isMatched = true
    isMatched &&= pass === confirm
    return isMatched
}


function showError(id, message, isValid) {
    const element = document.getElementById(id) ?? ""
    const nextElement = element.nextElementSibling ?? ""
    if(!element) return
    if((element.classList.contains("invalid") || nextElement.classList.contains("invalid")) && isValid) {
        element.classList?.remove("invalid")
        nextElement.classList?.remove("invalid")
        nextElement.textContent = ""
        return
    }    
    element.classList?.add("invalid")
    nextElement.classList?.add("invalid")
    nextElement.textContent = message
}


function addToLocalStorage(userInfo = {}) {
    if(typeof window === "undefined" || !Object.keys(userInfo).length) return
    const storageItem = localStorage.getItem(STORAGE_KEY) ?? []
    const isUserExist = storageItem.filter(usr => usr.email === userInfo.email).length ? true : false
    if(isUserExist) return
    localStorage.setItem(STORAGE_KEY, [
        ...storageItem,
        userInfo
    ])
}


function formatInput(inputName = "") {
    return inputName ? inputName.charAt(0).toUpperCase().concat(inputName.slice(1)) : ""
}


