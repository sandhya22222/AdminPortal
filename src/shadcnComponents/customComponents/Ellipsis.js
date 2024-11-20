import { Tooltip, TooltipContent, TooltipTrigger } from '../../shadcnComponents/ui/tooltip'

const Ellipsis = ({ text, position, styles = {}, ...props }) => {
    return (
        <div className='space-y-4'>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className='overflow-hidden text-ellipsis whitespace-nowrap'
                        style={{ ...styles }} // Allows all other styles (padding, margin, border, etc.) to be passed when called
                        {...props}>
                        {text}
                    </div>
                </TooltipTrigger>
                <TooltipContent side={position}>
                    <span>{text}</span>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export default Ellipsis

{
    /* Example Usage of Ellipsis Component
  <Ellipsis 
  text="Some long text that will be truncated"
  styles={{
    width: '50px', 
    padding: '5px',
    fontSize: '14px', 
  }} 
/> */
}
