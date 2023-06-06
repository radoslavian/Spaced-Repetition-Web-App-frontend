import { UserProvider } from "../contexts/UserProvider";
import { ApiProvider } from "../contexts/ApiProvider";
import { CategoriesProvider } from "../contexts/CategoriesProvider";
import { CardsProvider } from "../contexts/CardsProvider.js";

export function getComponentWithProviders(Component) {
    return () => (<ApiProvider>
                    <UserProvider>
                      <CategoriesProvider>
                        <CardsProvider>
                          <Component/>
                        </CardsProvider>
                      </CategoriesProvider>
                    </UserProvider>
                  </ApiProvider>
                 );
}
