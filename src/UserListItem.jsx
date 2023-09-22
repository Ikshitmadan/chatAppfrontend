import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { Wrap,WrapItem } from "@chakra-ui/react";
const UserListItem = ({ user,add }) => {
  console.log(user);
console.log(add);
  return (
    <Box
      
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
    
      display="flex"
      alignItems="center"
      color="black"
      gap="10px"
      px={3}
      py={2}
      mb={5}
      onClick={()=>add(user)}
    >


    <Wrap>
  <WrapItem>
  <Avatar
     
        // size="sm"
        cursor="pointer"
       
       
borderRadius="full"
      />  
      </WrapItem>

  </Wrap>
     
      <Box>
        <Text>{user.username}</Text>
      
      </Box>
    </Box>
  );
};

export default UserListItem;