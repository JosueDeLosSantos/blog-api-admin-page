function ServerError() {
  return (
    <>
      <div>
        <div className="pt-[25vh] text-center">
          <h1 className="xl:text-6xl text-3xl font-medium sm:text-5xl">
            Server Error
          </h1>
          <p className="m-6 text-lg font-medium sm:text-2xl xl:text-3xl dark:text-slate-50">
            Sorry, we are having issues with our server.
          </p>

          <div>
            <button className="rounded bg-purple-500 p-2 text-white no-underline hover:bg-purple-600 md:text-lg dark:bg-slate-800 dark:hover:bg-slate-700">
              <a href="https://github.com/JosueDeLosSantos">
                Contact administrator
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServerError;
