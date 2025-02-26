export class InterfaceHelper {
    public static ImplementsInterface<T>(object: any, interfaceName: string): object is T {
        return object._interfaces?.includes(interfaceName);
    }
}