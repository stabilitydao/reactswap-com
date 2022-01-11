import React from 'react';
import { BsTwitter, BsTelegram, BsFacebook } from 'react-icons/bs';
function Footer() {
    return (
        <footer className="px-4 divide-y   bg-slate-900 bg-opacity-80">
            <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
                <div className="lg:w-1/3">
                    <a
                        href="#"
                        className="flex justify-center space-x-3 lg:justify-start"
                    >
                        <img
                            src="/reacttoken.svg"
                            alt=""
                            width={50}
                            height={50}
                        />
                        <span className="self-center text-2xl font-semibold">
                            ReactSwap
                        </span>
                    </a>
                </div>
                <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
                    <div className="space-y-3">
                        <h3 className="tracking-wide uppercase ">Product</h3>
                        <ul className="space-y-1">
                            <li>
                                <a href="#">Features</a>
                            </li>
                            <li>
                                <a href="#">Integrations</a>
                            </li>
                            <li>
                                <a href="#">Pricing</a>
                            </li>
                            <li>
                                <a href="#">FAQ</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="tracking-wide uppercase ">Company</h3>
                        <ul className="space-y-1">
                            <li>
                                <a href="#">Privacy</a>
                            </li>
                            <li>
                                <a href="#">Terms of Service</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="uppercase ">Developers</h3>
                        <ul className="space-y-1">
                            <li>
                                <a href="#">Public API</a>
                            </li>
                            <li>
                                <a href="#">Documentation</a>
                            </li>
                            <li>
                                <a href="#">Guides</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <div className="uppercase ">Social media</div>
                        <div className="flex justify-start space-x-3">
                            <a
                                href="#"
                                title="Facebook"
                                className="flex items-center p-1"
                            >
                                <BsFacebook className="text-2xl" />
                            </a>
                            <a
                                href="#"
                                title="Twitter"
                                className="flex items-center p-1"
                            >
                                <BsTwitter className="text-2xl" />
                            </a>
                            <a
                                href="#"
                                title="Telegram"
                                className="flex items-center p-1"
                            >
                                <BsTelegram className="text-2xl" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-6 text-sm text-center ">
                © 1968 Company Co. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
