import React, { useContext, useRef, useState, useEffect } from "react";
import { Box, Button, Text, VStack, Input, Image, HStack } from "@chakra-ui/react";
import { AppContext } from "../../store/app.context";
import { uploadProfilePicture, getUserData } from "../../services/users.service";
import { update } from "firebase/database";
import defaultProfilePicture from "../../resources/defaultProfilePicture.png";
import { db } from "../../config/firebase.config";
import { ref } from "firebase/database";
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase.config';
import "./profile.css";
import { useNavigate } from "react-router";

export default function Profile() {
    const { user, userData, setAppState } = useContext(AppContext);
    const fileInputRef = useRef(null);
    const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [isEditingField, setIsEditingField] = useState({
        firstName: false,
        lastName: false,
        telephone: false,
    });

    useEffect(() => {
        if (userData) {
            setProfilePicture(userData.photoURL || defaultProfilePicture);
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setTelephone(userData.telephone || "");
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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSaveField = async (field) => {
        try {
            const updatedData = {
                [field]: field === "firstName" ? firstName :
                    field === "lastName" ? lastName : telephone,
            };

            const userRef = ref(db, `users/${userData.username}`);
            await update(userRef, updatedData);

            const updatedUserData = await getUserData(user.uid);
            setAppState((prev) => ({ ...prev, userData: updatedUserData }));

            setIsEditingField((prev) => ({ ...prev, [field]: false }));
        } catch (error) {
            console.error("Error updating profile field:", error);
        }
    };

    return (
        <Box p={5} bg="gray.700" color="white" borderRadius="md" maxW="400px" m="auto" textAlign="center" mt={180}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>User Profile</Text>
            <div className="profile-picture-container">
                <Image
                    className="profile-picture"
                    boxSize="100px"
                    borderRadius="full"
                    src={profilePicture}
                    alt="Profile"
                    onClick={() => fileInputRef.current.click()}
                    cursor="pointer"
                />
                <span className="hover-text">Change Profile Picture</span>
                <span className="plus-sign">+</span>
            </div>
            <Input
                type="file"
                ref={fileInputRef}
                display="none"
                onChange={handleProfilePictureChange}
            />
            <VStack spacing={4} align="start">
                <Text>Username:</Text>
                <Text bg="gray.600" p={2} borderRadius="md" width="100%">{userData?.username}</Text>
                <Text>Email:</Text>
                <Text bg="gray.600" p={2} borderRadius="md" width="100%">{userData?.email}</Text>

                {/* First Name */}
                <Text>First Name:</Text>
                {isEditingField.firstName ? (
                    <HStack>
                        <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Button size="sm" colorScheme="blue" onClick={() => handleSaveField("firstName")}>
                            Save
                        </Button>
                    </HStack>
                ) : (
                    <HStack justify="space-between" width="100%">
                        <Text bg="gray.600" p={2} borderRadius="md" width="70%">{firstName || "Not set"}</Text>
                        <Button size="sm" onClick={() => setIsEditingField((prev) => ({ ...prev, firstName: true }))}>
                            Edit
                        </Button>
                    </HStack>
                )}

                {/* Last Name */}
                <Text>Last Name:</Text>
                {isEditingField.lastName ? (
                    <HStack>
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <Button size="sm" colorScheme="blue" onClick={() => handleSaveField("lastName")}>
                            Save
                        </Button>
                    </HStack>
                ) : (
                    <HStack justify="space-between" width="100%">
                        <Text bg="gray.600" p={2} borderRadius="md" width="70%">{lastName || "Not set"}</Text>
                        <Button size="sm" onClick={() => setIsEditingField((prev) => ({ ...prev, lastName: true }))}>
                            Edit
                        </Button>
                    </HStack>
                )}

                {/* Telephone */}
                <Text>Telephone:</Text>
                {isEditingField.telephone ? (
                    <HStack>
                        <Input
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                        <Button size="sm" colorScheme="blue" onClick={() => handleSaveField("telephone")}>
                            Save
                        </Button>
                    </HStack>
                ) : (
                    <HStack justify="space-between" width="100%">
                        <Text bg="gray.600" p={2} borderRadius="md" width="70%">{telephone || "Not set"}</Text>
                        <Button size="sm" onClick={() => setIsEditingField((prev) => ({ ...prev, telephone: true }))}>
                            Edit
                        </Button>
                    </HStack>
                )}
                {isLoggedIn && (
                    <HStack justify="space-between" width="100%">
                        <Button className="logout-btn" onClick={handleLogout} colorScheme="red" bg="red.600" color={"white"} borderRadius={30} w={"200px"} mx={"80px"} mt={3}>
                            Logout
                        </Button>
                    </HStack>
                )}
            </VStack>
        </Box>
    );
}
