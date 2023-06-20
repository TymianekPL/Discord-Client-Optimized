import { Tooltip } from "react-tooltip";

export default function ServerIcon({ file, tooltip }: {
     file: string;
     tooltip: string;
}) {
     return (
          <div>
               <img src={file} alt={tooltip} style={{borderRadius: "50%", width: "50px"}} data-tip={tooltip} />
               <Tooltip >
                    {tooltip}
               </Tooltip>
          </div>
     );
}