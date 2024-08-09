function About() {
  // const { windowWidth } = useWindowSize();

  // MARK: return
  return (
    <div className="min-h-screen bg-slate-100 lg:w-[94.5%] dark:bg-slate-950">
      <div className="flex gap-4 px-4 pb-4 max-lg:pt-20 lg:pt-4">
        <article className="w-full rounded-lg border border-solid border-slate-200 bg-white p-8 dark:border-slate-950 dark:bg-slate-800">
          <div className="mx-auto h-[160px] w-[160px] max-md:size-[80px]">
            <img
              className="h-full w-full rounded-full object-cover ring-1 ring-blue-400  dark:ring-blue-500"
              src="../public/images/josuedelossantos.jpg"
            />
          </div>

          <div className="prose mx-auto max-w-screen-md p-4 sm:mt-4 md:mt-8 dark:text-white">
            <h2 className="except mb-6 text-lg font-black tracking-wide text-blue-600 sm:text-xl lg:text-2xl dark:text-blue-100">
              About me
            </h2>
            <p>
              Hi, my name is Josue De Los Santos and this is my personal blog.
              I’m a passionate full stack web developer with a love for building
              web applications and exploring new technologies.
            </p>
            <p>
              With a bachelor's degree in computer science from{" "}
              <a
                className="except text-blue-500 dark:text-blue-100"
                target="_blank"
                href="https://unicaribe.edu.do/"
              >
                Universidad Del Caribe
              </a>{" "}
              and around two years of experience learning through The{" "}
              <a
                className="except text-blue-500 dark:text-blue-100"
                target="_blank"
                href="https://www.theodinproject.com"
              >
                Odin Project
              </a>
              , I’ve developed various projects that showcase my skills and
              dedication to web development. 💻
            </p>

            <p>
              This blog is my first full stack application, serving as both a
              showcase of my web development skills and a platform to share my
              journey. 🚀 Here, you’ll find posts about the latest in web
              development technologies, tips and tricks for building robust
              applications, and encouragement for fellow developers to continue
              their journey in the ever-evolving world of web development.
            </p>

            <p>
              Whether you’re a seasoned developer or just starting out, I hope
              my experiences and insights inspire you to keep learning and
              growing. Let’s build something amazing together! 😊
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default About;
