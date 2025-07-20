// registry.ts
type SyncBinding = (...args: any[]) => any;
type AsyncBinding = (...args: any[]) => Promise<any>;
type BindingFunction = SyncBinding | AsyncBinding;
class BindingRegistry {
  private bindings: Record<string, BindingFunction> = {};

  /**
   * Register a single function
   */
  register(name: string, fn: BindingFunction): void;

  /**
   * Register multiple functions at once
   */
  register(functions: Record<string, BindingFunction>): void;

  register(
    nameOrFunctions: string | Record<string, BindingFunction>,
    fn?: BindingFunction,
  ) {
    if (typeof nameOrFunctions === "string" && fn) {
      console.log(`📝 Registering binding: ${nameOrFunctions}`);
      this.bindings[nameOrFunctions] = fn;
    } else if (typeof nameOrFunctions === "object") {
      console.log(
        `📝 Registering ${Object.keys(nameOrFunctions).length} bindings`,
      );
      Object.assign(this.bindings, nameOrFunctions);
    }
  }

  /**
   * Get all registered bindings
   */
  getAll(): Record<string, BindingFunction> {
    return { ...this.bindings };
  }

  /**
   * Get binding names
   */
  getNames(): string[] {
    return Object.keys(this.bindings);
  }

  /**
   * Clear all bindings
   */
  clear(): void {
    this.bindings = {};
  }

  /**
   * Check if binding exists
   */
  has(name: string): boolean {
    return name in this.bindings;
  }
}

// Instance globale unique
export const bindingRegistry = new BindingRegistry();

// API simple pour les utilisateurs
export const registerBinding = bindingRegistry.register.bind(bindingRegistry);

// Export du type pour usage externe
export type { BindingFunction };
