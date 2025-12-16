/**
 * Simple Service Container for Dependency Injection.
 * Singleton pattern ensuring one central registry for services.
 */
export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();

  private constructor() {}

  /**
   * Returns the singleton instance of the ServiceContainer.
   */
  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Registers a service instance.
   * @param id The unique identifier for the service (usually a string constant).
   * @param service The service instance to register.
   */
  public register<T>(id: string, service: T): void {
    this.services.set(id, service);
  }

  /**
   * Retrieves a registered service.
   * @param id The unique identifier of the service to retrieve.
   * @returns The service instance.
   * @throws Error if the service is not found.
   */
  public get<T>(id: string): T {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`Service ${id} not found`);
    }
    return service;
  }
}
