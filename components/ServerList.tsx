import Discord from "../src/Discord/index";
import styles from "./ServerList.module.css";

export default function ServerList({ discord }: {
     discord: Discord,
}) {
     return (
          <div className={styles.list}>
          </div>
     );
}