package net.watrys.todo.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.watrys.todo.assembler.TodoListAssembler;
import net.watrys.todo.exception.TodoListNotFoundException;
import net.watrys.todo.exception.TodoListSaveException;
import net.watrys.todo.model.TodoList;
//https://github.com/spring-guides/tut-rest/blob/main/links/src/main/java/payroll/EmployeeController.java
import net.watrys.todo.repository.TodoListRepository;

@RestController
@RequestMapping("/api/todo-lists")
public class TodoListController {

    private final TodoListRepository repository;

    private final TodoListAssembler assembler;

    TodoListController(TodoListRepository repository, TodoListAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping
    public CollectionModel<EntityModel<TodoList>> all() {
        List<EntityModel<TodoList>> todoLists = repository.findAll().stream() //
                .map(assembler::toModel) //
                .toList();

        return CollectionModel.of(todoLists, linkTo(methodOn(TodoListController.class).all()).withSelfRel());
    }

    @PostMapping
    public ResponseEntity<?> newList(@RequestBody TodoList todoList) {
        EntityModel<TodoList> entityModel = assembler.toModel(repository.save(todoList));
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @GetMapping("/{id}")
    public EntityModel<TodoList> one(@PathVariable Long id) {
        TodoList todo = repository.findById(id).orElseThrow(() -> new TodoListNotFoundException(id));
        return assembler.toModel(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateList(@PathVariable Long id, @RequestBody TodoList todoList) {
        TodoList todo = repository.findById(id).orElseThrow(() -> new TodoListNotFoundException(id));
        if (todo.getId() != todoList.getId()) {
            throw new TodoListSaveException(id);
        }

        EntityModel<TodoList> entityModel = assembler.toModel(repository.save(todoList));
        return ResponseEntity.ok(entityModel);
    }
}