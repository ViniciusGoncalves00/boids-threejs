import { SceneManager } from "../managers/scene-manager";

export class UISceneHandler implements IObserver {
    public CreaturesAlive: number = 0;

    public Update(subject: ISubject) {
        if(subject instanceof SceneManager) {
            this.CreaturesAlive = subject.CreaturesAlive();
        }
    }
}