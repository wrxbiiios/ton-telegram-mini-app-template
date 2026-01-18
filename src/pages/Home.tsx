
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
                    
                    {/* Game Link */}
                    <div className="px-4 mt-4">
                        <Link to="/game">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all">
                                <h3 className="text-2xl font-bold text-white mb-2">🎮 Play Cyberpunk Shooter</h3>
                                <p className="text-gray-200">Earn NFTs and climb the leaderboard!</p>
                            </div>
                        </Link>
                    </div>
                    
                    <SavingInfo />

                </div>


            </div>

            <Footer />
        </>
    );

}