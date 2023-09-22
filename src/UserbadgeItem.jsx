import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user,deleteUser}) => {

console.log('hi');
console.log(deleteUser);
console.log(user);
    // console.log(add,user);
  return (

    <>
    <Badge
      px={2}
      py={2}
      borderRadius="md"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
       colorScheme='purple'
      cursor="pointer"
      p={5}
    //   backgroundColor="purple"
    color="white"
    //   onClick={handleFunction}
    >
      {user.username}
      <CloseIcon  boxSize={4} p={1} onClick={()=>deleteUser(user)} />

    </Badge>


    </>
  );
};

export default UserBadgeItem;