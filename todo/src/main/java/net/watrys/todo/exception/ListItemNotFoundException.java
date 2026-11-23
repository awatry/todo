package net.watrys.todo.exception;

public class ListItemNotFoundException extends RuntimeException {
    public ListItemNotFoundException(Long id) {
        super("Could not find list item " + id);
    }
}
