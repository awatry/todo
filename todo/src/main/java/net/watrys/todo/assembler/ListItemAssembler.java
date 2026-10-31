package net.watrys.todo.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import net.watrys.todo.controller.ListItemController;
import net.watrys.todo.dto.ListItemCollectionItem;
import net.watrys.todo.model.ListItem;

@Component
public class ListItemAssembler implements RepresentationModelAssembler<ListItem, EntityModel<ListItem>> {
    @Override
    public EntityModel<ListItem> toModel(ListItem listItem) {
        return EntityModel.of(listItem,
                linkTo(methodOn(ListItemController.class).getListItem(listItem.getId())).withSelfRel()
        // ,
        // linkTo(methodOn(TodoListController.class).getTodoListById(listItem.getTodoListId().longValue()).withRel("todo-lists")
        );
    }

    public EntityModel<ListItemCollectionItem> toModel(ListItemCollectionItem listItem) {
        return EntityModel.of(listItem,
                linkTo(methodOn(ListItemController.class).getListItem(listItem.getId())).withSelfRel()
        // linkTo(methodOn(ListItemController.class).getAllTodoLists()).withRel("todo-lists")
        );
    }

}
