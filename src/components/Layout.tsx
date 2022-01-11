import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <main className="">
                <Head>
                    <title>ReactSwap</title>
                    <meta
                        name="description"
                        content="ReactSwap decentralized exchange"
                    />
                </Head>
                <div className=" font-Roboto bg-darkblue text-white">
                    {children}
                </div>
            </main>
        </ThemeProvider>
    );
}

export default Layout;
