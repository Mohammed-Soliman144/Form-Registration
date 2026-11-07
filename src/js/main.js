const form = document.querySelector("form.main__form")

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
            let result = !!value
            !result ? showError(id, `${formatInput(name)} is required`, result) : hideError(id, result)
            isValid &&= result
        }
        else if(type === "email") {
            let result = isValidEmail(value)
            !result ?  showError(id, `${formatInput(name)} is Invalid`, result) : hideError(id, result)
            isValid &&= result
        } else if(type === "text" && value) {
            let result = isValidInput(value, minLength, maxLength)
            !result ?  showError(id, `${formatInput(name)} must length in range of ${minLength} and ${maxLength} characters`, result) : hideError(id, result)
            isValid &&= result
        } else if (name === "password" && value) {
            userAuth = {
                ...userAuth,
                password: value,
            }
            let result = isValidInput(value, minLength, maxLength)
            !result ?  showError(id, `${formatInput(name)} must length in range of ${minLength} and ${maxLength} characters`, result) : hideError(id, result)
            isValid &&= result
            if(!result) 
                return
        } else if (name === "confirm" && value) {
            userAuth = {
                ...userAuth,
                confirm: value,
            }
            if(userAuth.password && userAuth.confirm) {
                let result = isPassMatch(userAuth.password, userAuth.confirm) && isValidInput(value, minLength, maxLength)
                !result? showError("password", `${formatInput("password")} is not matched`, result) : hideError("password", result)
                !result? showError("confirm", `${formatInput("confirm")} is not matched`, result) : hideError("confirm", result)
                isValid &&= result
            }
        }
    }

    if(!isValid) return
    const {user, password, email} = form.elements
    const userInfo = {
        id: Date.now(),
        username: user.value,
        password: password.value,
        email: email.value
    }
    addToLocalStorage(userInfo)
    e.target.reset()
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


function showError(id, message) {
    const element = document.getElementById(id) ?? ""
    const nextElement = element.nextElementSibling ?? ""
    if(!element) return  
    element.classList?.add("invalid")
    nextElement.classList?.add("invalid")
    nextElement.textContent = message
}

function hideError(id, isValid) {
    const element = document.getElementById(id) ?? ""
    const nextElement = element.nextElementSibling ?? ""
    if(!element) return
    if((element.classList.contains("invalid") || nextElement.classList.contains("invalid")) && isValid) {
        console.log(isValid)
        element.classList?.remove("invalid")
        nextElement.classList?.remove("invalid")
        nextElement.textContent = ""
    }
}

function addToLocalStorage(userInfo = {}) {
    if(typeof window === "undefined" || !Object.keys(userInfo).length) return
    const storageItem = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    const isUserExist = storageItem.filter(usr => usr.email === userInfo.email).length ? true : false
    if(isUserExist) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
        ...storageItem,
        userInfo
    ]))
}

function formatInput(inputName = "") {
    return inputName ? inputName.charAt(0).toUpperCase().concat(inputName.slice(1)) : ""
}



