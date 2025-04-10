/**
 * Todo model representing a task in the application
 * 
 * This model is used throughout the application to represent todo items
 * and is the TypeScript equivalent of the Java Todo entity from the backend.
 */
export interface Todo {
  /**
   * Unique identifier for the todo item
   */
  id?: number;
  
  /**
   * Title of the todo item (required)
   */
  title: string;
  
  /**
   * Optional description providing more details about the todo
   */
  description: string;
  
  /**
   * Flag indicating whether the todo has been completed
   */
  completed: boolean;
  
  /**
   * Optional creation date of the todo
   */
  createdDate?: Date;
  
  /**
   * Optional last modified date of the todo
   */
  lastModifiedDate?: Date;
}

/**
 * Factory function to create a new empty Todo object
 * This provides a consistent way to initialize new Todo items throughout the application
 */
export function createEmptyTodo(): Todo {
  return {
    id: 0, // Valor predeterminado
    title: '',
    description: '',
    completed: false
  };
}