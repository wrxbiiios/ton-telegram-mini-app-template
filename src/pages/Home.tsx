
import { BasicInfo } from '../components/BasicInfo';
import { Footer } from '../components/Footer';
import { SavingInfo } from '../components/SavingInfo';
import { Link } from 'react-router-dom';

export function Home() {

    return (

        <>
            <div className="flex-grow bg-[#f7f8f8]  relative top-glow z-0">

                {/* <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-gradient-to-t from-cyan-500 to-blue-500"> */}
                <div className="absolute top-[2px] left-0 right-0 bottom-0 " >

                    <BasicInfo />
                    <SavingInfo />
                    
                    {/* Game Link */}
                    <div className="px-4 pt-4">
                        <Link 
                            to="/game"
                            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            🎮 Play Cyberpunk Shooter
                        </Link>
                    </div>

                </div>


            </div>

            <Footer />
        </>
    );

}