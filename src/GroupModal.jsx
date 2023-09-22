import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Center,
    FormControl,
    Input,
    useToast,
    Box,
    Toast,
    Alert,
  } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import UserListItem from './UserListItem';
import UserBadgeItem from './UserbadgeItem';
  

  export default function GroupModal({sendjoin}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [GroupName,setGroupChatName]=useState();
const [searchedUser,setsearchedUser] = useState([]);

const [selectedUsers,setSelectedUsers] = useState([]);
    const searchUser=async(event)=>{
             

      const {data}=await axios.get(`/users?search=${event.target.value}`);

      console.log(data);
           
setsearchedUser(data);
    }

    const toast = useToast()


    function handleAdd(uid){
console.log(uid);             
       

for(let i=0;i<selectedUsers.length;i++){

  if(selectedUsers[i]._id==uid._id){
    return;
  }

}
console.log(uid);
     
setSelectedUsers(prev=>[...prev,uid])

    }


   function deleteAdd(uid) {

    console.log(uid);
    if(selectedUsers.includes(uid)){

        console.log('hi');
      
      
      setSelectedUsers(selectedUsers.filter((id)=>id!=uid))
    }
    
   }


   async function handleSubmit (){


    if(!GroupName || !selectedUsers){
      return Alert("group name or members not selected");
    }

    try{

      const name=GroupName;

      const members= JSON.stringify(selectedUsers);

      console.log(sendjoin);
  
  const {data}=await axios.post('/group/create',{
    name,
    members
  });
  onClose();

      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });


      console.log(`hi`);
      sendjoin(data);

  console.log(data);


    }

    catch(err){

console.log(err);

    }
   


   }

   console.log(sendjoin);

    console.log(selectedUsers);
    return (
      <>
        <Button onClick={onOpen}>+ create group</Button>
        <Modal    isOpen={isOpen} onClose={onClose}>
          <ModalOverlay  
      backdropFilter='blur(10px) hue-rotate(90deg)'  />

           <Center>
          <ModalContent   margin="auto"  display="flex" justifyContent="center" maxW="80%" bg='white'>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
           margin="auto"
          >
            Create Group Chat



            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>

           
              <Input
                placeholder="Chat Name"
                mb={5}
                mt={3}
               width="100%"

               onChange={(e)=>setGroupChatName(e.target.value)}
              //  backgroundColor="gold"
               // onChange={(e) => setGroupChatName(e.target.value)}
              />
            
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                 deleteUser={deleteAdd}
                />
              ))}
            </Box>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
               
                onChange={searchUser}
                mb={1}
// backgroundColor="gold"
               width="100%"
                // onChange={(e) => handleSearch(e.target.value)}
              />


               { searchedUser.length>0 && searchedUser?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}


                    add={handleAdd}
                  />
                ))}
                
            </ModalBody>
  
            <ModalFooter display="flex" flexDir="column" alignItems="center"> 
             
              <Button  onClick={handleSubmit}  p="5" color="white"  mt="20px"  width="100px" borderRadius="5%" variant='ghost' backgroundColor="green">Submit </Button>
            </ModalFooter>
          </ModalContent>
          </Center>
        </Modal>
       
      </>
    )
  }