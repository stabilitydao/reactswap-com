import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
function Home() {
    return (
        <>
            <header className="h-screen bg-darkblue">
                <Navbar />
                <Hero />
            </header>
            <section>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path
                        fill="#0F172A"
                        fillOpacity="0.7"
                        d="M0,256L120,234.7C240,213,480,171,720,176C960,181,1200,235,1320,261.3L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
                    ></path>
                </svg>
                <div className="bg-slate-900 opacity-70 container mx-auto">
                    <div className="space-y-10 py-10 text-center">
                        <h1 className="underline-offset-8 underline">ABOUT</h1>
                        <h2 className="text-5xl font-semibold">
                            Cryptoland Theme is the best <br /> for your ICO
                        </h2>
                        <p className="leading-7">
                            Kafue pike yellow weaver leatherjacket peacock
                            flounder yellowtail kingfish bluegill plunderfish
                            eelpout mustache triggerfish. Upside-down catfis
                            <br />
                            electric catfish prickleback tang sheepshead minnow
                            pygmy sunfish. Bonytail chub yellowtail kingfish
                            weeverfish, flat loach morid cod threespine <br />
                            stickleback. Alewife river shark plaice halfmoon,
                            Oriental loach velvetfish freshwater herring Asian
                            carps rough scad. Eel-goby lemon shark rivuline
                            <br />
                            Sacramento blackfish arrowtooth Red whalefish.
                        </p>
                        <div>
                            <h1 className="underline-offset-8 underline">
                                Developed By
                            </h1>
                            <div className="">
                                <img
                                    src="/stability.svg"
                                    alt=""
                                    className="w-1/3 mx-auto"
                                />
                                <h1 className="text-6xl">stability</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Home;
