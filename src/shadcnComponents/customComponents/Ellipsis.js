import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "../../shadcnComponents/ui/tooltip"; 
  
  const Ellipsis = ({ text, ...props }) => {
    return (
      <div className="space-y-4">
        <Tooltip>
          <TooltipTrigger>
            <div
              className="w-full max-w-xs rounded-[6px] overflow-hidden text-ellipsis whitespace-nowrap border border-gray-300 px-3 py-2"
              {...props}
            >
              {text}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <span>{text}</span>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };
  
  export default Ellipsis;
  