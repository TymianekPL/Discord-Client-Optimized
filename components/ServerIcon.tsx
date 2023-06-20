import { Tooltip } from "react-tooltip";

export default function ServerIcon({ file, tooltip }: {
     file: string;
     tooltip: string;
}) {
     return (
          <div>
               <img src={file} alt={tooltip} data-tip={tooltip} />
               <Tooltip >
                    {tooltip}
               </Tooltip>
          </div>
     );
}