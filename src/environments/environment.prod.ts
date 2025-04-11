import { Environment } from './environment';

export const environment: Environment = {
  production: true,
  
  // API endpoints configuration
  apiUrl: {
    // Base URL for the API
    base: '',
    
    // Todo endpoints matching Java controller
    todos: {
      base: '/todos',
      getAll: '/todos',
      getById: '/todos/', // append ID when calling
      create: '/todos',
      update: '/todos/', // append ID when calling
      delete: '/todos/', // append ID + '/delete' when calling
      toggle: '/todos/' // append ID + '/toggle' when calling
    }
  },
  
  // Configuration settings
  config: {
    // Default pagination settings
    defaultPageSize: 10,
    
    // Application feature flags
    features: {
      enableCaching: true,
      enableLogging: false,
      enableAnimations: false
    }
  }
};
