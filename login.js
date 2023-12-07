const form = document.querySelector("#login-form")
const email = document.querySelector("#email")
const senha = document.querySelector("#password")

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".login-form")
    const cadastros = {
        emails: ["jonas.vieira4@gmail.com", "ryangmnascimento@gmail.com", "diana@gmail.com", "dianalinafacul@gmail.com"],
        senhas: ["777", "123", "1203", "teste"]
    };

    form.addEventListener("submit", function(event) {
        

        const campoEmail = document.getElementById("email-usuario").value
        const campoSenha = document.getElementById("senha-usuario").value

        if (cadastros.emails.includes(campoEmail)) {
            const index = cadastros.emails.indexOf(campoEmail)
            if (cadastros.senhas[index] === campoSenha) {
              
            } else {
                event.preventDefault()
                alert("A senha está errada!")
            }
        } else {
            event.preventDefault()
            alert("Este e-mail não está cadastrado")
        }
    })
})
