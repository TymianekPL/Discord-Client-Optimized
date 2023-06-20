import { Tooltip } from "react-tooltip";

export default function ServerIcon({ file, tooltip, fallbackname }: {
     file?: string;
     tooltip: string;
     fallbackname?: string;
}) {
     return (
          <div>
               {file != null ? <img src={file} alt={tooltip} data-tip={tooltip} width="60px" height="60px" style={{
                    borderRadius: "50%"
               }} /> : <div style={{
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000"
               }}>{fallbackname}</div>}
               <Tooltip>
                    {tooltip}
               </Tooltip>
          </div>
     );
}