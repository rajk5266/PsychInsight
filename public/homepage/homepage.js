jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function() {
  $(".sidebar-submenu").slideUp(200);
  if (
    $(this)
      .parent()
      .hasClass("active")
  ) {
    $(".sidebar-dropdown").removeClass("active");
    $(this)
      .parent()
      .removeClass("active");
  } else {
    $(".sidebar-dropdown").removeClass("active");
    $(this)
      .next(".sidebar-submenu")
      .slideDown(200);
    $(this)
      .parent()
      .addClass("active");
  }
});

$("#close-sidebar").click(function() {
  $(".page-wrapper").removeClass("toggled");
});
$("#show-sidebar").click(function() {
  $(".page-wrapper").addClass("toggled");
});


   
   
});

window.addEventListener('DOMContentLoaded', () => {
  getMessages()
})
const token = { headers: { 'Authorization': localStorage.getItem('token') } }


// const sessionButton = document.getElementById('session-button')
// const sessionElement = document.getElementById('session');
// const chatContainer = document.getElementById('chatContainer')
// sessionButton.addEventListener('click', () => {
//   sessionElement.style.height = '100px'
//   sessionButton.disabled = true;
//   sessionButton.innerText = 'Ongoing Session...';
//   sessionButton.style.color = 'green';
//   chatContainer.style.display = 'block'
// })
async function sendMessage (e){
  e.preventDefault()
  const messageInput = document.getElementById('sendMessageInput') 
  const message = messageInput.value;
  messageInput.value = '';
  const obj = {role: 'user', content: message}
  showMessages(obj)
  const response = await axios.post('http://localhost:1010/sendMessage', {message}, token)
  // console.log(response)
  showMessages(response.data)
}

async function getMessages (){
  try {
    const response = await axios.get('http://localhost:1010/getMessages', token)
    if(response.data.length === undefined){
      showMessages(response.data)
    }else{
      for(let i=1; i<response.data.length; i++){
        showMessages(response.data[i])
       }
    }
  } catch (error) {
    console.log(error)
  }
}

function showMessages(message) {
    // console.log(message)
    const parentMessageContainer = document.getElementById('chat-box');
  
    const outerDiv = document.createElement('div');
    outerDiv.classList.add('d-flex', 'justify-content-start', 'mb-4');
  
    const messageContent = document.createElement('div');
    const name = document.createElement('span')
    if (message.role == 'user') {
      messageContent.classList.add('msg_container_own');
      messageContent.textContent = message.content
    }
    else if(message.role == 'assistant') {
      messageContent.classList.add('msg_container_assistant')
      messageContent.textContent = message.content
      name.textContent = 'your Therapist'
    }
    outerDiv.appendChild(messageContent);
    parentMessageContainer.appendChild(name)
    parentMessageContainer.appendChild(outerDiv);
    // parentMessageContainer.appendChild(time)
    // parentMessageContainer.appendChild(document.createElement('hr'))
    parentMessageContainer.scrollTop = parentMessageContainer.scrollHeight
  }

  const iframe = document.createElement('iframe');
        
        // Set the attributes for the iframe
        // iframe.src = "https://drive.google.com/file/d/11kRrWwxok3wR7EdXxTRTvPRqY5qlIuUp/preview";
        // iframe.width = "100%";
        // iframe.height = "352";
        // iframe.frameBorder = "0";
        // iframe.allowFullscreen = true;
        // iframe.allow
        // iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        // iframe.loading = "lazy";

        // Append the iframe to the container element
        const audioContainer = document.getElementById('spotifyDiv');
        // audioContainer.appendChild(iframe);

        // <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/70VGpRDq906KktW9YZWcEW?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>