import { BASE_API_URL } from "../utils/APIClient";
import { useRef } from "react";

export default function PlayAudio({ url }) {
    const audioRef = useRef("audio_tag");
    const audioUrl = BASE_API_URL + url;

    return (<audio data-testid={`basic-audio-player-component-${url}`}
                   style={{ height: "30px" }}
                   ref={audioRef}
                   src={audioUrl}
                   controls autoPlay/>);
}
