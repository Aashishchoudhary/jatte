/**
 * variables
 */

const chatRoom = document.querySelector('#room_uuid').textContent.replaceAll('"' ,'')

let chatSocket = null


/**
 * Elements
 */


const chatLogElement= document.querySelector('#chat_log')

const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");



/**
 * Functions
 */

function scrollBottom(){
    chatLogElement.scrollTop = chatLogElement.scrollHeight
  }
  

function sendMessage() {
    chatSocket.send(
      JSON.stringify({
        type: "message",
        message: chatInputElement.value,
        name: document.querySelector('#user_name').textContent.replaceAll('"' ,""),
        agent: document.querySelector('#user_id').textContent.replaceAll('"' ,""),
      })
    );
    chatInputElement.value = "";
  }


function onChatMessage(data) {
    console.log("onchatMessage", data);
  
    if (data.type == "chat_message") {
      if (data.agent) {
        chatLogElement.innerHTML +=
         `<div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end "> 
       <div>
  <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
        <p class="text-sm">${data.message}</p></div>
        <span class="text-xs text-gray-500 leading-none"> ${data.created_at} ago</span>
        </div>
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2
        ">${data.initials}</div></div>`;
      } else {
        chatLogElement.innerHTML +=
         `<div class="flex w-full mt-2 space-x-3 max-w-md "> 
       <div>
  <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
        <p class="text-sm">${data.message}</p></div>
        <span class="text-xs text-gray-500 leading-none"> ${data.created_at} ago</span>
        </div>
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2
        ">${data.initials}</div></div>`;
      }
    }
    scrollBottom()
  }
/**
 * Web socket
 */

chatSocket= new WebSocket(`ws://${window.location.host}/ws/chat/${chatRoom}/`)




chatSocket.onmessage=function(e){
    console.log('on message')

  onChatMessage(JSON.parse(e.data))
}

chatSocket.onopen=function(e){
    console.log('on open')
    scrollBottom()
}
chatSocket.onclose=function(e){
    console.log('on close ')
}


/**
 * Event listner
 */

chatSubmitElement.onclick = function (e) {
    e.preventDefault();
  
    sendMessage();
  
    return false;
  };
  


// chatInputElement.onkeyup=function(e){
//     if(e.keycode==13){
//       sendMessage()
//     }
//   }


chatInputElement.onfocus = function(e){

  console.log('in focus')
  chatSocket.send(JSON.stringify({
    type: "update",
    message: 'writing_activate',
    name: document.querySelector('#user_name').textContent.replaceAll('"' ,""),
    agent: document.querySelector('#user_id').textContent.replaceAll('"' ,"")
  }))
}

