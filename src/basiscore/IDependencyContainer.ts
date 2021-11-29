export default interface IDependencyContainer {
  register<T>(
    token: InjectionToken<T>,
    provider: ValueProvider<T>
  ): IDependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: FactoryProvider<T>
  ): IDependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: TokenProvider<T>,
    options?: RegistrationOptions
  ): IDependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: ClassProvider<T>,
    options?: RegistrationOptions
  ): IDependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: constructor<T>,
    options?: RegistrationOptions
  ): IDependencyContainer;
  registerSingleton<T>(
    from: InjectionToken<T>,
    to: InjectionToken<T>
  ): IDependencyContainer;
  registerSingleton<T>(token: constructor<T>): IDependencyContainer;
  registerType<T>(
    from: InjectionToken<T>,
    to: InjectionToken<T>
  ): IDependencyContainer;
  registerInstance<T>(
    token: InjectionToken<T>,
    instance: T
  ): IDependencyContainer;
  /**
   * Resolve a token into an instance
   *
   * @param token The dependency token
   * @return An instance of the dependency
   */
  resolve<T>(token: InjectionToken<T>): T;
  resolveAll<T>(token: InjectionToken<T>): T[];
  /**
   * Check if the given dependency is registered
   *
   * @param token The token to check
   * @param recursive Should parent containers be checked?
   * @return Whether or not the token is registered
   */
  isRegistered<T>(token: InjectionToken<T>, recursive?: boolean): boolean;
  /**
   * Clears all registered tokens
   */
  reset(): void;
  clearInstances(): void;
  createChildContainer(): IDependencyContainer;
}

declare type InjectionToken<T = any> = constructor<T> | string | symbol;

export interface ValueProvider<T> {
  useValue: T;
}

export interface FactoryProvider<T> {
  useFactory: (dependencyContainer: IDependencyContainer) => T;
}

export interface TokenProvider<T> {
  useToken: string;
}

export declare type constructor<T> = {
  new (...args: any[]): T;
};

export interface ClassProvider<T> {
  useClass: constructor<T> | DelayedConstructor<T>;
}

export declare class DelayedConstructor<T> {
  private wrap;
  private reflectMethods;
  constructor(wrap: () => constructor<T>);
  createProxy(createObject: (ctor: constructor<T>) => T): T;
  private createHandler;
}

export declare enum Lifecycle {
  Transient = 0,
  Singleton = 1,
  ResolutionScoped = 2,
  ContainerScoped = 3,
}

export declare type RegistrationOptions = {
  /**
   * Customize the lifecycle of the registration
   * See https://github.com/microsoft/tsyringe#available-scopes for more information
   */
  lifecycle: Lifecycle;
};
