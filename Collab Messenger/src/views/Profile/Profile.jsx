import { Box, Button, Text, VStack, Input, Image } from "@chakra-ui/react";
import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../../store/app.context";
import { uploadProfilePicture, getUserData } from "../../services/users.service";
import { update } from "firebase/database";
import defaultProfilePicture from "../../resources/defaultProfilePicture.png";
import { db } from "../../config/firebase.config";
import { ref } from "firebase/database";

export default function Profile() {
    const { user, userData } = useContext(AppContext);
    const fileInputRef = useRef(null);
    const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
    const [editedUsername, setEditedUsername] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    console.log(user);
    
    useEffect(() => {
        if (userData) {
            setProfilePicture(userData.photoURL || defaultProfilePicture);
            setEditedUsername(userData.username);
            setEditedEmail(userData.email);
        }
    }, [userData]);

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const newPictureUrl = await uploadProfilePicture(file, user?.uid, userData.username);
                setProfilePicture(newPictureUrl);
               
            } catch (error) {
                console.error("Error uploading profile picture:", error);  
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            const userRef = ref(db, `users/${userData.username}`);
            await update(userRef, {
                username: editedUsername,
                email: editedEmail,
            });

            const updatedUserData = await getUserData(user.uid);

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Box p={5} bg="gray.700" color="white" borderRadius="md" maxW="400px" m="auto" mt="50px">
            <VStack spacing={4} align="start">
                <Text fontSize="2xl" fontWeight="bold">User Profile</Text>
                <Image
                    boxSize="100px"
                    borderRadius="full"
                    src={profilePicture}
                    alt="Profile"
                    onClick={() => fileInputRef.current.click()}
                    cursor="pointer"
                />
                <Input
                    type="file"
                    ref={fileInputRef}
                    display="none"
                    onChange={handleProfilePictureChange}
                />
                <Text>Username:</Text>
                <Input
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                />
                <Text>Email:</Text>
                <Input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleSaveChanges}>Save Changes</Button>
            </VStack>
        </Box>
    );
}
