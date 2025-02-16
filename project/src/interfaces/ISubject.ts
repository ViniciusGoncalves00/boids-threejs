interface ISubject {
    Attach(observer: IObserver): void;
    Dettach(observer: IObserver): void;
    Notify(): void;
}