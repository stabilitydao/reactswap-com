import { useState, useEffect } from 'react';

function Navbar() {
    const [Navbar, setNavbar] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    return (
        <nav
            className={` text-white sticky   top-0 border-b duration-300 border-gray-800 ${
                Navbar ? 'bg-darkblue shadow-xl' : ''
            }`}
        >
            <div className="flex items-center h-24 container mx-auto px-2 justify-between">
                <div className="flex items-center ">
                    <img src="/reacttoken.svg" className="h-12 w-12" alt="" />{' '}
                    <h1 className=" ml-3 self-center font-bold text-2xl ">
                        ReactSwap
                    </h1>
                </div>
                <button className="btn">Coming Soon</button>
            </div>
        </nav>
    );
}

export default Navbar;
