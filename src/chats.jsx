import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import { UserContext } from './userContext';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Chats = () => {

   const [ws,setws]=useState(null);

   const [onlineUser,setOnlineUser] = useState({});

   const [offlineUser,setofflineUser] = useState([]);

 const [selectedUser,setSelectedUser] = useState(null);


 const [Msg,setMsg]=useState([]);

 const [message,setMessage]=useState('');

 const parentRef=useRef(null);
 const messageRef=useRef(null);

 const navigate = useNavigate()
 const [images,setImages] = useState({});



const onlineUserColors = useMemo(() => {
  const colors = ['bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500'];
  const onlineColors = {};

  Object.keys(onlineUser).forEach((key) => {
    onlineColors[key] = colors[Math.floor(Math.random() * colors.length)];
  });

  return onlineColors;
}, [onlineUser]);

 const showOnline=(data)=>{

  const obj={};
const o1={}
  data.forEach(element => {

    const {userId,username,img}=element;
      
    console.log(img);
    obj[userId]=username;


    if(userId!=id){
      o1[userId]=img;
    }
   
    
  });

  console.log(obj);

  console.log(o1);

console.log(`show_online inside `)
  setOnlineUser(obj);

  setImages(o1);


 }

   const {username,id}=useContext(UserContext);
  


   console.log("my id is "+id);
           

   console.log(onlineUser);
   
  const onlineExcludingMe={...onlineUser};

  delete onlineExcludingMe[id];



  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };

    console.log(ev.target.files[0].name);
  }


  const logout=async()=>{

    try {


      
   const {data}=  await axios.post('/logout');

console.log(data);
   navigate('/login');
      
    } catch (error) {
      
    }






  }


  const sendMessage=(ev,file)=>{


    // if(file==null && message===""){

    //   alert(`you cant send empty message`);

    //   return ;

    // }

    


    console.log(`sending`);
console.log(ws);

console.log(file);

// console.log(file.name);
console.log(message);                  
    ws.send(JSON.stringify({
      message:{
        reciepient:selectedUser,
        text:message,
        file,

        sender:id
      }
    }))

const Message={
  reciepient:selectedUser,
  text:message,
   
  sender:id
}

if(file!=null){  

  Message.file=file;

}

if (file) {

 delete Message['text'];
    axios.get('/message/'+selectedUser).then(res => {

      console.log(res.data);
      setMsg(res.data);
    }).catch(err=>{
      console.log(err);
    })



}


else{

  setMsg(prev=>([...prev,Message]))

  setMessage('');

}
     
  
  
   }


   const handleMessage=(e)=>{


    const messageData=JSON.parse(e.data);


    console.log(messageData);


    if( messageData.online){


      showOnline(messageData.online)



    }
    else{

      setMsg(prevMsg => [...prevMsg, messageData]);

    


    }





    console.log(`new message`, JSON.parse(e.data));

   }


   const reconnect=()=>{

    
    const newWs = new WebSocket("wss://chatbackend-production-eef8.up.railway.app");
    setws(newWs);

    newWs.addEventListener("message", handleMessage);


     


   }


   useEffect(()=>{


  console.log(`useEffect is fired`);               

console.log(`newWs is fired`);

      let  newWs = new WebSocket("wss://chatbackend-production-eef8.up.railway.app/");
      setws(newWs);

      newWs.addEventListener("message", handleMessage);
       
 console.log('new ws'); 
 
 
     newWs.addEventListener('close',(event)=>{

      if (!event.wasClean) {
        console.log('Attempting to reconnect...');
        const reconnectInterval = setInterval(() => {
          newWs = new WebSocket("wss://chatbackend-production-eef8.up.railway.app");
          newWs.addEventListener('open', () => {
            console.log('Reconnected to WebSocket');
            clearInterval(reconnectInterval);
          });
        }, 3000); 


     }})
      return () => {

        console.log(`unmounting`); 
        newWs.removeEventListener("message", handleMessage);
        newWs.close();
      };
    
   },[])



   useEffect(()=>{
    if(selectedUser){
      console.log(`id is ${selectedUser}`);
      axios.get(`/message/${selectedUser}`).then(({data})=>{
            console.log(`data has arrived`);
      console.log(data);
      setMsg(data);
    }
  
  ) }

   },[selectedUser])


   useEffect(()=>{

    const div=messageRef.current;

    if(div){



      console.log(id +"me");          



      div.scrollTop = div.scrollHeight;
    }

   },[Msg])

     

   useEffect(() => {

    console.log(`online`);
    axios.get('/people').then(({ data }) => {

      console.log(data);
      const offline = data
        .filter((p) => p._id !== id)
        .filter((c) => onlineUser.hasOwnProperty(c._id) === false);
  
console.log(offline);

      offline.forEach((c) => {
        setImages((prev) => ({
          ...prev,
          [c._id]: c.img
        }));
      });
  
      setofflineUser(offline);
    });
  }, [onlineUser]);

 


