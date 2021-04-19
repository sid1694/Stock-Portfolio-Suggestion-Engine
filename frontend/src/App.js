import React, { Component } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Container/Layout/Layout";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Layout></Layout>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
