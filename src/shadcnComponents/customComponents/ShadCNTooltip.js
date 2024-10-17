import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
const ShadCNTooltip = ({ children, content, position, width }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {children} {/* The element that will trigger the tooltip */}
                </TooltipTrigger>
                <TooltipContent
                    className='bg-black text-white rounded p-2 text-xs'
                    side={position}
                    style={{ width: width ? width : 'auto' }}>
                    {content} {/* The content that will show inside the tooltip */}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ShadCNTooltip
