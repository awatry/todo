package net.watrys.todo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import net.watrys.todo.api.ListItemApi;
import net.watrys.todo.dto.ListItem;
import net.watrys.todo.dto.ListItemCollectionItem;

public class ListItemController implements ListItemApi{

    //private final ListItemRepository repository;

    //private final ListItemAssembler assembler;

    // TodoListController(TodoListRepository repository, TodoListAssembler assembler) {
    //     this.repository = repository;
    //     this.assembler = assembler;
    // }

    @Override
    @PostMapping
    public ResponseEntity<ListItemCollectionItem> createListItem(@Valid ListItem listItem) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createListItem'");
    }

    @Override
    @GetMapping
    public ResponseEntity<List<ListItemCollectionItem>> getListItemsForList(@NotNull @Valid Long listId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getListItemsForList'");
    }

}