console.log(images);

// console.log(onlineExcludingMe);

// let n=colors.length;
// let count=0;

  return (
    <div className='h-screen  flex'> 
    <div className="w-1/4 pl-3 pt-3">
  

  <div className="title text-blue-600 font-bold	text-2xl flex items-center mb-4" >
    <div >Chat-App</div>
      
   <div className='logo'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
</svg>
</div>
    
  </div>

  <div className='overflow-auto h-3/4	'>
 <div className="onlineUsers font-semibold  text-xl  font-sans ">

{Object.keys(onlineExcludingMe).map((key)=>(
<div className={ selectedUser==key?'mb-2 cursor-pointer bg-cyan-100 flex items-center gap-2':"mb-2 cursor-pointer  flex items-center gap-2 "
}   onClick={()=>setSelectedUser(key)} >


  <div class="relative">
   
<div className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full    ${onlineUserColors[key]}`}>
    <span class="font-medium text-gray-600 dark:text-gray-300">{onlineUser[key].charAt(0)}</span>
    <span class="bottom-0 left-5	 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"/>

</div>

</div>

<span>{onlineUser[key]}</span>
{/* <span>{"live" +images[key]}</span> */}
   
 
 {/* { key &&<span className=' bg-lime-600 h-2 w-2 	rounded-full'></span>} */}
  </div>
))

}

</div>


<div className="offlineUsers font-semibold  text-xl  font-sans ">

      
{offlineUser.map((user)=>(

  <div  className={ selectedUser==user._id?'mb-2 cursor-pointer bg-cyan-100 flex items-center gap-2':"mb-2 cursor-pointer  flex items-center gap-2 "
}   onClick={()=>setSelectedUser(user._id)}>
 
 <div class="relative">
 <div class={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full   ${colors[Math.floor(Math.random() * colors.length)]}`}>
    <span class="font-medium text-gray-600 dark:text-gray-300">{user.username.charAt(0)}</span>
    <span class="bottom-0 left-5	 absolute  w-3.5 h-3.5 bg-slate-400	 border-2 border-white dark:border-gray-800 rounded-full">
</span>
</div>

</div>

<span>{user.username}</span>
   
  </div>
  
))

}

</div>

</div>


   <div className='flex  items-center gap-2	'>

   <span className='font-bold text-xl	'>{'welcome  '+username}</span>
    <button onClick={logout} className='rounded-md bg-blue-600  text-center font-medium p-3 text-white text-base		'>Logout </button>
   </div>

    </div>

    <div className="w-3/4 p-4 bg-emerald-100	  " >

<div className="h-full flex  flex-col gap-2	 justify-center border-opacity-5">

<div ref={messageRef} className='messages flex-col gap-5 overflow-auto h-3/4 p-3 border-solid border-4 border-hapu-600 '>
       {/* <div  className='message flex flex-col '></div> */}
        {!selectedUser &&(<div>

          <div className='font-bold text-2xl	text-white text-center'>
          
          Pls select user to chat from sidebar
          </div>
          </div>
        )
        }

        {selectedUser &&(<div className=''>
          

{Msg.map(message=>(

     <div className={message.sender==id?('flex flex-row mb-5'):('flex flex-row-reverse mb-5 ')}>
    { message.text &&(<div className={message.sender==id?' bg-thapa-400 font-bold font-sans min-w-150 max-w-md	 break-words rounded-md border border-hapu-600 p-6':'bg-white font-serif  font-bold min-w-150 max-w-md	 break-words rounded-md p-6  border border-hapu-600'}>
   
      {message.text}
     </div>)}
     {message.file && (
                        <div className={"rounded-md p-2 text-white"+((id==message.sender)?(' bg-blue-500 '):(' bg-green-500 '))}>
                          <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
     </div>
))

}      

</div> 
        )

        }
        </div>

      {selectedUser && <div className='Search flex gap-1'>

            <input type="text" value={message} onChange={(ev)=>setMessage(ev.target.value)} placeholder='send msg' className='grow border rounded-sm p-2' name="" id=""  />
           
            <button onClick={sendMessage} className="bg-blue-500 p-2 text-white rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>

        </div>

        }
        
</div>
  
    </div>
    
    
    </div>
  )
}
