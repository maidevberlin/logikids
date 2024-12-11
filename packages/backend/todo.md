1. Add unit tests for services and controllers
2. api tests
3. Add API documentation
4. add service container and use it in the code
    ```ts
    class ServiceContainer {
     private static instance: ServiceContainer;
     private services: Map<string, any> = new Map();
     
     static getInstance(): ServiceContainer {
       if (!ServiceContainer.instance) {
         ServiceContainer.instance = new ServiceContainer();
       }
       return ServiceContainer.instance;
     }
     
     registerService<T>(key: string, service: T): void {
       this.services.set(key, service);
     }
   }
    ```
6. Use YAML anchors and aliases to reduce duplication
7. Add version control for prompts
8. Add debug logs with config-based switch
