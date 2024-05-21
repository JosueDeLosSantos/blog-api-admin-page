function ServerError() {
  return (
    <>
      <div>
        <div className="mt-[25vh] text-center">
          <h1 className="text-3xl font-medium sm:text-5xl">Server Error</h1>
          <p className="m-6 text-xl font-medium sm:text-3xl">
            Sorry, we are having issues with our server.
          </p>

          <a
            href="https://github.com/JosueDeLosSantos"
            className="rounded bg-slate-800 px-4 py-2 text-white no-underline hover:bg-slate-700 sm:text-2xl"
          >
            Contact administrator
          </a>
        </div>
      </div>
    </>
  );
}

export default ServerError;
