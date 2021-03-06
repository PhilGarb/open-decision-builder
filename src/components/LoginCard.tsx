import React from "react";
import { Button, Field, Logo } from "components";
import * as Tabs from "@radix-ui/react-tabs";
import { styled } from "utils/stitches.config";
import { useLogin_UserMutation, useRegister_UserMutation } from "internalTypes";
import { useQueryClient } from "react-query";
import { authService } from "features";
import { useService } from "@xstate/react";

const TabList = styled(Tabs.List, {
  display: "flex",
  justifyContent: "space-around",
});

const Tab = styled(Tabs.Tab, {
  flexGrow: 1,
  flexBasis: "0",
  padding: "$4",
  display: "flex",
  justifyContent: "center",

  "&:hover, &:focus": {
    backgroundColor: "$primary200",
  },

  '&[data-state="active"]': {
    boxShadow: "inset 0 -2px 0 0 $colors$primary500",
    backgroundColor: "$primary50",
  },
});

export const LoginCard: React.FunctionComponent = () => {
  return (
    <div className="w-full max-w-xs">
      <div className="bg-white shadow-xl rounded-lg mb-4 flex flex-col overflow-hidden">
        <div className="flex justify-center items-center p-8 bg-gradient-to-r from-gray-100 to-gray-300">
          <Logo />
        </div>
        <Tabs.Root defaultValue="login">
          <TabList>
            <Tab value="login">Einloggen</Tab>
            <Tab value="register">Registrieren</Tab>
          </TabList>
          <Tabs.Panel value="login">
            <LoginForm />
          </Tabs.Panel>
          <Tabs.Panel value="register">
            <SignupForm />
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
};

const LoginForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [state, send] = useService(authService);
  const queryClient = useQueryClient();
  const loginMutation = useLogin_UserMutation(state.context.client, {
    onError: () => send("Logout"),
    onSuccess: () => {
      send("Login");
      queryClient.invalidateQueries("USER");
    },
  });

  return (
    <form className="flex flex-col">
      <div className="p-6 space-y-4">
        <Field
          name="email"
          label="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="username"
        />
        <Field
          name="password"
          label="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          autoComplete="current-password"
        />
        <div className="flex justify-center">
          <a
            className="block font-bold text-sm text-blue-500 hover:text-blue-800"
            href="/reset-password"
          >
            Passwort vergessen?
          </a>
        </div>
      </div>
      <Button
        rounded="none"
        className="h-20"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          loginMutation.mutate({ email, password });
        }}
      >
        Log-In
      </Button>
    </form>
  );
};

const SignupForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const queryClient = useQueryClient();
  const [state] = useService(authService);
  const registerMutation = useRegister_UserMutation(state.context.client, {
    onSuccess: () => {
      queryClient.invalidateQueries("USER");
    },
  });

  return (
    <form className="flex flex-col">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <Field
            name="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <Field
            name="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
          />
          <Field
            name="password"
            label="Passwort"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            type="password"
            required
            autoComplete="new-password"
          />
          <Field
            name="password"
            label="Passwort wiederholen"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          Indem Sie auf registrieren klicken akzeptieren Sie unsere{" "}
          <a
            className="font-bold text-sm text-blue-500 hover:text-blue-800"
            href="/agb"
          >
            AGB
          </a>
          .
        </div>
      </div>
      <Button
        className="h-20"
        rounded="none"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          registerMutation.mutate({
            email,
            password1,
            password2,
            username: name,
          });
        }}
      >
        Registrieren
      </Button>
    </form>
  );
};
