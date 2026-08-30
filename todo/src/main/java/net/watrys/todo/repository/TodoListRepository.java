package net.watrys.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.watrys.todo.model.TodoList;

@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long>{

}
