/**
 *
 */

let chatName = "";
let Socket = "";
let chatWindowUrl = window.location.href;
let chatRoomUuid = Math.random().toString(36).slice(2, 12);

/*
 * Elements
 */

const chatElement = document.querySelector("#chat");
const chatOpenElement = document.querySelector("#chat_open");
const chatIconElement = document.querySelector("#chat_icon");
const chatJoinElement = document.querySelector("#chat_join");
const chatWelcomeElement = document.querySelector("#chat_welcome");
const chatRoomElement = document.querySelector("#chat_room");
const chatNameElement = document.querySelector("#chat_name");
const chatLogElement = document.querySelector("#chat_log");
const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");

/**
 * Functions
 */

function scrollBottom(){
  chatLogElement.scrollTop = chatLogElement.scrollHeight
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function sendMessage() {
  chatSocket.send(
    JSON.stringify({
      type: "message",
      message: chatInputElement.value,
      name: chatName,
    })
  );
  chatInputElement.value = "";
}

function onChatMessage(data) {
  console.log("onchatMessage", data);

  if (data.type == "chat_message") {
    if (data.agent) {
      chatLogElement.innerHTML +=
       `<div class="flex w-full mt-2 space-x-3 max-w-md "> 
     <div>
<div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
      <p class="text-sm">${data.message}</p></div>
      <span class="text-xs text-gray-500 leading-none"> ${data.created_at} ago</span>
      </div>
      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2
      ">${data.initials}</div></div>`;
    } else {
      chatLogElement.innerHTML +=
       `<div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end"> 
     <div>
<div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
      <p class="text-sm">${data.message}</p></div>
      <span class="text-xs text-gray-500 leading-none"> ${data.created_at} ago</span>
      </div>
      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2
      ">${data.initials}</div></div>`;
    }
  } else if(data.type== 'users_update'){
    chatLogElement.innerHTML +='<p class="mt-2">The admin/agent has joined the chat</p>'
  }
  else if(data.type =='writing_active'){
    chatLogElement.innerHTML +='<p class="mt-2">typing...</p>'
  }
  else if(data.type =='writing_stop'){
    chatLogElement.innerHTML +='<p class="mt-2">typing stopped...</p>'
  }
  scrollBottom()
}

async function joinChatRoom() {
  
  chatName = chatNameElement.value;

  const data = new FormData();
  data.append("name", chatName);
  data.append("url", chatWindowUrl);
  console.log("windows urll...", chatWindowUrl);
  // api/create-room/<str:uuid>/
  await fetch(`api/create-room/${chatRoomUuid}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: data,
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("data", data);
    });
  chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/chat/${chatRoomUuid}/`
  );

  chatSocket.onmessage = function (e) {
    console.log("onMessage");

    onChatMessage(JSON.parse(e.data));
  };
  chatSocket.onopen = function (e) {
    console.log("onOpen - chat socket was opened");
   
   
    scrollBottom()
  };
  chatSocket.onclose = function (e) {
    console.log("onClose - chat socket was closed");
  };
}

/*
 * event Listners
 */

chatOpenElement.onclick = function (e) {
  e.preventDefault();
  console.log("open click");

  chatIconElement.classList.add("hidden");
  chatWelcomeElement.classList.remove("hidden");
  return false;
};
chatJoinElement.onclick = function (e) {
  e.preventDefault();

  chatWelcomeElement.classList.add("hidden");
  chatRoomElement.classList.remove("hidden");

  joinChatRoom();
  return false;
};

chatSubmitElement.onclick = function (e) {
  e.preventDefault();

  sendMessage();

  return false;
};


chatInputElement.onkeyup=function(e){
  if (e.keycode == 13) {
    sendMessage()
    console.log('fffff')
  }
}