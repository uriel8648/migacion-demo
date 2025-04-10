// This file contains environment configuration for the Angular application
// It defines API endpoints and other environment-specific settings
// The environment.ts file is used during development

export interface TodoApiEndpoints {
  base: string;
  getAll: string;
  getById: string;
  create: string;
  update: string;
  delete: string;
  toggle: string;
}

export interface ApiUrls {
  base: string;
  todos: TodoApiEndpoints;
}

export interface FeatureFlags {
  enableCaching: boolean;
  enableLogging: boolean;
  enableAnimations: boolean;
}

export interface AppConfig {
  defaultPageSize: number;
  features: FeatureFlags;
}

export interface Environment {
  production: boolean;
  apiUrl: ApiUrls;
  config: AppConfig;
}

export const environment: Environment = {
  production: false,
  
  // API endpoints based on the Spring Boot REST controller paths
  apiUrl: {
    // Base URL for the Todo REST API
    base: '/api',
    
    // Todo specific endpoints
    todos: {
      base: '/api/todos',
      getAll: '/api/todos',
      getById: '/api/todos/', // append ID when calling
      create: '/api/todos',
      update: '/api/todos/', // append ID when calling
      delete: '/api/todos/', // append ID when calling
      toggle: '/api/todos/' // append ID + '/toggle' when calling
    }
  },
  
  // Configuration settings
  config: {
    // Default pagination settings
    defaultPageSize: 10,
    
    // Application feature flags
    features: {
      enableCaching: true,
      enableLogging: true,
      enableAnimations: true
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.