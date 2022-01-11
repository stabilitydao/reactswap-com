import React from 'react';
import { SiCodechef } from 'react-icons/si';
function Hero() {
    return (
        <section className=" text-white">
            <div className="container mx-auto px-2 py-10 ">
                <div className="space-y-10">
                    <span className="bg-blue-800 rounded-full px-4 py-2 inline-flex items-center  gap-x-2">
                        <SiCodechef className="  inline" />
                        Be a DeFi Chef with ReactSwap!
                    </span>
                    <div className="space-y-5">
                        <h1 className="text-5xl font-semibold ">
                            Decentralized Exchange <br /> ON Polygon
                        </h1>
                        <p>
                            Swap, earn, stack yields, lend, borrow, leverage all
                            <br />
                            on one decentralized, community driven platform.
                            <br />
                            Welcome home to DeFi.
                        </p>
                    </div>
                    <div className="flex flex-row gap-x-5">
                        <button className="btn">JOIN PRE-SALE</button>
                        <button className="btn">COMING SOON</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
