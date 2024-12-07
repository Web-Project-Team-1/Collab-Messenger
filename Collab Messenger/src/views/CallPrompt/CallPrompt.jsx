import React from "react";
import { Button } from "@chakra-ui/react";
import { acceptCall } from "../../services/call.service";

const CallPrompt = ({ callerId, calleeId, onReject }) => {
    const handleAccept = async () => {
        await acceptCall(callerId, calleeId);
        onReject();
    };

    return (
        <div>
            <p>Incoming call from {callerId}</p>
            <Button onClick={handleAccept} colorScheme="green">
                Accept
            </Button>
            <Button onClick={onReject} colorScheme="red">
                Reject
            </Button>
        </div>
    );
};

export default CallPrompt;
