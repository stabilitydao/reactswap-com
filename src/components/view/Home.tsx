function Home() {
  return (
    <div
      className=" w-screen flex flex-col justify-center items-center text-center"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div>
        <img src="/reactswap.png" alt="ReactSwap"/>
        <div className="flex text-3xl flex-col m-10 text-left font-bold">
          <div>Decentralized Exchange</div>
          <div>Yield farms</div>
          <div>Lending markets</div>
          <div>Staking</div>
        </div>
      </div>
    </div>
  )
}

export default Home
