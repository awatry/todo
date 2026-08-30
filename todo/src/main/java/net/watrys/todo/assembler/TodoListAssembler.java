package net.watrys.todo.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import net.watrys.todo.controller.TodoListController;
import net.watrys.todo.model.TodoList;

@Component
public class TodoListAssembler implements RepresentationModelAssembler<TodoList, EntityModel<TodoList>> {
    @Override
    public EntityModel<TodoList> toModel(TodoList list){
        return EntityModel.of(list, 
            linkTo(methodOn(TodoListController.class).one(list.getId())).withSelfRel(),
            linkTo(methodOn(TodoListController.class).all()).withRel("todo-lists")
        );
    }

}
