const ImageHeader = () => {
  return (
    <header className="p-6 pb-4 bg-background-light">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="w-44 h-44 md:w-72 md:h-72 rounded-full overflow-hidden border border-black">
            <img
              alt="Shwe Myint Moe Dream Logo"
              className="w-full h-full object-cover"
              src="/ShweMyintMoeDream_Logo.jpg"
            />
          </div>

          <div>
            <h1 className="mb-4 md:mb-6 font-header text-2xl md:text-4xl text-primary">
              Shwe Myint Moe Dream
            </h1>
            <p className="font-header text-light-secondary text-lg md:text-xl text-center">
              Inn Pyin Home
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ImageHeader;
