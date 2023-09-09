async function login(event) {
    try {
        event.preventDefault()
        const obj = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        const logindetails = await axios.post('http://localhost:1010/login', obj)
        // console.log(logindetails)
        if(logindetails.status === 200){
            localStorage.setItem('token', logindetails.data.token)

            window.location.href = 'http://localhost:1010/homepage'
        }else{
            console.log('failed to login')
        }

    } catch (err) {
        console.log(err)
        if (err.response.status === 404) {
            alert('user not found, please sign-up')
        } else if (err.response.status === 400) {
            alert('incorrect password')
        }
    }

}