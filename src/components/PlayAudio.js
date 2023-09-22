import { BASE_API_URL } from "../utils/APIClient";
import { useRef } from "react";

export default function PlayAudio({ url }) {
    const audioRef = useRef("audio_tag");
    const audioUrl = BASE_API_URL + url;

    return (<audio style={{ minWidth: "10%",
                            maxWidth: "20%",
                            height: "30px" }}
                   ref={audioRef}
                   src={audioUrl}
                   controls autoPlay/>);
}
