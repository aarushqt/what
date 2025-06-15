const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-red-100 border-t py-6 mt-auto font-lexend">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">
                            © {currentYear} Girlfriend Grievance Portal
                        </p>
                    </div>
                    <div>
                        <h2>Created by <a href="https://github.com/funinkina" target="_blank" className="underline text-black">@funinkina</a></h2>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;