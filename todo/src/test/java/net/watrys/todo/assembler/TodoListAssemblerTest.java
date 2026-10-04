package net.watrys.todo.assembler;

import net.watrys.todo.model.TodoList;
import org.junit.jupiter.api.Test;

import org.springframework.hateoas.EntityModel;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class TodoListAssemblerTest {

    @Test
    void testToModel() {
        TodoListAssembler assembler = new TodoListAssembler();
        TodoList todoList = TodoList.builder()
                .id(1L)
                .title("Test Title")
                .position(1)
                .build();

        EntityModel<TodoList> model = assembler.toModel(todoList);

        assertNotNull(model);
        assertEquals(todoList, model.getContent());
        assertEquals(2, model.getLinks().toList().size());

        assertEquals("self", model.getLink("self").get().getRel().toString());
        //assertEquals("todo-lists", model.getLink().getRel());
    }
}
