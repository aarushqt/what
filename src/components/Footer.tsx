const Footer = () => {
    return (
        <footer className="bg-red-100 border-t-2 py-6 mt-auto font-lexend">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div>
                            <a href="https://github.com/funinkina/gf-grievance-portal" target="_blank" className="flex items-center gap-2 hover:underline text-black">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 2H9V4H7V6H5V2Z" fill="black" />
                                    <path d="M5 12H3V6H5V12Z" fill="black" />
                                    <path d="M7 14H5V12H7V14Z" fill="black" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 16V14H7V16H3V14H1V16H3V18H7V22H9V18H11V16H9ZM9 16V18H7V16H9Z" fill="black" />
                                    <path d="M15 4V6H9V4H15Z" fill="black" />
                                    <path d="M19 6H17V4H15V2H19V6Z" fill="black" />
                                    <path d="M19 12V6H21V12H19Z" fill="black" />
                                    <path d="M17 14V12H19V14H17Z" fill="black" />
                                    <path d="M15 16V14H17V16H15Z" fill="black" />
                                    <path d="M15 18H13V16H15V18Z" fill="black" />
                                    <path d="M15 18H17V22H15V18Z" fill="black" />
                                </svg>
                                <p>Open Source</p>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h2>Created by &nbsp;
                            <a href="https://github.com/funinkina" target="_blank" className="underline text-black font-bold">
                                @funinkina</a> and &nbsp;
                            <a href="https://www.linkedin.com/in/abhiruchi-patil-bhagat-22b025235/" target="_blank" className="underline text-black font-bold">
                                Abhiruchi Patil</a>
                        </h2>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;