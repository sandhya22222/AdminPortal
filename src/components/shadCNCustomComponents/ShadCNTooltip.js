import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../shadcnComponents/ui/tooltip'
const ShadCNTooltip = ({ children, content }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {children} {/* The element that will trigger the tooltip */}
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white rounded p-2 text-xs'>
                    {content} {/* The content that will show inside the tooltip */}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ShadCNTooltip
