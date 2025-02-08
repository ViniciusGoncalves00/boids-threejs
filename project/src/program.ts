import "./styles.css";
import { ProgramManager } from "./program-manager";

export class Program {
    public static Main() : void {
        ProgramManager.GetInstance()
    }
}

Program.Main();