import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 text-center group/design-root overflow-hidden dark:bg-background-dark">
      <div className="absolute inset-0 z-0">
        <svg
          className="text-navy opacity-5"
          height="100%"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              height="40"
              id="dot-pattern"
              patternUnits="userSpaceOnUse"
              width="40"
            >
              <circle cx="2" cy="2" fill="currentColor" r="1"></circle>
            </pattern>
          </defs>
          <rect fill="url(#dot-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>
      <main className="relative z-10 flex flex-col items-center justify-center gap-4">
        <h1 className="text-navy tracking-tighter text-8xl md:text-9xl font-black leading-tight">
          404
        </h1>

        <h2 className="text-navy text-3xl md:text-4xl font-bold leading-tight tracking-tight">
          Page Not Found
        </h2>

        <p className="text-navy max-w-md text-base font-normal leading-normal">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex pt-6 justify-center">
          <Link
            to="/"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200"
          >
            <span className="truncate">Return to Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
