import React from "react";
import { Route, Routes } from "react-router-dom";
import { createReactOidc } from "oidc-spa/react";
import { z } from "zod";
import {ListProjectAdmin} from "./List-Project-admin";
import Toolpage from "./EZtool/PageTools";
export const { OidcProvider, useOidc } = createReactOidc({
  issuerUri: process.env.REACT_APP_KEYCLOAK_URL + "/realms/hortesie",
  clientId: "hortesie-client",
  decodedIdTokenSchema: z.object({
    sub: z.string(),
    preferred_username: z.string(),
    resource_access: z.any(),
    client: z.any(),
  }),
});

export const ProtectedPage = (props) => {
  const { login, isUserLoggedIn, oidcTokens } = useOidc();
  console.log(isUserLoggedIn);
  if (!isUserLoggedIn) {
    login({ doesCurrentHrefRequiresAuth: true });
  } else if (
    oidcTokens.decodedIdToken.client.roles.includes(`admin-hortesie`) ||
    oidcTokens?.decodedIdToken.client.roles.includes(`admin-hortesie`)
  ) {
    return <>{props.children}</>;
  }
  return <></>;
};
const AdminRouter = (children) => {
  return (
    <>
      <OidcProvider>
        <Routes>
          <Route
            path="projets"
            exact
            element={
              <ProtectedPage>
                {" "}
                …<ListProjectAdmin />
              </ProtectedPage>
            }
          ></Route>
          <Route
            path="tools"
            exact
            element={
              <ProtectedPage>
                …<Toolpage></Toolpage>
              </ProtectedPage>
            }
          ></Route>
        </Routes>
      </OidcProvider>
    </>
  );
};

export default AdminRouter;
