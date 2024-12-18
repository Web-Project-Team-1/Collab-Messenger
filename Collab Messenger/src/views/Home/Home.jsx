import { useNavigate } from "react-router-dom";
import { Box, Heading, Button, VStack, Text, Image } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllUsers } from "../../services/users.service";
import "swiper/css";
import "./Home.css";
import { useEffect, useRef, useState } from "react";
import logo from "../../resources/logo.png";

export default function Home() {
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const [userCount, setUserCount] = useState(0); 

    useEffect(() => {
        const fetchUserCount = async () => {
            const count = await getAllUsers();
            setUserCount(count.length);
        };

        fetchUserCount();
    }, []);

    return (
        <Box
            className="home-page"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            color="white"
            textAlign="center"
            pt="20vh"
            minHeight="100vh"
        >
            <Heading as="h1" mb={4} fontSize="4xl" fontFamily={'Arizonia'}>
                Welcome to Connecto!
            </Heading>
            <Heading as="h2" fontSize="2xl" mb={8} fontFamily={'Arizonia'}>
                Your journey to connect starts here.
            </Heading>
            <VStack spacing={4}>
                <Button
                    className="sign-up-button-homepage"
                    colorScheme="blue"
                    width="200px"
                    size="lg"
                    onClick={() => navigate("/login")}
                >
                    Signup
                </Button>
            </VStack>

            <Box mt={8}>
                <Text className="allUsersText" >Users currently on the platform: {userCount}</Text>
            </Box>

            <Box className="swiper-container" mt={12}>
                <button
                    className="swiper-button prev-button"
                    onClick={() => swiperRef.current?.slidePrev()}
                >
                    &lt;
                </button>

                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={20}
                    slidesPerView={1}
                    loop={true}
                >
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-1">
                            <Heading fontSize="lg">Seamless Communication</Heading>
                            <Text mt={2}>
                                Make high-quality voice and video calls to your friends and colleagues, anytime, anywhere.
                            </Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-2">
                            <Heading fontSize="lg">Private Messaging</Heading>
                            <Text mt={2}>
                                Engage in secure one-on-one and group chats with your connections, ensuring privacy and peace of mind.
                            </Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-3">
                            <Heading fontSize="lg">Team Collaboration</Heading>
                            <Text mt={2}>
                                Create and manage teams, streamline communication, and stay organized with collaborative project tools.
                            </Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-4">
                            <Heading fontSize="lg">Real-Time Notifications</Heading>
                            <Text mt={2}>
                                Receive instant alerts for important messages, team updates, and events, keeping you always in the loop.
                            </Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-5">
                            <Heading fontSize="lg">OpenAI Integrated</Heading>
                            <Text mt={2}>Chat with OpenAI directly in our app for your facilitation.</Text>
                        </Box>
                    </SwiperSlide>
                </Swiper>

                <button
                    className="swiper-button next-button"
                    onClick={() => swiperRef.current?.slideNext()}
                >
                    &gt;
                </button>
            </Box>

            {/* Animated Line Section */}
            <div className="line-animation-wrapper">
                <div className="line-animation">
                    <div className="line-images flex">
                        <Image src={logo} alt="discord-mark" />
                        <div className="line_text-animation">Make video calls</div>
                        <Image src={logo} alt="discord-mark" />
                        <div className="line_text-animation">Chat with friends</div>
                        <Image src={logo} alt="discord-mark" />
                        <div className="line_text-animation">Make audio calls</div>
                        <Image src={logo} alt="discord-mark" />
                        <div className="line_text-animation">Communicate</div>
                        <Image src={logo} alt="discord-mark" />
                        <div className="line_text-animation">Use OpenAI</div>
                    </div>
                </div>
            </div>

        </Box>
    );
}
