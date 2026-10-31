package net.watrys.todo.controller;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import net.watrys.todo.api.ListItemApi;
import net.watrys.todo.assembler.ListItemAssembler;
import net.watrys.todo.dto.ListItem;
import net.watrys.todo.dto.ListItemCollectionItem;
import net.watrys.todo.repository.ListItemRepository;

@RestController
@RequestMapping("/api/list-items")
public class ListItemController implements ListItemApi {

    private final ListItemRepository repository;

    private final ListItemAssembler assembler;

    ListItemController(ListItemRepository repository, ListItemAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @Override
    @PostMapping
    public ResponseEntity<ListItemCollectionItem> createListItem(@Valid ListItem createListItemRequest) {
        net.watrys.todo.model.ListItem todoList = dtoToEntity(createListItemRequest);
        EntityModel<net.watrys.todo.model.ListItem> entityModel = assembler.toModel(repository.save(todoList));
        ListItemCollectionItem dto = entityToCollectionItem(entityModel.getContent());

        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(dto);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<ListItemCollectionItem>> getListItemsForList(@NotNull @Valid Long listId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getListItemsForList'");
    }

    public ResponseEntity<ListItem> getListItem(@NotNull @Valid long listItemId) {
        return null;
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

    private net.watrys.todo.model.ListItem.ItemType dtoTypeToEntityType(ListItem.TypeEnum dtoType) {
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

    private ListItemCollectionItem.TypeEnum entityTypeToDtoType(net.watrys.todo.model.ListItem.ItemType entityType) {
        if (entityType == null) {
            return null;
        }
        switch (entityType) {
            case LIST_ITEM:
                return ListItemCollectionItem.TypeEnum.LIST_ITEM;
            case SECTION:
                return ListItemCollectionItem.TypeEnum.SECTION;
            default:
                throw new IllegalArgumentException("Unknown enum type");
        }
    }

    private ListItemCollectionItem entityToCollectionItem(net.watrys.todo.model.ListItem entity) {
        ListItemCollectionItem ci = new ListItemCollectionItem();

        ci.setTitle(entity.getTitle());
        ci.setPosition(entity.getPosition());
        ci.setTodoListId(entity.getTodoListId());
        ci.setParentId(entity.getParentId());
        ci.setItemText(entity.getItemText());
        ci.setComplete(entity.getComplete());
        ci.setType(entityTypeToDtoType(entity.getType()));
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
