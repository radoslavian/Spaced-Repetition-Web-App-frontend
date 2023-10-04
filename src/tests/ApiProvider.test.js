import { render, waitFor } from "@testing-library/react";
import { axiosMatch, downloadCards } from "axios";
import { ApiProvider, useApi } from "../contexts/ApiProvider";
import { memorizedCardsSecondPage, memorizedCard,
         queuedCardsMiddlePage,
         cramQueueSecondPage } from "../__mocks__/mockData";

describe("<ApiProvider/>", () => {
    function FakeComponent() {
        const api = useApi();
        const credentials = {user: "user_1",
                             password: "passwd"};
        api.authenticate("/auth/token/login/", credentials);
        return (<></>);
    }

    test("calling authentication route", () => {
        render(
            <ApiProvider>
              <FakeComponent/>
            </ApiProvider>
        );
        expect(axiosMatch.post).toHaveBeenCalledTimes(1);
        expect(axiosMatch.post).toHaveBeenCalledWith(
            expect.objectContaining(
                {"data":
                 {"password": "passwd", "user": "user_1"},
                 "method": "post",
                 "url": "http://localhost:8000/api/auth/token/login/"}));
    });
});
