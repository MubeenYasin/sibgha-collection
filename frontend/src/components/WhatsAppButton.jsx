const WhatsAppButton = () => {
    const phoneNumber = '923245548100'
    const message = 'Hello! I am interested in your products at Sibgha Collection.'

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    return (
        <button
            onClick={handleClick}
            className="fixed flex items-center justify-center w-14 h-14 bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg z-50 transition-transform hover:scale-110"
            aria-label="Contact us on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                fill="currentColor"
            >
                <path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.646.86 5.094 2.317 7.084L4.5 28.5l6.564-1.751a11.94 11.94 0 0 0 4.937 1.052h.001c6.628 0 12.001-5.373 12.001-12.001C28.003 8.373 22.629 3 16.001 3zm0 21.808a9.78 9.78 0 0 1-4.987-1.366l-.358-.213-3.896 1.04 1.04-3.797-.232-.39a9.768 9.768 0 0 1-1.498-5.082c0-5.4 4.394-9.793 9.93-9.793 5.535 0 9.929 4.393 9.929 9.793 0 5.4-4.394 9.808-9.928 9.808zm5.453-7.336c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.149-.668.149-.198.298-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.473-.883-.787-1.48-1.76-1.653-2.058-.173-.298-.018-.459.13-.607.134-.133.298-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.578-.486-.5-.668-.51-.173-.008-.371-.01-.569-.01a1.09 1.09 0 0 0-.792.372c-.272.298-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.078 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.569-.347z"/>
            </svg>
        </button>
    )
}

export default WhatsAppButton