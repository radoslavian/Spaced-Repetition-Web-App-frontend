import './App.css';
import { useState } from "react";
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { CardsProvider } from "./contexts/CardsProvider";
import { useUser } from "./contexts/UserProvider";
import MainGrid from "./components/MainGrid";
import LoginForm from "./components/LoginForm";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const { user, logIn, authMessages } = useUser();

    const authenticate = async credentials => {
        setIsLoading(true);
        await logIn(credentials);
        setIsLoading(false);
    };

    return (
        Boolean(user)  ?
            <div className="App">
                <CategoriesProvider>
                  <CardsProvider>
                    <MainGrid/>
                  </CardsProvider>
                </CategoriesProvider>
            </div>
            :
            <LoginForm setCredentials={authenticate}
                       authMessages={authMessages}
                       loading={isLoading}/>
    );
}

export default App;
