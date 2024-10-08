import * as React from 'react'
import { cn } from '../../lib/utils'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Input = React.forwardRef(({ className, type, variant, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

    const togglePasswordVisibility = (event) => {
        event.preventDefault()
        setIsPasswordVisible((prev) => !prev)
        if (ref.current) {
            ref.current.focus()
        }
    }

    return (
        <div className='relative'>
            <input
                type={variant === 'password' && !isPasswordVisible ? 'password' : 'text'}
                className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80 disabled:bg-brandGray',
                    className
                )}
                ref={ref}
                {...props}
            />
            {variant === 'password' && (
                <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='absolute bg-white w-8 h-8 z-50 right-1 top-1/2 transform -translate-y-1/2'>
                    {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export { Input }
