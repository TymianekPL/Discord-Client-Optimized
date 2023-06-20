import { Tooltip } from "react-tooltip";

export default function ServerIcon({ file, tooltip, callback }: {
     file: string;
     tooltip: string;
     callback: () => Promise<void>;
}) {
     return (
          <div onClick={callback}>
               <img src={file} alt={tooltip} data-tip={tooltip} />
               <Tooltip >
                    {tooltip}
               </Tooltip>
          </div>
     );
}