import { Tooltip } from "react-tooltip";
import { GuildInfo } from "../src/Discord/datatypes";
import { Dispatch, SetStateAction } from "react";

export default function ServerIcon({ file, tooltip, fallbackname, setCurrentGuild, id }: {
     file?: string;
     tooltip: string;
     fallbackname?: string;
     setCurrentGuild: Dispatch<SetStateAction<GuildInfo | undefined>>;
     id: GuildInfo;
}) {
     return (
          <div onClick={() => {
               setCurrentGuild(id);
          }}>
               {file != null ? <img src={file} alt={tooltip} data-tip={tooltip} width="60px" height="60px"  /> : <div style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#111f",
                    userSelect: "none",
                    opacity: ".8",
                    cursor: "pointer"
               }}>{fallbackname}</div>}
               <Tooltip>
                    {tooltip}
               </Tooltip>
          </div>
     );
}