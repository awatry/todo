package net.watrys.todo.exception;

public class TodoListSaveException extends RuntimeException {
    public TodoListSaveException(Long id) {
        super("Could not save list " + id);
    }
}
