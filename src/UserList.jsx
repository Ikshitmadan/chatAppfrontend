import { Box, Center, HStack, List, ListIcon, ListItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { CloseIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react'
export const UserList = (props) => {

    const [users,setUsers]=useState([]);
    const toast = useToast()

// console.log(selectedGroup);

const selectedGroup=props.selectedGroup
console.log(selectedGroup);
const {toggle}=props;
console.log(toggle);

   const handleDelete= async(uid)=>{

    setUsers(users.filter((user)=>user._id!=uid))

const {data}=await axios.delete(`/group/${selectedGroup}/${uid}`);
    // axios

    toast({
        title: 'User deleted ',
        description: `deleted user ${uid}`,
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',

      })

    console.log(data);
   }


    const showUsers=async()=>{


        try{
      
          const {data}=await axios.get(`/group/users/${selectedGroup}`);
          console.log(data);

          setUsers(data);
        }
      
        catch(err){
          console.log(err)
        }
       
      
      }









useEffect(() => {
 console.log(`Group`);

  return () => {
    console.log(`unmount`);
  }
}, [])


useEffect(()=>{

    console.log(`toogled`);

},[toggle])

      useEffect(()=>{
console.log('first time');
      },[])

      useEffect(() => {

        
            console.log(selectedGroup);
            showUsers()
        
        

      
       
      }, [selectedGroup])
      
     

  return (
    <List  borderRadius="30px" color="white" pos="absolute" top="45px" right="1px" spacing={3} backgroundColor="white">

        { toggle && users.map((u)=>(

<ListItem color='white' p="2" cursor="pointer" backgroundColor="orange.600">

<HStack>

<Box>
{u.username}
</Box>

<CloseIcon  onClick={()=>handleDelete(u._id)} bgSize={2}/>

</HStack>

   

  

   
  

</ListItem>

        ))

        }
  
  </List>
  )
}
