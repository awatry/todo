package net.watrys.todo.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import net.watrys.todo.api.ListItemApi;
import net.watrys.todo.assembler.ListItemAssembler;
import net.watrys.todo.dto.ListItem;
import net.watrys.todo.dto.ListItemCollectionItem;
import net.watrys.todo.dto.ListItemType;
import net.watrys.todo.repository.ListItemRepository;
import net.watrys.todo.repository.TodoListRepository;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/list-items")
public class ListItemController implements ListItemApi {

    private final ListItemRepository repository;

    private final TodoListRepository todoListRepository;

    private final ListItemAssembler assembler;

    ListItemController(
            ListItemRepository repository, TodoListRepository todoListRepository, ListItemAssembler assembler) {
        this.repository = repository;
        this.todoListRepository = todoListRepository;
        this.assembler = assembler;
    }

    @Override
    @PostMapping
    public ResponseEntity<ListItemCollectionItem> createListItem(@Valid ListItem createListItemRequest) {
        net.watrys.todo.model.ListItem todoList = dtoToEntity(createListItemRequest);
        EntityModel<net.watrys.todo.model.ListItem> entityModel = assembler.toModel(repository.save(todoList));
        ListItemCollectionItem dto = entityToCollectionItem(entityModel.getContent());

        return ResponseEntity.created(
                        entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(dto);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<ListItemCollectionItem>> getListItemsForList(@NotNull @Valid Long listId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getListItemsForList'");
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ListItem> getListItem(Long listItemId) {
        net.watrys.todo.model.ListItem entity = repository.getReferenceById(listItemId);
        ListItem dto = entityToDto(entity);
        return ResponseEntity.ok(dto);
    }

    private ListItem entityToDto(net.watrys.todo.model.ListItem entity) {
        ListItem dto = new ListItem(entity.getTitle(), entity.getPosition(), entityTypeToDtoType(entity.getType()));

        dto.setId(entity.getId());

        dto.setCreatedAt(toODT(entity.getCreatedAt()));
        dto.setCreatedBy(entity.getCreatedBy());
        dto.updatedAt(toODT(entity.getUpdatedAt()));
        dto.setUpdatedBy(entity.getUpdatedBy());

        dto.setParentId(entity.getParentId());
        dto.setComplete(entity.getComplete());

        dto.setTodoListId(entity.getTodoListId());
        dto.setParentId(entity.getParentId());
        dto.setItemText(entity.getItemText());
        dto.setComplete(entity.getComplete());
        dto.setType(entityTypeToDtoType(entity.getType()));

        if (entity.getSubItems() != null) {
            dto.setSubItems(entity.getSubItems().stream().map(this::entityToDto).toList());
        }

        dto.setSubItems(null);

        return dto;
    }

    private OffsetDateTime toODT(Instant instant) {
        if (instant == null) {
            return null;
        }
        return OffsetDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    private net.watrys.todo.model.ListItem dtoToEntity(net.watrys.todo.dto.ListItem dto) {
        net.watrys.todo.model.ListItem entity = new net.watrys.todo.model.ListItem();
        entity.setTitle(dto.getTitle());
        entity.setPosition(dto.getPosition());
        entity.setTodoListId(dto.getTodoListId());
        entity.setParentId(dto.getParentId());
        entity.setItemText(dto.getItemText());
        entity.setComplete(dto.getComplete());
        entity.setType(dtoTypeToEntityType(dto.getType()));
        entity.setId(dto.getId());
        return entity;
    }

    private net.watrys.todo.model.ListItem.ItemType dtoTypeToEntityType(ListItemType dtoType) {
        if (dtoType == null) {
            return null;
        }
        switch (dtoType) {
            case LIST_ITEM:
                return net.watrys.todo.model.ListItem.ItemType.LIST_ITEM;
            case SECTION:
                return net.watrys.todo.model.ListItem.ItemType.SECTION;
            default:
                throw new IllegalArgumentException("Unknown enum type");
        }
    }

    private ListItemType entityTypeToDtoType(net.watrys.todo.model.ListItem.ItemType entityType) {
        if (entityType == null) {
            return null;
        }
        switch (entityType) {
            case LIST_ITEM:
                return ListItemType.LIST_ITEM;
            case SECTION:
                return ListItemType.SECTION;
            default:
                throw new IllegalArgumentException("Unknown enum type");
        }
    }

    private ListItemCollectionItem entityToCollectionItem(net.watrys.todo.model.ListItem entity) {
        ListItemCollectionItem ci = new ListItemCollectionItem();

        ci.setTitle(entity.getTitle());
        ci.setPosition(entity.getPosition());
        ci.setTodoListId(entity.getTodoListId());
        ci.setParentTitle(entity.getParentTitle());
        ci.setParentId(entity.getParentId());
        ci.setItemText(entity.getItemText());
        ci.setComplete(entity.getComplete());
        ci.setType(entityTypeToDtoType(entity.getType()));
        ci.setId(entity.getId());
        if (entity.getParentTitle() == null && entity.getTodoListId() != null) {
            todoListRepository.findById(entity.getTodoListId().longValue()).ifPresent(entity::setTodoList);
        }
        ci.setParentTitle(entity.getParentTitle());
        if (entity.getCreatedAt() != null) {
            ci.setCreatedAt(toODT(entity.getCreatedAt()));
        }
        ci.setCreatedBy(entity.getCreatedBy());
        ci.setUpdatedBy(entity.getUpdatedBy());
        if (entity.getUpdatedAt() != null) {
            ci.setUpdatedAt(toODT(entity.getUpdatedAt()));
        }
        return ci;
    }
}
