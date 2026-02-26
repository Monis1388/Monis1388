const Footer = () => {
    return (
        <footer className="border-t border-gray-100 py-12 mt-auto bg-white">
            <div className="container mx-auto text-center">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">&copy; {new Date().getFullYear()} Frame & Sunglasses. All rights reserved.</p>
            </div>
        </footer>
    )
}
export default Footer;
