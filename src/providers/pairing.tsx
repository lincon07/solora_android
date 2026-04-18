import { fetchHubMe } from "@/api/hub";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface PairSessionRequest {
    id: string;
    hubId: string;
    createdAt: string;
    expiresAt: string;
}

export interface PairingContextType {
    createPairSession?: () => Promise<void>;
}


export const PairingContext = React.createContext<PairingContextType>({});


export const PairingProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const nav = useNavigate()

    const handleCheckPairing = async () => {
        console.log("Checking pairing status...");
        const status = await fetchHubMe()
        console.log("Pairing status:", status)

        if (status == null) {
           nav("/onboard-wizzard")
        } else {
            nav("/")
        }
    }

    React.useEffect(() => {
        handleCheckPairing()
    }, [])

    return (
        <PairingContext.Provider value={{}}>
            {children}
        </PairingContext.Provider>
    );
}