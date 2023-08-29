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

const token = { headers: { 'Authorization': localStorage.getItem('token') } }

async function sendMessage (e){
  e.preventDefault()
  const messageInput = document.getElementById('sendMessageInput') 
  const message = messageInput.value;

  messageInput.value = ''
  const reponse = await axios.post('http://localhost:1010/sendMessage', {message}, token)
// messageInput.style.backgroundColor = 'yellow'
  // console.log(reponse.data.ai_response)
}


function showMessages(message) {
    // console.log(message)
    const parentMessageContainer = document.getElementById('parentMessageContainer');
  
    // const outerDiv = document.createElement('div');
    // outerDiv.classList.add('d-flex', 'justify-content-start', 'mb-4');
  
    // const messageContent = document.createElement('div');
    // const time = document.createElement('span')
    // const name = document.createElement('span')
    // const decodedMessage = decodeURIComponent(message.message)
  
  
    // time.textContent = message.date
    // outerDiv.appendChild(messageContent);
    // parentMessageContainer.appendChild(name)
    // parentMessageContainer.appendChild(outerDiv);
    // parentMessageContainer.appendChild(time)
    // parentMessageContainer.appendChild(document.createElement('hr'))
    // parentMessageContainer.scrollTop = parentMessageContainer.scrollHeight
  }
  