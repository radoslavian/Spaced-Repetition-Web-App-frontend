import { render, screen } from "@testing-library/react";
import CardBody from "../components/CardBody";
/*
 * mocking hook from CardsProvider:
 * 1. Load hook as a module
 * 2. mock module
 * !! mock should be called on top of the file outside test function !!
 */
jest.mock("../contexts/CardsProvider", () => ({
    useCards: () => ({
        functions: {
            cram: jest.fn()
        },
        cram: {
            count: 0
        }
    })
}));


describe("<CardBody/>", () => {
    const frontAudioUrl = "/local/audio/front_audiofile.mp3";
    const backAudioUrl = "/local/audio/back_audiofile.mp3";
    const card = {
        front_audio: frontAudioUrl,
        back_audio: backAudioUrl,
        body: `<div class="card-body">
  <div class="card-question">
    Example <b>card</b> <i>question</i>.
  </div>
  <div class="card-answer">
    Example Card answer.
  </div>
</div>`
    };
    const frontAudioTestId = `basic-audio-player-component-${frontAudioUrl}`;
    const backAudioTestId = `basic-audio-player-component-${backAudioUrl}`;

    test("if question sound component appears on card appearance", () => {
        render(<CardBody card={card} showAnswer={false}/>);
        const audioPlayer = screen.getByTestId(frontAudioTestId);
        expect(audioPlayer).toBeInTheDocument();
    });

    test("if answer sound component doesn't appear", async () => {
        // ... when the answer is hidden
        render(<CardBody card={card} showAnswer={false}/>);
        await expect(async () => {
            await screen.findByTestId(backAudioTestId);
        }).rejects.toEqual(expect.anything());
    });

    test("if front audio doesn't appear/when no sound file", () => {
        // sound playback component for the front of the card should
        // not appear if front_audio field is empty
        const localCard = {...card, front_audio: null};
        render(<CardBody card={localCard} showAnswer={false}/>);
        const audioPlayer = screen.queryByTestId(frontAudioTestId);
        expect(audioPlayer).not.toBeInTheDocument();
    });

    test("if back audio doesn't appear/when no sound file", () => {
        // sound playback component for the back of the card should
        // not appear if back_audio field is empty
        const localCard = {...card, back_audio: null};
        render(<CardBody card={localCard} showAnswer={true}/>);
        const audioPlayer = screen.queryByTestId(backAudioTestId);
        expect(audioPlayer).not.toBeInTheDocument();
    });

    test("if answer sound component appears", () => {
        render(<CardBody card={card} showAnswer={true}/>);
        const audioPlayer = screen.getByTestId(backAudioTestId);
        expect(audioPlayer).toBeInTheDocument();
    });

    test("displaying answer", () => {
        render(<CardBody card={card} showAnswer={true}/>);
        const answer = screen.queryByText("Example Card answer.");
        expect(answer).toBeInTheDocument();
        expect(answer.className).toBe("card-answer");
    });

    test("answer is hidden", () => {
        render(<CardBody card={card} showAnswer={false}/>);
        const answer = screen.queryByText("Example Card answer.");
        expect(answer).not.toBeInTheDocument();
    });
});

