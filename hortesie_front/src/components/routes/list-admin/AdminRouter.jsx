import React from "react";
import { Route, Routes } from "react-router-dom";
import { createReactOidc } from "oidc-spa/react";
import { z } from "zod";
import {ListProjectAdmin} from "./List-Project-admin";
import {ListProjectAdminRedesigned} from "./List-Project-admin-redesigned";
import {ProjectDetailPage} from "./ProjectDetailPage";
import {ProjectDetailPageRedesigned} from "./ProjectDetailPageRedesigned";
import {New_Project} from "./New-project";
import Toolpage from "./EZtool/PageTools";
import CCTPPageRedesigned from "./EZtool/CCTPPageRedesigned";
import AdminAccueil from "./AdminAccueil";
import {ProjectPositionManager} from "./ProjectPositionManager";
import { AUTH_ISSUER } from "../../url";

export const { OidcProvider, useOidc } = createReactOidc({
  issuerUri: AUTH_ISSUER,
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
        <ProtectedPage>
        <Routes>
            <Route path="/" exact element={<ProtectedPage><AdminAccueil/></ProtectedPage>} />
          <Route
            path="projets/*"
            exact
            element={
              <ProtectedPage>
                <ListProjectAdminRedesigned />
              </ProtectedPage>
            }
          />
          <Route
            path="projets/:id/edit"
            element={
              <ProtectedPage>
                <ProjectDetailPageRedesigned />
              </ProtectedPage>
            }
          />
          <Route
            path="projets/new"
            element={
              <ProtectedPage>
                <New_Project />
              </ProtectedPage>
            }
          />
          <Route
            path="projets/positions"
            element={
              <ProtectedPage>
                <ProjectPositionManager />
              </ProtectedPage>
            }
          />
          <Route
            path="tools"
            exact
            element={
              <ProtectedPage>
                <CCTPPageRedesigned />
		    </ProtectedPage>
            }
          />
        </Routes>
        </ProtectedPage>
      </OidcProvider>
    </>
  );
};

export default AdminRouter;
