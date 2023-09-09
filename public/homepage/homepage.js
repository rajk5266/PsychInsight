jQuery(function ($) {

  $(".sidebar-dropdown > a").click(function () {
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

  $("#close-sidebar").click(function () {
    $(".page-wrapper").removeClass("toggled");
  });
  $("#show-sidebar").click(function () {
    $(".page-wrapper").addClass("toggled");
  });
});
const token = { headers: { 'Authorization': localStorage.getItem('token') } }

window.addEventListener('DOMContentLoaded', async () => {
  const name = await axios.get('http://localhost:1010/getName', token)
  // console.log(name)
  document.getElementById('userName').textContent = name.data.name
  allSessions();
  const liveSession = await activeSession()
  // console.log(liveSession)
  if (liveSession.isActive === true) {
    showChatSection(liveSession._id)
    //  getMessages(liveSession._id)
  }
  else {
    startNewSession()
  }
})

function showChatSection(sessionId) {
  const sessionButton = document.getElementById('session-button')
  const sessionElement = document.getElementById('session');
  const chatContainer = document.getElementById('chatContainer')
  document.getElementById('sendMessageButton').dataset.sessionId = sessionId;
  document.getElementById('end-session').dataset.sessionId = sessionId;
  sessionElement.style.height = '100px'
  sessionButton.disabled = true;
  sessionButton.innerText = 'Ongoing Session...';
  // sessionButton.style.color = 'green';
  chatContainer.style.display = 'block';

  getMessages(sessionId)
}

function startNewSession() {
  const sessionButton = document.getElementById('session-button')
  sessionButton.addEventListener('click', async () => {
    const session = await newSession()
    const sessionID = session.sessionId;
    // document.getElementById('sendMessageButton').dataset.sessionId = sessionID
    showChatSection(sessionID)
  })
}

async function activeSession() {
  try {
    const response = await axios.get('http://localhost:1010/currentSession', token)
    const session = response.data.session[0]
    // console.log(session)
    if (session && session.isActive === true) {
      return session;
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}


async function sendMessage(e) {
  e.preventDefault()
  const messageInput = document.getElementById('sendMessageInput')
  const message = messageInput.value;
  const sessionId = document.getElementById('sendMessageButton').dataset.sessionId;
  // console.log(sessionId)
  messageInput.value = '';
  const obj = { role: 'user', content: message }
  // console.log(obj)
  showMessages(obj)
  const response = await axios.post(`http://localhost:1010/sendMessage/${sessionId}`, { message }, token)
  console.log(response)
  showMessages(response.data)
}

async function getMessages(sessionId) {
  try {
    // const sessionId = document.getElementById('sendMessageButton').dataset.sessionId;
    const response = await axios.get(`http://localhost:1010/getMessages/${sessionId}`, token)
    if (response.data.length === undefined) {
      showMessages(response.data)
    } else {
      for (let i = 1; i < response.data.length; i++) {
        showMessages(response.data[i])
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function showMessages(message) {
  const parentMessageContainer = document.getElementById('chat-box');

  const outerDiv = document.createElement('div');
  outerDiv.classList.add('d-flex', 'justify-content-start', 'mb-4');

  const messageContent = document.createElement('div');
  const name = document.createElement('span')

  if (message.type === 'music') {
    const musicOptionsDiv = document.createElement('div');
    musicOptionsDiv.classList.add('music-options');

    const musicOptionsList = document.createElement('ul');

    const musicGenres = message.genre;
    musicGenres.forEach((genre) => {
      const listItem = document.createElement('li');
      listItem.textContent = genre;
      musicOptionsList.appendChild(listItem);
    });
    musicOptionsDiv.appendChild(musicOptionsList);
    messageContent.textContent = message.content
    messageContent.appendChild(musicOptionsDiv);
  }
  else if (message.type === 'url') {
    const musicDiv = document.createElement('div');
    const musicList = document.createElement('ul');
    const musicURLs = message.musicURL;
    musicURLs.forEach((url) => {
      const listItem = document.createElement('li');
      listItem.style.listStyle = 'none'
      listItem.style.marginBottom = '4px'
      const playButton = document.createElement('button');
      playButton.dataset.url = url

      playButton.textContent = 'Play';
      playButton.className = 'btn btn-primary btn-sm'
      playButton.addEventListener('click', () => {
        openAudioPlayer(url)
      })
      listItem.appendChild(playButton);
      musicList.appendChild(listItem);
    })
    musicDiv.appendChild(musicList)
    messageContent.textContent = message.content;
    messageContent.appendChild(musicDiv)
  }
  else {
    if (message.role == 'user') {
      messageContent.classList.add('msg_container_own');
      messageContent.textContent = message.content
    }
    else if (message.role == 'assistant') {
      messageContent.classList.add('msg_container_assistant')
      messageContent.textContent = message.content
      name.textContent = 'Assistant'
    }
  }
  outerDiv.appendChild(messageContent);
  parentMessageContainer.appendChild(name)
  parentMessageContainer.appendChild(outerDiv);

  parentMessageContainer.scrollTop = parentMessageContainer.scrollHeight
}

async function newSession() {
  try {
    const response = await axios.get('http://localhost:1010/newSession', token)
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const closePlayerButton = document.getElementById('closePlayer');
const musicPlayerPopup = document.getElementById('musicPlayer');

closePlayerButton.addEventListener('click', () => {
  musicPlayerPopup.style.display = 'none';
});

function openAudioPlayer(url) {

  const musicDiv = document.getElementById('musicDiv')
  const oldAudio = document.querySelector('audio');
  if (oldAudio) {
    musicDiv.removeChild(oldAudio)
  }
  const newAudio = document.createElement('audio');
  newAudio.id = 'music-url';
  newAudio.controls = true;
  newAudio.src = url;

  musicDiv.appendChild(newAudio)
  musicPlayerPopup.style.display = 'block';
}

const endSessionButton = document.getElementById('end-session')
endSessionButton.addEventListener('click', async () => {
  const sessionId = endSessionButton.dataset.sessionId

  const conclusion = await axios.get(`http://localhost:1010/endSession/${sessionId}`, token)
  // console.log(conclusion)
  const reportBody = document.getElementById('report')
  reportBody.innerHTML = conclusion.data.sessionReport

  const modal = document.getElementById('exampleModalCenter');
  const modalObject = new bootstrap.Modal(modal)
  modalObject.show();

  const closeModal = document.getElementById('closeModal')
  closeModal.addEventListener('click', () => {
    window.location.reload()
  })
})

async function allSessions() {
  try {
    const totalSessions = await axios.get('http://localhost:1010/allSessions', token)
    for(let i=0; i<totalSessions.data.sessions.length; i++){
      appendSessions(totalSessions.data.sessions[i])
    }
  } catch (err) {
    console.log(err)

  }
}

function appendSessions(session){
// console.log(session)
const date = session.date.split('T')[0]
// console.log(date)
const parentElement = document.getElementById('previousSessions');

const listItem = document.createElement('li');

const iconElement = document.createElement('i');
iconElement.classList.add('fa', 'fa-file');

const buttonElement = document.createElement('button');
buttonElement.classList.add('previousSessionButton')

buttonElement.textContent = date; 
buttonElement.dataset.sessionId = session._id;
buttonElement.addEventListener('click', () => {
  showReport(session)
})

listItem.appendChild(iconElement);
listItem.appendChild(buttonElement);

parentElement.appendChild(listItem);
parentElement.scrollTop = parentElement.scrollHeight
}

function showReport(session){
  document.getElementById('chat-box').innerHTML = ''
  const sessionButton = document.getElementById('session-button')
  const sessionElement = document.getElementById('session');
  const chatContainer = document.getElementById('chatContainer')
  document.getElementById('message-form').style.display = 'none'
  document.getElementById('end-session').style.display = 'none';
  sessionElement.style.height = '100px'
  sessionButton.disabled = true;
  sessionButton.innerText = 'previous Session...';
  // sessionButton.style.color = 'black';
  chatContainer.style.display = 'block';

  getMessages(session._id)
  const reportBody = document.getElementById('report')
  reportBody.innerHTML = session.report

  const modal = document.getElementById('exampleModalCenter');
  const modalObject = new bootstrap.Modal(modal)
  modalObject.show();

  // const closeModal = document.getElementById('closeModal')
  // closeModal.addEventListener('click', () => {
  //   window.location.reload()
  // })
  
}
