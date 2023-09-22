import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import { UserContext } from './userContext';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import GroupModal from './GroupModal';
import { Box, Icon } from '@chakra-ui/react';

import {BiDotsVerticalRounded} from 'react-icons/bi'
import { UserList } from './UserList';
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

 const [typing,setTyping]=useState([]);


 const [timer,settimer]=useState(null);

const[groups,setGroups]=useState([]);

const [selectedGroup,setselectedtGroup]=useState(null);
const[groupMessage,setgroupMessage]=useState([]);
const [notification,setNotification]=useState([]);

const [currentnotification,setcurrentnotification]=useState(null);

const [incomingtext,setincomingtext]=useState(null);



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
  
   const sendTypingMessage=()=>{
    console.log(`enetered sending typing message`);
          const m1={
            message:{
              reciever:selectedUser,
              text:"typing",
              type:'typing',
            
      
            }
      
          }
      
      ws.send(JSON.stringify(m1));
    
    
    
       }
    

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

  useEffect(()=>{


    if(currentnotification && currentnotification.GroupId){
    
    
      console.log(currentnotification.GroupId + "  "+selectedGroup);
    if(selectedGroup ===currentnotification.GroupId){
    
      console.log(`in same grup`);
    
      return;
    }
    
      
    
    console.log(currentnotification);
      
    
    
    axios.post('/notification',
      currentnotification).then(({data})=>{
    
        console.log(data);
    
      setNotification(prev=>[...prev,currentnotification]);
      setcurrentnotification(null);
    }).catch(err=>console.log(err));
    
    
    
    }
    
    
       else  if(currentnotification){
    
    
    
    
          console.log(currentnotification===selectedUser);
    
          console.log(currentnotification+" "+selectedUser);
    const sender = currentnotification.sender;
    const text=currentnotification.text;
    const reciever = currentnotification.reciepient;
    console.log(JSON.stringify(currentnotification));
    // return;
          if(currentnotification.sender!=selectedUser){
            console.log(selectedUser);
    axios.post('/notification',{
            sender,
            reciever,
            text,
            isRead:false
            }).then(({data})=>{
    
              console.log(JSON.stringify(data));
              setNotification(prev=>[...prev,data]);
            }).then(()=>{
              setcurrentnotification(null)
            })
    
          }
    
        
        }
    
    
      },[currentnotification])
    

  
      async  function sendGroup(){

        try {
        
        ;
          const {data}=  await axios.post('/group/message',{chatId:selectedGroup,message:message,name:username});
        
          console.log(data);
          const {members}=data;
        
        console.log(selectedGroup
          
          );
          for(let i=0;i<members.length;i++){
        
        
            if(members[i]!=id && !onlineExcludingMe[members[i]]){
        
              const recieptent=members[i];
              
        
              await axios.post('/notification',{
                sender:id,
                reciever:recieptent,
                text:message,
                isGroup:true,
                GroupId:selectedGroup,
                isRead:false
                
              })
        
            }
        
            else{
         
        
              ws.send(JSON.stringify({
                message:{
                  GroupId:selectedGroup,
                  text:message,
                  reciever:members[i],
                  name:username,
                  type:'notifyGroup',
                  sender:id
            
                }
            
              }))
        
              /// post group notification
        
        
            }
        
        
        
          }
        
        
        
        console.log(message.length);
          const messge={
            message:{
              roomId:selectedGroup,
              text:message,
              type:'group',
              members,
              name:username
        
            }
        
          }
        console.log(messge);
        
        ws.send(JSON.stringify(messge));
        
        setMessage('');
          
        } catch (error) {
          console.log(error);
        }
           
        
          }
        
  
    
          const sendjoin= function (room){



            console.log(room);
            
        
            console.log(`send join ${room}`);
            const message={
             
        
            }
        
        
            console.log(message);
        
            ws.send(JSON.stringify({
        
             message: {
         sender:id,
              room,
              type: 'join',
             }
              
        
            }))
        
        
        
           
        
        
            
        
          }
        
  

          const getUser=()=>{
            return selectedUser;
              }
            
            
            var Users=selectedUser
            
  
            async  function notified(messageData){
              if(messageData.type=='notify'){
              
              
                const {type,...others}=messageData;
          
          const sender=messageData.sender;
          
          const text=messageData.text;
          
          const reciever=id;
          console.log(others);
          console.log(Users);
          setcurrentnotification(messageData);
          console.log(selectedUser,Msg);
          if(messageData.sender!==selectedUser){
          
          
          
          // setNotification(prev=>[...prev,data]);
          
          }
          
          return;
          
               }
          
            }
                 


            const sendMessage=async(ev,file)=>{

              console.log(`sending`);
          console.log(ws);
          
          console.log(file);
          
          
          
          ws.send(JSON.stringify({
            message:{
              reciepient:selectedUser,
              text:message,
              type:'notify',
              sender:id
            }
          }))
          
          
          
          // console.log(file.name);
          console.log(selectedUser);
          console.log(message);                  
            ws.send(JSON.stringify({
              message:{
                reciepient:selectedUser,
                text:message,
                file,
          
                sender:id
              }
            }))
          
          
          if(!onlineExcludingMe[selectedUser]){
          
          
            console.log(selectedUser+"is ");
            await axios.post('/notification',{
              sender:id,
              reciever:selectedUser,
              text:message
            })
          
          console.log(message);
          
          }
          
            console.log(selectedUser +"is "+selectedUser);
          
          
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
          
  
  
     function selectGroup(id){
  setMsg([]);
  setselectedtGroup(id);
  setSelectedUser(null);
  
  
     }
  
  
    
  
  
     function handleInputChange(event) {
      const newValue = event.target.value;
      setMessage(newValue);
  
      const newTypingTimeout = setTimeout(() => {
        settimer(null);
        //sendClear()
  
        clearTyping()
      }, 1000);
      // Clear any existing typing timeout
      if (timer) {
        console.log(`timer exist`);
  
        clearTimeout(timer);
  
        settimer(newTypingTimeout);
      }
      else{
        console.log(`sending`);
  
        sendTypingMessage();
  
        settimer(newTypingTimeout);
  
      }
  
      // Set a new typing timeout to send the message after 1000 milliseconds (1 second)
    
  
  
      // Save the new typing timeout to state
      settimer(newTypingTimeout);
      console.log(timer,"timer");
    }
  
  
    
  
  
    function clearTyping(){
  
      ws.send(JSON.stringify({
        message:{
          type:'stop',
          reciever:selectedUser
  
        }
      }))
  
  
    }
  


    const fetchgroup=()=>{

      console.log(`fetch`);
      axios.get('/group').then((res)=>{
        const {data}=res;
        const newArray = [];
    
    
        for(let i=0; i<data.length; i++){
    
          if(data[i].members.includes(id)){
            newArray.push(data[i]);
          }
        }
          console.log(newArray);
        setGroups(newArray);
       
      })
     }
  




   const reconnect=()=>{

    
    const newWs = new WebSocket("wss://chatbackend-production-eef8.up.railway.app");
    setws(newWs);

    newWs.addEventListener("message", handleMessage);


     


   }



   const fetchNotifications=async()=>{

    console.log(id);

    const {data}=await axios.get('/notification/'+id);

    console.log(data);
    setNotification(data);

   }



   useEffect(()=>{

    fetchgroup();

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
    setgroupMessage([]);
    
    console.log(selectedUser);
    
        if(selectedUser){
          setselectedtGroup(null);
          console.log(`id is ${selectedUser}`);
          axios.get(`/message/${selectedUser}`).then(({data})=>{
                console.log(`data has arrived`);
          console.log(data);
          setMsg(data);
        }
      
    
      ) }
    
       },[selectedUser])
    
    



   useEffect(()=>{

    if(selectedGroup){
  
      setSelectedUser(null);
  
      console.log(selectedGroup);
  
    axios.get(`/groups/${selectedGroup}`).then(({data})=>{
        console.log(`data has arrived`);
        console.log(data);
  
        
        setgroupMessage(data.messages);
  })
  
  
  
   
  
    }
  
  },[selectedGroup])
  



   useEffect(()=>{

    const div=messageRef.current;

    if(div){



      console.log(id +"me");          



      div.scrollTop = div.scrollHeight;
    }

   },[Msg,groupMessage])

     

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

 
  useEffect(()=>{

    if(incomingtext && selectedUser&& selectedUser==incomingtext.sender){
      setMsg(prevMsg => [...prevMsg, incomingtext]);

    }

   },[incomingtext])


   useEffect(()=>{

    if(id){
      fetchNotifications();

      fetchgroup();
    }
   
   },[id])

console.log(images);

// console.log(onlineExcludingMe);
const handleMessage= async(e)=>{
 
  const messageData=JSON.parse(e.data);
console.log(selectedUser);

  console.log(e.data);

          
     if(messageData.type=='notifyGroup'){

console.log(messageData);
            
        setcurrentnotification(messageData);

      return ;

     }

  if(messageData.type=='join')
  
  {

    setGroups(prev=>[...prev,messageData.room]);

    console.log(messageData);

    return;

  }

else  if(messageData.type=='group'){

    console.log(`this side courier of group`);

    console.log(messageData);


    setgroupMessage((prevGroupMessage)=>[...prevGroupMessage,messageData]);
    return;
  }
  

  else  if(messageData.type=='notify'){

   notified(messageData)

   return;

   }










else  if( messageData.online){


    showOnline(messageData.online)


return;
  }

else  if(messageData.type=='typing'){

    const sender=messageData.sender;

    console.log('the typer is '+sender);
  setTyping(prevtype=>[...prevtype,sender])

  console.log(`people are typing `+sender);


return;
  }
 else  if(messageData.type=='stop'){
    const {sender}=messageData;
    let newArr=[];

typing.map((id)=>{

  if(sender!=id){

    newArr.push(id);
  }

})

setTyping(newArr);

return;
  }
  else {

    setincomingtext(messageData)

  


  }





  console.log(`new message`, JSON.parse(e.data));

 }


 const updateeNotifications=async(uid)=>{

    
  setSelectedUser(uid);
      try {
        console.log(uid);
  
      const {data}=  await axios.post(`/notification/read`,{
         sender: uid,
         reciever:id,
         isGroup:false
        });
  
  
        setNotification(notification.filter((not)=> (not.isGroup  || not.sender!=uid)));
        console.log(data);
        // fetchNotifications();
        
      } catch (error) {
        
        console.log(error);
      }
  
     }
  
  
  
     const updateGroupNotifications=async(uid)=>{
  
      setSelectedUser(null);
  setselectedtGroup(uid);
  
  
  console.log(uid);
  
  
  
  
  const {data}=  await axios.post(`/notification/read`,{
    GroupId: uid,
    isGroup:true
   });
  
  
   console.log(data);
   
    setNotification(notification.filter((not)=>not.GroupId!=uid));
     return;
  
     }

     const map=new Map();
     console.log(notification);
     const unreadNotifications=notification.filter((notify)=>{
     
     
      return notify.isRead!=true;
     })
     
     console.log(unreadNotifications);
     
     unreadNotifications.map((notify)=>{
       
       let id= notify.GroupId ||notify.sender;
     
       console.log(notify.GroupId ===id) ;
       if(map.has(id)){
     map.set(id,map.get(id)+1);
       }
       else{
     
         map.set(id,1);
     
       }
     })
     

// let count=0;

const colors = ['bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500','bg-sky-600', 'bg-lime-400', 'bg-yellow-600', 'bg-violet-600', 'bg-pink-500', 'bg-rose-500',];



// let count=0;

let count=-1;

let n=colors.length;

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
<GroupModal sendjoin={sendjoin}/>

  </div>

  <div className='overflow-auto h-3/4	'>
  <div className="groups font-semibold  text-xl  font-sans">
{ groups.map(group=>(
  <div  className={ selectedGroup==group._id?'mb-2 cursor-pointer  bg-cyan-100 flex items-center gap-2':"mb-2 cursor-pointer  flex items-center gap-2 "
}   onClick={()=>selectGroup(group['_id'])}>{group.name}
  {map.has(group._id) &&<span>{map.get(group._id)}</span>}

{/* <span>{group._id}</span> */}
</div>
))

}
<br />
    </div>
 <div className="onlineUsers font-semibold  text-xl  font-sans ">

{Object.keys(onlineExcludingMe).map((key,idx)=>(
<div className={ selectedUser==key?'mb-2 cursor-pointer bg-cyan-100 flex items-center gap-2':"mb-2 cursor-pointer  flex items-center gap-2 "
}   onClick={()=>setSelectedUser(key)} >


  <div class="relative">
   
<div className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full   ${colors[idx]}`}>
    <span class="font-medium text-gray-600 dark:text-gray-300">{onlineUser[key].charAt(0)}</span>
    <span class="bottom-0 left-5	 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"/>

</div>

</div>

<span>{onlineUser[key]}</span>
{typing.length>0 && typing.indexOf(onlineUser[key])!=-1 && <span>Typing</span>}

{/* <span>{"live" +images[key]}</span> */}
   
 
 {/* { key &&<span className=' bg-lime-600 h-2 w-2 	rounded-full'></span>} */}
  </div>
))

}

</div>


<div className="offlineUsers font-semibold  text-xl  font-sans ">

      
{offlineUser.map((user,idx)=>(

  <div  className={ selectedUser==user._id?'mb-2 cursor-pointer bg-cyan-100 flex items-center gap-2':"mb-2 cursor-pointer  flex items-center gap-2 "
}   onClick={()=>setSelectedUser(user._id)}>
 
 <div class="relative">
 <div class={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full  ${colors[idx]
}`}>
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

    <div style={{backgroundImage:`url("https://e1.pxfuel.com/desktop-wallpaper/461/478/desktop-wallpaper-whatsapp-dark-whatsapp-chat.jpg")`}}   className="w-3/4 p-4 bg-emerald-100	  " >

    {selectedGroup &&<Box display="flex" flexDir="row-reverse">

<Box pos="relative">
<Box     pos="" borderRadius="50%" backgroundColor="black" p="2px"  onClick={()=>settoggle(!toogle)}>
<Icon  color="white" height="40px" width="40px" as ={BiDotsVerticalRounded}>

</Icon>





</Box>


    

<UserList  selectedGroup={selectedGroup} toggle={toogle}/>



</Box>


</Box>}
  <div className=" z-50">
   {currentWidth &&(<button  onClick={()=>setOpen(!open)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-4 py-2.5 mr-2 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
  Users
   </button>)}
</div>
<span class="relative inline-block  " onClick={()=>setNotificationOpen(!notificationOpen)}>
  <svg class="w-12 h-12 text-gray-700 fill-current" viewBox="0 0 20 20"><path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
  {unreadNotifications.length>0 &&<span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{  unreadNotifications.length}</span>}

  {notificationOpen && (
<div onClick={()=>setNotificationOpen(!notificationOpen)} class="max-w-sm mx-auto  bg-white absolute top-0px	">
    {unreadNotifications.map(message=>
      <div key={message._id} onClick={()=> message.GroupId?updateGroupNotifications(message.GroupId): updateeNotifications(message.sender)  } class="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
        <div class="flex items-center">
            <div class="ml-2 flex flex-col">
                <div class="leading-snug text-sm text-gray-900 font-bold">{message.text}</div>
                <div class="leading-snug text-xs text-gray-600">{message.GroupId || message.sender}</div>
            </div>
        </div>
    </div>

    )}
   
   
</div>)}
</span>




<div className="h-full flex  flex-col 	 justify-center border-opacity-5">



<div ref={messageRef} className='messages flex-col gap-5 overflow-auto h-2/3 p-3 border-solid border-4 border-hapu-600 '>
       {/* <div  className='message flex flex-col '></div> */}
        {!selectedUser && !selectedGroup && (<div>

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
  
     </div>
))

}      

</div> 
        )

        }
        {selectedGroup && 
        
  (<div className='groupchat' >
    {groupMessage.map((message) =>( 
    
    <div   className={message.sender == id ? 'flex flex-row mb-5' : 'flex flex-row-reverse mb-5'}>



{message.text && (
          <div className={message.sender == id ? 'bg-thapa-400 font-bold font-sans min-w-150 max-w-md break-words rounded-md border border-hapu-600 p-6' : 'bg-white font-serif font-bold min-w-150 max-w-md break-words rounded-md p-6 border border-hapu-600'}>
           <div className='text-sm text-gray-500 font-semibold'>
           {message.name && <div>{"~"+message.name}</div>}

           </div>
           <div>
           {message.text}
           </div>

          </div>
        )}


</div>
)
)}
  </div>
)}
        </div>















//

      {selectedUser && <div className='Search flex gap-1'>

            <input type="text" value={message} onChange={handleInputChange}  placeholder='send msg' className='grow border rounded-sm p-2' name="" id=""  />
            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
              </svg>
            </label>
            <button onClick={sendMessage} className="bg-blue-500 p-2 text-white rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>

        </div>

        }

{selectedGroup && <div className='Search  group flex gap-1'>

<input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}  placeholder='send msg' className='grow border rounded-sm p-2' name="" id=""  />
<label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
  <input type="file" className="hidden" onChange={sendFile} />
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
  </svg>
</label>
<button onClick={sendGroup} className="bg-blue-500 p-2 text-white rounded-sm">
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
