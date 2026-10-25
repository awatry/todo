package net.watrys.todo.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import net.watrys.todo.api.DefaultApi;
import net.watrys.todo.assembler.TodoListAssembler;
import net.watrys.todo.dto.TodoListCollectionItem;
import net.watrys.todo.exception.TodoListNotFoundException;
import net.watrys.todo.exception.TodoListSaveException;
import net.watrys.todo.model.TodoList;
//https://github.com/spring-guides/tut-rest/blob/main/links/src/main/java/payroll/EmployeeController.java
import net.watrys.todo.repository.TodoListRepository;

@RestController
@RequestMapping("/api/todo-lists")
public class TodoListController implements DefaultApi {

    private final TodoListRepository repository;

    private final TodoListAssembler assembler;

    TodoListController(TodoListRepository repository, TodoListAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @Override
    @PostMapping
    public ResponseEntity<TodoListCollectionItem> createTodoList(
            @Valid net.watrys.todo.dto.TodoList createTodoListRequest) {
        TodoList todoList = dtoToEntity(createTodoListRequest);
        EntityModel<TodoList> entityModel = assembler.toModel(repository.save(todoList));
        TodoListCollectionItem dto = entityToCollectionItem(entityModel.getContent());

        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(dto);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<TodoListCollectionItem>> getAllTodoLists() {
        List<TodoListCollectionItem> todoLists = repository.findAll().stream() //
                .map(this::entityToCollectionItem)
                .map(this::addSelfLink)
                .toList();

        return ResponseEntity.ok(todoLists);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<TodoListCollectionItem> getTodoListById(Long id) {
        TodoList todo = repository.findById(id).orElseThrow(() -> new TodoListNotFoundException(id));
        return ResponseEntity.ok(addSelfLink(entityToCollectionItem(todo)));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<TodoListCollectionItem> updateTodoListById(Long id,
            @Valid net.watrys.todo.dto.TodoList dto) {
        TodoList entity = repository.findById(id).orElseThrow(() -> new TodoListNotFoundException(id));
        if (entity.getId() != dto.getId()) {
            throw new TodoListSaveException(id);
        }

        TodoList dtoModel = dtoToEntity(dto);
        TodoListCollectionItem saved = entityToCollectionItem(repository.save(dtoModel));
        return ResponseEntity.ok(addSelfLink(saved));
    }

    private TodoListCollectionItem addSelfLink(TodoListCollectionItem saved) {
        EntityModel<TodoListCollectionItem> em = EntityModel.of(saved,
                linkTo(methodOn(TodoListController.class).getTodoListById(saved.getId())).withSelfRel());
        saved.setSelf(em.getLink("self").get().toUri());
        return saved;
    }

    private TodoList dtoToEntity(net.watrys.todo.dto.TodoList dto) {
        TodoList entity = new TodoList(dto.getTitle(), dto.getPosition());
        entity.setId(dto.getId());
        return entity;
    }

    private TodoListCollectionItem entityToCollectionItem(TodoList entity) {
        TodoListCollectionItem ci = new TodoListCollectionItem(entity.getTitle(), entity.getPosition());
        ci.setId(entity.getId());
        if (entity.getCreatedAt() != null) {
            ci.setCreatedAt(OffsetDateTime.ofInstant(entity.getCreatedAt(), ZoneId.systemDefault()));
        }
        ci.setCreatedBy(entity.getCreatedBy());
        ci.setUpdatedBy(entity.getUpdatedBy());
        if (entity.getUpdatedAt() != null) {
            ci.setUpdatedAt(OffsetDateTime.ofInstant(entity.getUpdatedAt(), ZoneId.systemDefault()));
        }
        return ci;
    }
}