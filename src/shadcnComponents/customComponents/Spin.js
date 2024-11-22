const Spin = ({ text, overlay, className, spinning = true, children }) => {
    return (
        <>
            {spinning ? (
                <div>
                    {children}
                    <div
                        className={`${
                            overlay
                                ? 'absolute inset-0 z-10 flex items-center  justify-center bg-white/5 backdrop-blur-sm'
                                : 'relative flex items-center justify-center'
                        } ${className}  `}>
                        <div className='flex flex-col items-center'>
                            <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-brandPrimaryColor'></div>
                            {!!text && <p className='mt-4 text-lg font-semibold text-brandPrimaryColor'>{text}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <> {children}</>
            )}
        </>
    )
}

export default Spin
