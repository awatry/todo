package net.watrys.todo.exception;

public class TodoListNotFoundException extends RuntimeException{
    public TodoListNotFoundException(Long id){
        super("Could not find list "+id);
    }
}
