import Cartel from "../components/Cartel";
import { Link } from "react-router-dom";

export default function Home() {
        const frontImage = 'src/assets/carteles/Cartel_Evento_01.jpg';
        const backImage = 'src/assets/folletos/Folleto_Evento_01.jpg';
  return (
    <>
       <div className="flex flex-col">
        <Cartel cartelBack={backImage} cartelFront={frontImage} />
        <Link to="/events" className="mx-auto border-2 border-black px-10 py-3 bg-[#d93823] hover:bg-[#b32d1c] transition-colors duration-200 text-white shadow shadow-gray-400">
          EVENTS
        </Link>
      </div>

      <div className="flex flex-col justify-center text-center border-2 mx-auto aspect-square border-black w-1/3 mt-2 items-center shadow shadow-gray-400">
        <h1 className="text-2xl font-bold bg-clip-text bg-gradient-to-b from-red-600 to-blue-500 text-transparent">
          Who are we?
        </h1>
        <h2 className="w-3/4 opacity-50">
          We are Playground, a rave project born in Galicia. Inspired by early 2000s underground
          culture and childhood fun, we organize secret parties with well known electronic artists.
          Each event is a safe and inclusive space where everyone is welcome, especially the LGBTQ
          community. This is not just a party. It is a place to be free.
        </h2>
      </div>

      <footer className="sticky top-full bottom-0 pt-2 z-50">
        <img className="sticky" src="src/assets/logos/personajes.png" alt="Party animals" />
      </footer>
    </>
  )
}
