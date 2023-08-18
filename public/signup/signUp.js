async function signup(event){
    try{
        event.preventDefault();

        const signupdetails = {
             name: event.target.name.value,
             email: event.target.email.value,
            password: event.target.password.value
        }
        console.log(signupdetails)
        const response = await axios.post('http://localhost:1010/signup', signupdetails)
       
        if(response.data){
            alert('user created successfully')
           window.location.href = "http://localhost:1010"
        }
    }catch(err){
        // document.body.innerHTML += err;
        const error = err.response.data.message;
         alert(error)
    }
}
