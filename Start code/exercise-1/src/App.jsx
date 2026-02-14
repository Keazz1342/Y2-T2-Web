import React from "react";

export const userData = {
  firstName: "Nam", // feel free to replace the name value
  lastName: "Kea", // feel free to replace the name value
  title: "The best of group 7", // feel free to replace the title value
};

// Edit the User component code to output the userData data
export function User() {
  return (
    <div id="user" data-testid="user">
      {/* // TODO: FIRST NAME LAST NAME user */}
      <h2>
        {userData.firstName} {userData.lastName}
      </h2>
        {/* TODO: TITLE */}
      <p>
        {userData.title}
      </p>
    </div>
  );
}

// DON'T edit the App component code
function App() {
  return (
    <div id="app">
      <h1>WELCOME !!</h1>
      <p>PNV students are you ready to React Course ? You got this 💪</p>
      <User />
    </div>
  );
}

export default App;
