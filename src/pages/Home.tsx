
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

                    {/* Game Launch Button */}
                    <div className="px-4 pb-4">
                        <Link to="/game">
                            <button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-6 rounded-xl font-bold text-xl shadow-lg hover:shadow-cyan-500/50 transition-all">
                                🎮 Play Cyberpunk Shooter
                            </button>
                        </Link>
                    </div>

                </div>


            </div>

            <Footer />
        </>
    );

}