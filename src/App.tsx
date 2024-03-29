import Clock from "./components/clock/main";
import Stack from "./components/stack/back-stack";

export default function App() {
  return (
    <main>
      <Stack />
      <Clock />
      <Stack />
    </main>
  );
}
