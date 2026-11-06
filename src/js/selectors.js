const form = document.querySelector("form.main__form")
const messages = document.querySelectorAll("p.form__message")
const userInput = document.querySelector("form.main__form input[type=text]")
const emailInput = document.querySelector("form.main__form input[type=email]")
const passwordInputs = document.querySelectorAll("form.main__form input[type=password]")

export {form, messages, userInput, emailInput, passwordInputs}