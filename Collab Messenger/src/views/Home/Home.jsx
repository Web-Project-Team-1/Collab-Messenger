import { useNavigate } from "react-router-dom";
import { Box, Heading, Button, VStack, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Home.css";
import { useRef } from "react";

export default function Home() {
    const navigate = useNavigate();
    const swiperRef = useRef(null);

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
            <Heading as="h1" mb={4} fontSize="4xl">
                Welcome to Connecto!
            </Heading>
            <Heading as="h2" fontSize="2xl" mb={8}>
                Your journey to connect starts here.
            </Heading>
            <VStack spacing={4}>
                <Button
                    colorScheme="blue"
                    width="200px"
                    size="lg"
                    onClick={() => navigate("/login")}  // Redirect to login instead of signup
                >
                    Signup
                </Button>
            </VStack>

            {/* Carousel section */}
            <Box className="swiper-container" mt={12}>
                {/* Left Button */}
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
                            <Text mt={2}>Make high-quality voice and video calls to your friends and colleagues, anytime, anywhere.</Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-2">
                            <Heading fontSize="lg">Private Messaging</Heading>
                            <Text mt={2}>Engage in secure one-on-one and group chats with your connections, ensuring privacy and peace of mind.</Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-3">
                            <Heading fontSize="lg">Team Collaboration</Heading>
                            <Text mt={2}>Create and manage teams, streamline communication, and stay organized with collaborative project tools.</Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-4">
                            <Heading fontSize="lg">Real-Time Notifications</Heading>
                            <Text mt={2}>Receive instant alerts for important messages, team updates, and events, keeping you always in the loop.</Text>
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box className="swiper-slide-content feature-5">
                            <Heading fontSize="lg">OpenAI Integrated</Heading>
                            <Text mt={2}>Chat with OpenAI directly in our app for your facilitation.</Text>
                        </Box>
                    </SwiperSlide>
                </Swiper>

                {/* Right Button */}
                <button
                    className="swiper-button next-button"
                    onClick={() => swiperRef.current?.slideNext()}
                >
                    &gt;
                </button>
            </Box>
        </Box>
    );
}
