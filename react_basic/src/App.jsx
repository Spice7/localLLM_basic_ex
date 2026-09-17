// import { useStae } from 'react'
import Header from "./components/Header";
import Greeting from "./components/Greeting";
import Counter from "./components/Counter";
import InputState from "./components/InputState";
import ListRender from "./components/ListRender";
import ConditionalRender from "./components/ConditionalRender";
import UseEffectRender from "./components/UseEffectRender";
import OllamaChat from "./components/OllamaChat"

function App() {

  return (
    <div>
      <OllamaChat />
      <hr />
      <Header />
      <Greeting />
      <Counter />
      <InputState />
      <ListRender />
      <hr />
      <ConditionalRender />
      <UseEffectRender />

    </div>
  );
}

export default App
