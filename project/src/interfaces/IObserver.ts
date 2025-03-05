interface IObserver {
    Update(subject: ISubject, args?: string[]): any;
}