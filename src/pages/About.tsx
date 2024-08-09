import InstagramIcon from "/icons/social media icons/instagram-svgrepo-com.svg";
import LinkedInIcon from "/icons/social media icons/linkedin-rounded-border-svgrepo-com.svg";
import GithubIcon from "/icons/social media icons/github-142-svgrepo-com.svg";
import Xtwitter from "/icons/social media icons/xtwiiter.svg";

function About() {
  // const { windowWidth } = useWindowSize();

  // MARK: return
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="flex gap-4 pb-4 max-lg:pt-20 sm:px-10 lg:pt-4">
        <article className="w-full rounded-lg border border-solid border-slate-200 bg-white py-8 max-sm:px-2 sm:px-8 dark:border-slate-950 dark:bg-slate-800">
          <div className="mx-auto h-[160px] w-[160px] max-md:size-[80px]">
            <img
              alt="Josue De Los Santos"
              width={160}
              height={160}
              className="h-full w-full rounded-full object-cover ring-1 ring-blue-400  dark:ring-blue-500"
              src="/images/josuedelossantos.jpg"
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
              I understand the challenges of learning programming independently;
              it requires significant time, effort, and enthusiasm. However,
              with persistence, almost anything is possible.
            </p>

            <p>
              Whether you’re a seasoned developer or just starting out, I hope
              my experiences and insights inspire you to keep learning and
              growing. Let’s build something amazing together! 😊
            </p>
          </div>
          <div className="mt-16 py-8 text-center font-semibold">
            <h3>Find me elsewhere on the web as well:</h3>
          </div>
          <div className="mx-auto flex max-w-[500px] flex-wrap justify-center gap-4">
            <div>
              <a href="https://www.linkedin.com/in/josuedelossantos/">
                <div className="flex w-fit gap-2 rounded-[4px] bg-[#0A66C2] px-3 py-1">
                  <div className="size-3 h-5 w-5">
                    <img src={LinkedInIcon} alt="Linkedin icon" />
                  </div>
                  <div className="font-Linkedin flex items-center text-sm font-semibold text-white">
                    JOSUE DE LOS SANTOS
                  </div>
                </div>
              </a>
            </div>

            <div>
              <a href="https://x.com/joshcoder2000">
                <div className="flex w-fit gap-2 rounded-[4px] bg-[#000000] px-3 py-1">
                  <div className="size-3 h-5 w-5">
                    <img src={Xtwitter} alt="Xtwitter icon" />
                  </div>
                  <div className="font-Roboto flex items-center text-sm font-semibold text-white">
                    @joshcoder2000
                  </div>
                </div>
              </a>
            </div>

            <div>
              <a href="https://www.instagram.com/joshcoder2000/">
                <div className="instagram-background flex w-fit gap-2 rounded-[4px] px-3 py-1">
                  <div className="size-3 h-5 w-5">
                    <img src={InstagramIcon} alt="Instagram icon" />
                  </div>
                  <div className="font-Instagram flex items-center text-sm font-bold text-white">
                    joshcoder2000
                  </div>
                </div>
              </a>
            </div>

            <div>
              <a href="https://github.com/JosueDeLosSantos">
                <div className="flex w-fit gap-2 rounded-[4px] bg-[#000000] px-3 py-1">
                  <div className="size-3 h-5 w-5">
                    <img src={GithubIcon} alt="Github icon" />
                  </div>
                  <div className="font-Github flex items-center text-sm text-white">
                    JosueDeLosSantos
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default About;
